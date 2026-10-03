import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

export default function CameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access was declined or is unavailable on this device. You can upload an image file instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-deep/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-background-surface w-full max-w-md rounded-xl shadow-modal border border-charcoal-border overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-charcoal-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-charcoal text-base">Capture Object</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-charcoal-muted hover:text-charcoal hover:bg-background-warm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Preview */}
        <div className="relative aspect-[4/3] bg-charcoal flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-white space-y-2">
              <p className="text-sm text-red-200">{cameraError}</p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs rounded-md font-medium"
              >
                Close & Upload File
              </button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured object"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/80 text-white text-sm">
                  Starting camera...
                </div>
              )}
              {/* Aiming Reticle */}
              <div className="absolute inset-8 border border-white/40 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-[11px] bg-charcoal/60 px-2 py-1 rounded text-white/80">
                  Center object here
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="px-5 py-4 bg-background-warm flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                onClick={retakePhoto}
                className="flex items-center gap-1.5 px-3 py-2 border border-charcoal-border bg-white rounded-md text-xs font-medium text-charcoal hover:bg-background-warm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                onClick={confirmPhoto}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md text-xs font-medium shadow-subtle"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-charcoal-muted hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={takePhoto}
                disabled={Boolean(cameraError) || isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-full text-xs font-medium shadow-card active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Take Snapshot</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
