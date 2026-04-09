import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceApi from 'face-api.js';
import { cosineSimilarity } from '../utils/faceMatcher';

const MODEL_URL = '/models';

const DEFAULT_OPTIONS = {
  minConfidence: 0.5,
  maxDescriptorDistance: 0.5,
};

export const useFaceRecognition = (options = {}) => {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentEmbedding, setCurrentEmbedding] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const modelsLoadedRef = useRef(false);

  const loadModels = useCallback(async () => {
    if (modelsLoadedRef.current) return;

    try {
      setIsModelLoading(true);
      setError(null);

      await Promise.all([
        faceApi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      modelsLoadedRef.current = true;
    } catch (err) {
      setError('Failed to load face recognition models');
      console.error('Model loading error:', err);
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  const startVideo = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setIsVideoReady(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Video start error:', err);
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoReady(false);
    setFaceDetected(false);
    setCurrentEmbedding(null);
  }, []);

  const detectFace = useCallback(async () => {
    if (!videoRef.current || !modelsLoadedRef.current) return null;

    const video = videoRef.current;
    if (video.paused || video.ended) return null;

    try {
      const detections = await faceApi
        .detectAllFaces(video, new faceApi.SsdMobilenetv1Options(DEFAULT_OPTIONS))
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setFaceDetected(false);
        setCurrentEmbedding(null);
        return null;
      }

      if (detections.length > 1) {
        setFaceDetected(false);
        setError('Multiple faces detected. Please ensure only one face is visible.');
        return null;
      }

      setFaceDetected(true);
      setError(null);

      const embedding = detections[0].descriptor;
      setCurrentEmbedding(embedding);
      return embedding;
    } catch (err) {
      console.error('Face detection error:', err);
      return null;
    }
  }, []);

  const startDetection = useCallback((onDetection, interval = 100) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      const embedding = await detectFace();
      if (embedding && onDetection) {
        onDetection(embedding);
      }
    }, interval);
  }, [detectFace]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const compareFaces = useCallback((embedding1, embedding2) => {
    return cosineSimilarity(Array.from(embedding1), Array.from(embedding2));
  }, []);

  useEffect(() => {
    loadModels();

    return () => {
      stopVideo();
      stopDetection();
    };
  }, [loadModels, stopVideo, stopDetection]);

  return {
    videoRef,
    canvasRef,
    isModelLoading,
    isVideoReady,
    error,
    faceDetected,
    currentEmbedding,
    loadModels,
    startVideo,
    stopVideo,
    detectFace,
    startDetection,
    stopDetection,
    compareFaces,
  };
};
