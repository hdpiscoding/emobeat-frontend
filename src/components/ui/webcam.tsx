// src/components/ui/webcam.tsx

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from "face-api.js";
import axios from 'axios'; // Đảm bảo bạn đã cài đặt axios

// Định nghĩa enum cảm xúc để dễ dàng map sang ID
const emotionMap: { [key: string]: number } = {
  neutral: 1,
  happy: 2,
  sad: 3,
  angry: 4,
  fearful: 5,
  disgusted: 6,
  surprised: 7
};

export const Webcam: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // State để hiển thị cảm xúc hiện tại lên UI
    const [currentEmotion, setCurrentEmotion] = useState<string>("Processing...");
    
    // State mới: Lưu trữ chuỗi cảm xúc được nhận diện
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
    
    // Token và các thông tin API
    const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImhhcGh1dGhpbmgiLCJyb2xlIjoibGlzdGVuZXIiLCJpYXQiOjE3NDk0NDM5NDQsImV4cCI6MjAwODY0Mzk0NH0.QHgyuGIP3aCTgMFSsWKONFBXjLbwTY4GfQxEZaastEc";
    const API_URL = "http://localhost:3005/api/v1/emotion-collect/collect";

    // --- CÁC HÀM KHỞI TẠO (KHÔNG ĐỔI) ---
    const startVideo = async () => {
        if (!videoRef.current) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Can't use webcam", error);
        }
    };

    const loadModels = async () => {
        const MODEL_URL = "/models";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        console.log("Models loaded!");
    };

    // --- LOGIC CHÍNH ---

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
                    // Thêm vào mảng lịch sử
                    setEmotionHistory(prevHistory => [...prevHistory, topEmotion]);

                    // Vẽ lên canvas (tùy chọn)
                    if (canvasRef.current) {
                        const canvas = canvasRef.current;
                        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
                        faceapi.matchDimensions(canvas, displaySize);
                        const resizedDetections = faceapi.resizeResults(detections, displaySize);
                        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
                        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
                    }
                } else {
                    setCurrentEmotion("Can't detect face");
                }
            }, 500);

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
        const jobInterval = setInterval(() => {
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

                // Gọi API
                if (emotionId) {
                    const requestBody = {
                        userId: 1, // userId set cứng
                        emotion: emotionId,
                        event: "cron_collect"
                    };
                    axios.post(API_URL, requestBody, {
                        headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
                    }).then(response => {
                        console.log("Successfully sent emotion data:", response.data);
                    }).catch(error => {
                        console.error("Error sending emotion data:", error);
                    });
                }

                // Reset mảng lịch sử cho chu kỳ 10 giây tiếp theo
                return [];
            });

        }, 10000); // Chạy mỗi 10 giây

        // Cleanup function để dừng interval khi component unmount
        return () => {
            console.log("Cleaning up 10s job interval.");
            clearInterval(jobInterval);
        };
    }, []); // Mảng dependency rỗng để đảm bảo interval chỉ được tạo một lần

    return (
        <div className="relative flex flex-col items-center space-y-4 p-4">
            <video ref={videoRef} autoPlay muted playsInline className="w-[720px] h-[540px] rounded-lg shadow-lg" />
            <canvas ref={canvasRef} className="absolute top-4" style={{ width: '720px', height: '540px' }} />
            <p className="text-lg font-semibold text-white bg-black bg-opacity-50 px-3 py-1 rounded-md">
                Current emotion: {currentEmotion}
            </p>
        </div>
    );
};