"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Camera, X } from "lucide-react";
import { createNPId } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CheckinResult {
  success: boolean;
  message: string;
  attendee?: {
    id: number;
    name: string;
    division: string;
    school: string;
    place: string;
    dob: string;
    mobile: string;
  };
}

export function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [manualTicketId, setManualTicketId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!scanning) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setResult({
          success: false,
          message: "Unable to access camera. Please check permissions.",
        });
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [scanning]);

  useEffect(() => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scanInterval = setInterval(() => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleQRCodeDetected(code.data);
          clearInterval(scanInterval);
        }
      }
    }, 100);

    return () => clearInterval(scanInterval);
  }, [scanning]);

  const handleQRCodeDetected = async (ticketId: string) => {
    setIsProcessing(true);
    setScanning(false);
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId }),
      });

      const data = await response.json();
      setResult(data);
        router.refresh();

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setResult(null);
        setScanning(true);
      }, 3000);
    } catch (error) {
      console.error("Check-in error:", error);
      setResult({
        success: false,
        message: "Error processing check-in. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualCheckin = async () => {
    if (!manualTicketId.trim()) return;
    await handleQRCodeDetected(manualTicketId);
    setManualTicketId("");
  };

  return (
    <div className="space-y-4">
      {/* Camera Feed */}
      <Card className="overflow-hidden bg-black">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {scanning ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-2 border-primary pointer-events-none">
                <div className="absolute inset-4 border-2 border-dashed border-primary/50"></div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Camera className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
              <p className="text-foreground/60">Camera is off</p>
            </div>
          )}
        </div>
      </Card>

      {/* Result Message */}
      {result && (
        <Card
          className={`p-4 border-2 flex gap-3 ${
            result.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          {result.success ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h3
              className={`font-semibold ${
                result.success ? "text-green-900" : "text-red-900"
              }`}
            >
              {result.success ? "Check-in Successful!" : "Check-in Failed"}
            </h3>
            <p
              className={`text-sm mt-1 ${
                result.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.message}
            </p>
            {result.attendee && (
              <div
                className={`text-sm mt-2 space-y-1 ${
                  result.success ? "text-green-800" : "text-red-800"
                }`}
              >
                <p>
                  <strong>Ticket ID:</strong> {createNPId(result.attendee.id)}
                </p>
                <p>
                  <strong>Name:</strong> {result.attendee.name}
                </p>
                <p>
                  <strong>Division:</strong> {result.attendee.division}
                </p>
                <p>
                  <strong>School:</strong> {result.attendee.school}
                </p>
              </div>
            )}
          </div>
          {result && (
            <button
              onClick={() => setResult(null)}
              className="text-foreground/40 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </Card>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={() => setScanning(!scanning)}
          disabled={isProcessing}
          className={`flex-1 ${
            scanning
              ? "bg-red-600 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          } text-white`}
        >
          {scanning ? "Stop Scanning" : "Start Scanning"}
        </Button>
      </div>

      {/* Manual Entry */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-3">Manual Entry (Backup)</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter ticket ID"
            value={manualTicketId}
            onChange={(e) => setManualTicketId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleManualCheckin()}
            disabled={isProcessing}
          />
          <Button
            onClick={handleManualCheckin}
            disabled={!manualTicketId.trim() || isProcessing}
            variant="outline"
          >
            Check In
          </Button>
        </div>
      </Card>
    </div>
  );
}
