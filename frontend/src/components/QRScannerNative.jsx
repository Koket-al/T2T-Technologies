import { useEffect, useRef, useState } from "react";

const QRScannerNative = ({ onScan }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        setError("Camera access denied");
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    let interval;
    if ("BarcodeDetector" in window) {
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      interval = setInterval(async () => {
        try {
          const results = await detector.detect(videoRef.current);
          if (results.length > 0) {
            onScan(results[0].rawValue);
          }
        } catch (err) {
          console.error(err);
        }
      }, 500);
    } else {
      setError("Browser does not support BarcodeDetector API");
    }

    return () => clearInterval(interval);
  }, [onScan]);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", borderRadius: "0.5rem", background: "#000" }}
      />
      {error && (
        <p style={{ color: "#dd0c0c", textAlign: "center", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default QRScannerNative;
