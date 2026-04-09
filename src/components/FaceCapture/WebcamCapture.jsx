import { useState, useEffect, useRef } from 'react';
import { useFaceRecognition } from '../../hooks/useFaceRecognition';
import { FaceCanvas } from './FaceCanvas';
import { Spinner } from '../common/Spinner';

const AUTO_CAPTURE_DELAY = 1500; // ms of stable face detection before auto-capture

export const WebcamCapture = ({
  onCapture,
  onError,
  captureText = 'Capture',
  continuous = false,
  showLandmarks = false,
}) => {
  const {
    videoRef,
    isModelLoading,
    isVideoReady,
    error,
    faceDetected,
    startVideo,
    stopVideo,
    stopDetection,
    detectFace,
  } = useFaceRecognition();

  const [captured, setCaptured] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const stableTimer = useRef(null);
  const countdownInterval = useRef(null);

  useEffect(() => {
    startVideo();
    return () => {
      stopVideo();
      stopDetection();
      clearTimeout(stableTimer.current);
      clearInterval(countdownInterval.current);
    };
  }, [startVideo, stopVideo, stopDetection]);

  // Continuously poll face detection so faceDetected state stays current
  useEffect(() => {
    if (!isVideoReady || capturing || captured) return;
    const poll = setInterval(() => detectFace(), 300);
    return () => clearInterval(poll);
  }, [isVideoReady, capturing, captured, detectFace]);

  // Auto-capture logic: start timer when face detected, cancel when lost
  useEffect(() => {
    if (captured || capturing || continuous) return;

    if (faceDetected) {
      let remaining = AUTO_CAPTURE_DELAY;
      setCountdown(remaining);

      countdownInterval.current = setInterval(() => {
        remaining -= 100;
        setCountdown(remaining);
      }, 100);

      stableTimer.current = setTimeout(async () => {
        clearInterval(countdownInterval.current);
        setCountdown(null);
        setCapturing(true);

        const embedding = await detectFace();
        if (embedding) {
          setCaptured(true);
          onCapture?.(Array.from(embedding));
          setTimeout(() => setCaptured(false), 2000);
        } else {
          onError?.('Could not capture face. Please try again.');
        }
        setCapturing(false);
      }, AUTO_CAPTURE_DELAY);
    } else {
      clearTimeout(stableTimer.current);
      clearInterval(countdownInterval.current);
      setCountdown(null);
    }

    return () => {
      clearTimeout(stableTimer.current);
      clearInterval(countdownInterval.current);
    };
  }, [faceDetected, captured, capturing, continuous, detectFace, onCapture, onError]);

  // Continuous mode — keep streaming embeddings
  useEffect(() => {
    if (!isVideoReady || !continuous) return;

    const interval = setInterval(async () => {
      if (capturing) return;
      const embedding = await detectFace();
      if (embedding) onCapture?.(Array.from(embedding));
    }, 200);

    return () => clearInterval(interval);
  }, [isVideoReady, continuous, capturing, detectFace, onCapture]);

  const progressPercent = countdown !== null
    ? Math.round(((AUTO_CAPTURE_DELAY - countdown) / AUTO_CAPTURE_DELAY) * 100)
    : 0;

  if (isModelLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-100 rounded-xl">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-slate-600">Loading face recognition models...</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-900">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto"
        style={{ transform: 'scaleX(-1)' }}
      />

      <FaceCanvas videoRef={videoRef} showLandmarks={showLandmarks} />

      {!isVideoReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <Spinner size="lg" />
          <p className="ml-3 text-white">Starting camera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80">
          <p className="text-white text-center p-4">{error}</p>
        </div>
      )}

      {/* Status overlay */}
      {isVideoReady && !error && (
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          {capturing ? (
            <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full">
              Capturing...
            </span>
          ) : captured ? (
            <span className="bg-emerald-500 text-white text-sm px-4 py-2 rounded-full">
              Captured!
            </span>
          ) : faceDetected ? (
            <span className="bg-emerald-500 text-white text-sm px-4 py-2 rounded-full">
              Face detected — hold still...
            </span>
          ) : (
            <span className="bg-amber-500 text-white text-sm px-4 py-2 rounded-full">
              Position your face in the frame
            </span>
          )}
        </div>
      )}

      {/* Auto-capture progress bar */}
      {countdown !== null && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
          <div
            className="h-full bg-emerald-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
