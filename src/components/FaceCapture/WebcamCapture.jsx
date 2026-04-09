import { useState, useEffect, useRef } from 'react';
import { useFaceRecognition } from '../../hooks/useFaceRecognition';
import { FaceCanvas } from './FaceCanvas';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';

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
    startDetection,
    stopDetection,
    detectFace,
  } = useFaceRecognition();

  const [captured, setCaptured] = useState(false);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    startVideo();

    return () => {
      stopVideo();
      stopDetection();
    };
  }, [startVideo, stopVideo, stopDetection]);

  useEffect(() => {
    if (isVideoReady && continuous) {
      startDetection((embedding) => {
        if (onCapture && !capturing) {
          onCapture(Array.from(embedding));
        }
      }, 200);
    }

    return () => {
      stopDetection();
    };
  }, [isVideoReady, continuous, startDetection, stopDetection, onCapture, capturing]);

  const handleCapture = async () => {
    if (capturing) return;

    setCapturing(true);
    stopDetection();

    const embedding = await detectFace();

    if (embedding) {
      setCaptured(true);
      onCapture?.(Array.from(embedding));
      setTimeout(() => setCaptured(false), 2000);
    } else {
      onError?.('No face detected. Please position your face in the camera.');
    }

    setCapturing(false);

    if (continuous) {
      startDetection((emb) => {
        if (onCapture && !capturing) {
          onCapture(Array.from(emb));
        }
      }, 200);
    }
  };

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

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <Button
          variant={captured ? 'success' : 'primary'}
          onClick={handleCapture}
          disabled={!isVideoReady || !faceDetected || capturing}
          loading={capturing}
        >
          {captured ? 'Captured!' : captureText}
        </Button>
      </div>

      {!faceDetected && isVideoReady && !error && (
        <p className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-sm px-4 py-2 rounded-full">
          Position your face in the frame
        </p>
      )}
    </div>
  );
};
