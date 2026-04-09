import { useRef, useEffect } from 'react';
import * as faceApi from 'face-api.js';

export const FaceCanvas = ({ videoRef, showLandmarks = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationId;

    const draw = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.paused || video.ended) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0);

      try {
        const detections = await faceApi
          .detectAllFaces(video)
          .withFaceLandmarks();

        if (showLandmarks) {
          const landmarks = await faceApi.matchDimensions(canvas, video);
          const resized = faceApi.resizeResults(detections, landmarks);

          for (const detection of resized) {
            const box = detection.detection.box;

            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            if (detection.landmarks) {
              const jaw = detection.landmarks.getJawOutline();
              const nose = detection.landmarks.getNose();
              const mouth = detection.landmarks.getMouth();
              const leftEye = detection.landmarks.getLeftEye();
              const rightEye = detection.landmarks.getRightEye();

              ctx.fillStyle = '#2563eb';

              for (const point of [...jaw, ...nose, ...mouth, ...leftEye, ...rightEye]) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
                ctx.fill();
              }
            }
          }
        } else {
          for (const detection of detections) {
            const box = detection.detection.box;

            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            ctx.fillStyle = '#10B981';
            ctx.font = '14px Inter';
            ctx.fillText('Face Detected', box.x, box.y - 5);
          }
        }
      } catch (err) {
        // Ignore detection errors during drawing
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [videoRef, showLandmarks]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
};
