import react, {useEffect, useRef, useState} from 'react';
import * as faceapi from "face-api.js";


export const Webcam: react.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [emotion, setEmotion] = useState<string>("Processing...");

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

    // Hàm nhận diện cảm xúc
    const detectEmotion = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections.length > 0) {
                const emotions = detections[0].expressions;
                const topEmotion = Object.entries(emotions).reduce((prev, current) =>
                    current[1] > prev[1] ? current : prev
                )[0];

                setEmotion(topEmotion);
            } else {
                setEmotion("Can't detect face");
            }

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 500);
    };

    useEffect(() => {
        loadModels().then(startVideo);
    }, []);

    useEffect(() => {
        videoRef.current?.addEventListener("play", detectEmotion);
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <video ref={videoRef} autoPlay className="w-[1000px] h-80 object-none rounded-lg shadow-lg" />
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
            <p className="text-lg font-semibold">Current emotion: {emotion}</p>
        </div>
    );
}