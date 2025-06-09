import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import * as faceapi from "face-api.js";

import MainLayout from "@/layouts/MainLayout.tsx";
import RecommendedSongs from "@/components/RecommendedSongs.tsx";
import MusicPlayer from "@/components/MusicPlayer.tsx";

// --- Các interface và hằng số không đổi ---
interface Song {
  id: number;
  name: string;
  description: string;
  coverPhoto: string;
  resourceLink: string;
}
const emotionMap: { [key: string]: number } = { neutral: 1, happy: 2, sad: 3, angry: 4, fearful: 5, disgusted: 6, surprised: 7 };
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImhhcGh1dGhpbmgiLCJyb2xlIjoibGlzdGVuZXIiLCJpYXQiOjE3NDk0NDM5NDQsImV4cCI6MjAwODY0Mzk0NH0.QHgyuGIP3aCTgMFSsWKONFBXjLbwTY4GfQxEZaastEc";
const RECOMMEND_API_URL = "https://api-emobeat.sonata.io.vn/api/v1/recommender/songs?topN=10";
const COLLECT_API_URL = "https://api-emobeat.sonata.io.vn/emotion-collector-service/api/v1/emotion-collect/collect";

export const Home: React.FC = () => {
  // --- Các state không đổi ---
  const [songs, setSongs] = useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
  
  // --- State và Ref cho Webcam & Nhận diện cảm xúc ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); // Ref cho thẻ <audio>
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>("Initializing...");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
  

  // --- HÀM GỬI SỰ KIỆN TƯƠNG TÁC ---
  const trackEvent = async (eventName: string, details: { musicId: number, play_percentage?: number }) => {
    const emotionId = emotionMap[currentEmotion] || emotionMap['neutral']; // Lấy emotion gần nhất
    const body = {
      userId: 1,
      musicId: details.musicId,
      emotion: emotionId,
      event: eventName,
      play_percentage: details.play_percentage
    };

    console.log(`Tracking Event: ${eventName}`, body);
    try {
      await axios.post(COLLECT_API_URL, body, {
        headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
      });
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error);
    }
  };

    
  // --- HÀM TÁI SỬ DỤNG: GỌI API LẤY DANH SÁCH GỢI Ý ---
  const fetchRecommendedSongs = useCallback(async () => {
    console.log("Fetching new recommended songs...");
    setLoadingSongs(true);
    try {
      const response = await axios.get(RECOMMEND_API_URL, {
        headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
      });
      const result = response.data;
      if (result.success && Array.isArray(result.data)) {
        setSongs(result.data);
      } else {
        throw new Error(result.message || "Could not fetch songs.");
      }
    } catch (err: unknown) {
        let errorMessage = "An unknown error occurred.";
        if (axios.isAxiosError(err)) { errorMessage = err.response?.data?.message || err.message; }
        else if (err instanceof Error) { errorMessage = err.message; }
        setError(errorMessage);
        console.error("Error fetching recommended songs:", err);
    } finally {
      setLoadingSongs(false);
    }
  }, []); // useCallback với mảng rỗng để hàm không bị tạo lại không cần thiết

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  const handleSongSelect = async (song: Song) => {
    // 1. XỬ LÝ SỰ KIỆN "SKIP" cho bài hát cũ
    if (currentSong && audioRef.current && audioRef.current.duration > 0) {
      const percentage = Math.round((audioRef.current.currentTime / audioRef.current.duration) * 100);
      trackEvent('skip', { musicId: currentSong.id, play_percentage: percentage });
    }

    // 2. XỬ LÝ SỰ KIỆN "START_PLAYING" cho bài hát mới
    trackEvent('start_playing', { musicId: song.id });

    // 3. Tải và phát nhạc (logic cũ)
    if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
    setIsFetchingUrl(true);
    setError(null);
    try {
      const response = await axios.get(song.resourceLink, { headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }, responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const playableUrl = URL.createObjectURL(blob);
      setCurrentSong(song);
      setAudioUrl(playableUrl);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Không thể tải file nhạc.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSongLike = (song: Song) => {
    trackEvent('like', { musicId: song.id });
  };

  const handleSongEnded = () => {
    if (currentSong) {
      trackEvent('listen_through', { musicId: currentSong.id });
    }
  };

  // --- CÁC HOOK useEffect (Logic webcam, job 10s không đổi) ---
  // 1. useEffect chính để thiết lập Webcam và các interval
  useEffect(() => {
    const loadModels = async () => {
        const MODEL_URL = "/models";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        console.log("Face-API Models loaded!");
    };

    const startVideo = async () => {
        if (!videoRef.current) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Can't use webcam", error);
            setCurrentEmotion("Webcam Error!");
        }
    };
    
    const setupAndStartDetection = async () => {
        await loadModels();
        await startVideo();
    };
    
    setupAndStartDetection();

    // Lắng nghe sự kiện 'play' của video để bắt đầu nhận diện
    const videoElement = videoRef.current;
    const detectionIntervalRef = { current: null as NodeJS.Timeout | null };

    const handlePlay = () => {
        detectionIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            if (detections) {
                const topEmotion = Object.entries(detections.expressions).reduce((prev, current) => current[1] > prev[1] ? current : prev)[0];
                setCurrentEmotion(topEmotion);
                setEmotionHistory(prev => [...prev, topEmotion]);
            } else {
                setCurrentEmotion("Can't detect face");
            }
        }, 500);
    };

    videoElement?.addEventListener("play", handlePlay);

    // Dọn dẹp interval nhận diện khi component unmount
    return () => {
        videoElement?.removeEventListener("play", handlePlay);
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, []);

  // 2. useEffect cho Job 10 giây: gửi cảm xúc và cập nhật gợi ý
  useEffect(() => {
    const jobInterval = setInterval(() => {
        setEmotionHistory(currentHistory => {
            if (currentHistory.length === 0) return [];

            const emotionCounts = currentHistory.reduce((acc, emotion) => {
                acc[emotion] = (acc[emotion] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);
            const emotionId = emotionMap[dominantEmotion];

            console.log('Starting 10s Job...');
            

            if (emotionId) {
                console.log(`10s Job: Dominant emotion is '${dominantEmotion}'. Sending to backend...`);
                const requestBody = { userId: 1, emotion: emotionId, event: "cron_collect" };
                
                axios.post(COLLECT_API_URL, requestBody, { headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` } })
                .then(() => {
                    console.log("Emotion data sent. Now refreshing recommendations...");
                    fetchRecommendedSongs(); 
                })
                .catch(error => console.error("Error sending emotion data:", error));
            }
            return [];
        });
    }, 10000);

    return () => clearInterval(jobInterval);
  }, [fetchRecommendedSongs]); // Thêm fetchRecommendedSongs vào dependency array

  // 3. useEffect để tải danh sách gợi ý lần đầu tiên
  useEffect(() => {
    fetchRecommendedSongs();
  }, [fetchRecommendedSongs]);
  
  // 4. useEffect để dọn dẹp Object URL (không đổi)
  useEffect(() => {
      return () => {
          if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
      };
  }, [audioUrl]);




  return (
    <MainLayout>
      <div className="flex flex-col items-center w-full p-4 md:p-6 space-y-8 pb-32">
        <div className="w-full max-w-5xl relative">
          <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-lg shadow-lg bg-black" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-lg font-semibold text-white bg-black bg-opacity-50 px-3 py-1 rounded-md">
            Current emotion: {currentEmotion}
          </p>
        </div>
        
        <div className="w-full max-w-5xl">
          {loadingSongs && <div className="text-white text-center p-8">Đang cập nhật gợi ý...</div>}
          {error && <div className="text-red-500 text-center p-8">Lỗi: {error}</div>}
          {!loadingSongs && !error && (
            <RecommendedSongs
              songs={songs}
              onSongSelect={handleSongSelect}
              onSongLike={handleSongLike} // Truyền prop mới
            />
          )}
          {isFetchingUrl && <div className="text-white text-center p-4">Đang tải nhạc...</div>}
        </div>
      </div>
      
      <MusicPlayer
        ref={audioRef} // Truyền ref xuống
        song={currentSong}
        audioUrl={audioUrl}
        onEnded={handleSongEnded} // Truyền prop mới
      />
    </MainLayout>
  );
};