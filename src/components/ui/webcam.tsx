/* eslint-disable */
import react, {useEffect, useRef, useState} from 'react';
import * as faceapi from "face-api.js";
import {collectEmotion} from "@/services/emotionServices.ts";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {useGeneralStore} from "@/store/useGeneralStore.ts";
import {useMusicStore} from "@/store/useMusicStore.ts";
import {getRecommendedQueue} from "@/services/musicServices.ts";

const emotionMap: { [key: string]: number } = {
    neutral: 1,
    happy: 2,
    sad: 3,
    angry: 4,
    fearful: 5,
    disgusted: 6,
    surprised: 7
};

export const  Webcam: react.FC = react.memo(() => {
    const videoRef = useRef<HTMLVideoElement>(null);
    //const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentEmotion, setCurrentEmotion] = useState<string>("Processing...");
    const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
    const userId = useAuthStore(state => state.userId);
    const allowRecommend = useGeneralStore(state => state.allowRecommend);
    const detectInterval = useGeneralStore(state => state.detectInterval);
    const recommendInterval = useGeneralStore(state => state.recommendInterval);
    const setEmotion = useGeneralStore(state => state.setEmotion);
    const setQueue = useMusicStore(state => state.setQueue);

    // Hàm tải mô hình và bắt đầu camera
    const startVideo = async () => {
        if (!videoRef.current) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Can't use webcam", error);
        }
    };

    // Hàm tải mô hình của face-api.js
    const loadModels = async () => {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded!");
    };

    // 1. useEffect để tải model và bắt đầu nhận diện cảm xúc (500ms/lần)
    useEffect(() => {
        const setupWebcam = async () => {
            await loadModels();
            await startVideo();
        };
        setupWebcam();

        const handlePlay = () => {
            console.log("Video started playing, setting up detection interval.");
            const detectionInterval = setInterval(async () => {
                if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
                    return;
                }

                const detections = await faceapi
                    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (detections.length > 0) {
                    const emotions = detections[0].expressions;
                    const topEmotion = Object.entries(emotions).reduce((prev, current) =>
                        current[1] > prev[1] ? current : prev
                    )[0];

                    // Cập nhật UI
                    setCurrentEmotion(topEmotion);
                    setEmotion(emotionMap[topEmotion] || emotionMap['neutral']);
                    // Thêm vào mảng lịch sử
                    setEmotionHistory(prevHistory => [...prevHistory, topEmotion]);

                } else {
                    setCurrentEmotion("Can't detect face");
                }
            }, detectInterval);

            // Cleanup function để dừng interval khi component unmount
            return () => {
                console.log("Cleaning up detection interval.");
                clearInterval(detectionInterval);
            };
        };

        const videoElement = videoRef.current;
        videoElement?.addEventListener("play", handlePlay);

        // Cleanup event listener
        return () => {
            videoElement?.removeEventListener("play", handlePlay);
        };
    }, []);

    // 2. useEffect mới để chạy "Job" gửi dữ liệu mỗi 10 giây
    useEffect(() => {
        let jobInterval: NodeJS.Timeout | null = null;
        if (allowRecommend) {
            jobInterval = setInterval(() => {
                // Sử dụng functional update để lấy được giá trị state mới nhất
                setEmotionHistory(currentHistory => {
                    if (currentHistory.length === 0) {
                        console.log("10s Job: No emotions detected in this window. Skipping API call.");
                        return []; // Vẫn trả về mảng rỗng để reset
                    }

                    // Tìm cảm xúc xuất hiện nhiều nhất
                    const emotionCounts = currentHistory.reduce((acc, emotion) => {
                        acc[emotion] = (acc[emotion] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>);

                    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
                        emotionCounts[a] > emotionCounts[b] ? a : b
                    );

                    const emotionId = emotionMap[dominantEmotion];

                    console.log(`10s Job: Dominant emotion is '${dominantEmotion}' (ID: ${emotionId}). Sending to backend...`);

                    if (emotionId) {
                        const requestBody = {
                            userId: userId,
                            emotion: emotionId,
                            event: "cron_collect"
                        };
                        collectEmotion(requestBody).then(response => {
                            console.log("Successfully sent emotion data:", response.data);
                        }).catch(error => {
                            console.error("Error sending emotion data:", error);
                        });
                    }
                    return [];
                });

                // Gọi API để lấy danh sách bài hát gợi ý
                getRecommendedQueue(10).then(response => {
                    console.log("Recommended queue fetched:", response.data);
                    setQueue(response?.data);
                }).catch(error => {
                    console.error("Error fetching recommended queue:", error);
                });
            }, recommendInterval * 1000); // Chạy mỗi 10 giây
        }
        return () => {
            console.log("Cleaning up 10s job interval.");
            clearInterval(jobInterval);
        };
    }, [allowRecommend, recommendInterval, userId]); // Mảng dependency rỗng để đảm bảo interval chỉ được tạo một lần

    return (
        <div className="flex flex-col items-center space-y-4 p-4 w-full">
            <video ref={videoRef} autoPlay className="lg:w-[1400px] h-80 object-none rounded-lg shadow-lg" style={{ transform: "scaleX(-1)" }}/>
            {/*<canvas ref={canvasRef} className="absolute top-0 left-0" />*/}
            <p className="text-lg font-semibold">Current emotion: {currentEmotion}</p>
        </div>
    );
});