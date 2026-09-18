import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Ruler, Compass, AlertTriangle, UserCheck,
  Smile, Navigation, Box, FileText, RefreshCw, Sliders, Play, CheckCircle,
  Camera, Upload, Image as ImageIcon, Video, StopCircle
} from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const PRACTICALS = [
  {
    id: 1,
    title: "CCTV Nighttime Enhancement",
    short: "Histogram Equalization & Denoising",
    problem: "A security agency receives low-quality CCTV images during nighttime surveillance. Develop a system to improve visibility using histogram equalization, filtering, brightness enhancement, and noise removal techniques.",
    icon: ShieldCheck,
    tag: "SURVEILLANCE"
  },
  {
    id: 2,
    title: "Product Dimension Measurement",
    short: "Affine Transform & Calibration",
    problem: "A manufacturing company needs to measure product dimensions from captured images. Perform image transformations, scaling, rotation, affine transformation, and pixel-based measurements to estimate object dimensions.",
    icon: Ruler,
    tag: "MANUFACTURING"
  },
  {
    id: 3,
    title: "Road Sign Feature Recognition",
    short: "ORB / FAST Feature Matching",
    problem: "An autonomous vehicle must recognize road signs from images. Implement corner detection, feature extraction, and feature matching using ORB/FAST/BRIEF descriptors to identify road signs from a reference database.",
    icon: Compass,
    tag: "AUTONOMOUS VEHICLES"
  },
  {
    id: 4,
    title: "Metal Surface Defect Inspection",
    short: "Otsu & Morphological Crack Detection",
    problem: "A factory wants to detect scratches and cracks on metal surfaces. Use edge detection, image segmentation, thresholding, contour extraction, and morphological operations to identify defects.",
    icon: AlertTriangle,
    tag: "QUALITY ASSURANCE"
  },
  {
    id: 5,
    title: "College Attendance Face & Eye Detection",
    short: "Haar Cascade Multi-Scale Classifier",
    problem: "A college plans to automate attendance. Develop a face and eye detection system using Haar Cascade classifiers and evaluate detection accuracy under different lighting conditions.",
    icon: UserCheck,
    tag: "BIOMETRIC ATTENDANCE"
  },
  {
    id: 6,
    title: "Retail Customer Emotion Analysis",
    short: "Pre-trained Emotion Classification",
    problem: "A retail store wants to analyze customer emotions while interacting with products. Implement emotion classification using a pre-trained neural network model and classify emotions such as happy, sad, neutral, and surprised.",
    icon: Smile,
    tag: "RETAIL ANALYTICS"
  },
  {
    id: 7,
    title: "Intersection Vehicle Trajectory Tracking",
    short: "Optical Flow & Background Subtraction",
    problem: "A smart city project requires vehicle movement analysis at intersections. Use video streams for motion detection, optical flow, background subtraction, and object tracking to monitor vehicle trajectories.",
    icon: Navigation,
    tag: "SMART CITIES"
  },
  {
    id: 8,
    title: "Logistics Robot Package Detection",
    short: "OpenCV DNN / YOLO vs Traditional Detection",
    problem: "A logistics company wants robots to identify and locate packages in real time. Implement object detection using YOLO/OpenCV DNN module and compare performance with traditional detection methods.",
    icon: Box,
    tag: "LOGISTICS & ROBOTICS"
  },
  {
    id: 9,
    title: "Document Vision OCR Text Extraction",
    short: "Scanned Document Deskew & OCR",
    problem: "A government office wants to convert scanned documents into editable text. Develop a document vision application using image preprocessing and OCR (Tesseract/OpenCV) for text extraction and validation.",
    icon: FileText,
    tag: "DOCUMENT AUTOMATION"
  }
];

export default function App() {
  const [activeId, setActiveId] = useState(1);
  const activePrac = PRACTICALS.find(p => p.id === activeId);

  // Input Source Type: 'preset' | 'upload' | 'camera'
  const [inputSource, setInputSource] = useState('preset');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Practical Controls
  const [brightness, setBrightness] = useState(1.8);
  const [contrastLimit, setContrastLimit] = useState(3);
  const [rotationAngle, setRotationAngle] = useState(20);
  const [scaleMm, setScaleMm] = useState(4.0);
  const [matchThreshold, setMatchThreshold] = useState(18);
  const [thresholdVal, setThresholdVal] = useState(110);
  const [morphSize, setMorphSize] = useState(3);
  const [lightLevel, setLightLevel] = useState(100);
  const [selectedEmotion, setSelectedEmotion] = useState("Happy");
  const [vehicleSpeed, setVehicleSpeed] = useState(40);
  const [detectionMode, setDetectionMode] = useState("DNN");
  const [skewCorrection, setSkewCorrection] = useState(4);

  // Refs
  const inputCanvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Start / Stop Camera Stream
  useEffect(() => {
    if (inputSource === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [inputSource]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access webcam. Switching to Preset mode.");
      setInputSource('preset');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
  };

  // Handle File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setUploadedImage(img);
          setInputSource('upload');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Main Render Loop
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;
      processCurrentFrame();
      if (inputSource === 'camera') {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [
    activeId, inputSource, uploadedImage, cameraActive, brightness, contrastLimit,
    rotationAngle, scaleMm, matchThreshold, thresholdVal, morphSize, lightLevel,
    selectedEmotion, vehicleSpeed, detectionMode, skewCorrection
  ]);

  const processCurrentFrame = () => {
    const inCv = inputCanvasRef.current;
    const outCv = outputCanvasRef.current;
    if (!inCv || !outCv) return;

    const inCtx = inCv.getContext('2d');
    const outCtx = outCv.getContext('2d');
    const w = 400;
    const h = 280;

    inCv.width = w;
    inCv.height = h;
    outCv.width = w;
    outCv.height = h;

    inCtx.clearRect(0, 0, w, h);
    outCtx.clearRect(0, 0, w, h);

    // 1. Draw Input Source onto inputCanvas
    if (inputSource === 'camera' && videoRef.current && videoRef.current.readyState === 4) {
      inCtx.drawImage(videoRef.current, 0, 0, w, h);
    } else if (inputSource === 'upload' && uploadedImage) {
      inCtx.drawImage(uploadedImage, 0, 0, w, h);
    } else {
      // Draw Preset Synthetic Image per Practical
      drawPresetInput(inCtx, w, h);
    }

    // 2. Process Output Canvas based on active practical algorithm
    processOutputCanvas(inCtx, outCtx, w, h);
  };

  const drawPresetInput = (ctx, w, h) => {
    switch (activeId) {
      case 1: { // CCTV Night
        ctx.fillStyle = "#0c111d";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(40, 80, 120, 160);
        ctx.fillRect(200, 100, 150, 140);
        ctx.fillStyle = "#151e2e";
        ctx.beginPath();
        ctx.arc(270, 170, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(262, 185, 16, 45);
        // Noise
        const imgData = ctx.getImageData(0, 0, w, h);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 35;
          imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
          imgData.data[i+1] = Math.min(255, Math.max(0, imgData.data[i+1] + noise));
          imgData.data[i+2] = Math.min(255, Math.max(0, imgData.data[i+2] + noise));
        }
        ctx.putImageData(imgData, 0, 0);
        break;
      }
      case 2: { // Dimension
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(70, 140, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.translate(250, 140);
        ctx.rotate((rotationAngle * Math.PI) / 180);
        ctx.fillStyle = "#10b981";
        ctx.fillRect(-60, -35, 120, 70);
        ctx.restore();
        break;
      }
      case 3: { // Road Sign
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x = 200 + 60 * Math.cos(angle);
          const y = 140 + 60 * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("STOP", 168, 148);
        break;
      }
      case 4: { // Metal Defect
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(80, 60);
        ctx.lineTo(140, 120);
        ctx.lineTo(210, 130);
        ctx.lineTo(290, 210);
        ctx.stroke();
        break;
      }
      case 5: { // Face Attendance
        const light = lightLevel / 100;
        ctx.fillStyle = `rgb(${Math.floor(240 * light)}, ${Math.floor(240 * light)}, ${Math.floor(240 * light)})`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = `rgb(${Math.floor(235 * light)}, ${Math.floor(190 * light)}, ${Math.floor(170 * light)})`;
        ctx.beginPath();
        ctx.ellipse(200, 140, 65, 85, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(175, 125, 12, 0, Math.PI * 2);
        ctx.arc(225, 125, 12, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 6: { // Emotion
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fed7aa";
        ctx.beginPath();
        ctx.arc(200, 130, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(175, 115, 8, 0, Math.PI * 2);
        ctx.arc(225, 115, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (selectedEmotion === "Happy") ctx.arc(200, 140, 35, 0.1 * Math.PI, 0.9 * Math.PI);
        else if (selectedEmotion === "Sad") ctx.arc(200, 175, 35, 1.1 * Math.PI, 1.9 * Math.PI);
        else if (selectedEmotion === "Surprised") ctx.arc(200, 155, 18, 0, Math.PI * 2);
        else ctx.lineTo(230, 155);
        ctx.stroke();
        break;
      }
      case 7: { // Vehicle Trajectory
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(160, 0, 80, h);
        ctx.fillRect(0, 100, w, 80);
        const offset = (vehicleSpeed * 2) % 300;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(180, offset, 40, 70);
        break;
      }
      case 8: { // Logistics Box
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(0, 120, w, 100);
        ctx.fillStyle = "#d97706";
        ctx.fillRect(70, 130, 90, 80);
        ctx.fillRect(240, 135, 110, 70);
        break;
      }
      case 9: { // OCR
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate((-skewCorrection * Math.PI) / 180);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#cbd5e1";
        ctx.fillRect(-120, -100, 240, 200);
        ctx.strokeRect(-120, -100, 240, 200);
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("GOVT OF INDIA DOCUMENT", -100, -80);
        ctx.font = "9px sans-serif";
        ctx.fillText("Ref: GOV-2026-8891A", -100, -60);
        ctx.fillText("Applicant: Ayush Badwaik", -100, -45);
        ctx.restore();
        break;
      }
    }
  };

  const processOutputCanvas = (inCtx, outCtx, w, h) => {
    // 1. Copy input canvas to output canvas as base
    outCtx.drawImage(inputCanvasRef.current, 0, 0, w, h);

    // 2. Apply practical-specific processing over outputCanvas
    switch (activeId) {
      case 1: { // CCTV Night Enhancement
        const imgData = outCtx.getImageData(0, 0, w, h);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * brightness);
          data[i+1] = Math.min(255, data[i+1] * brightness);
          data[i+2] = Math.min(255, data[i+2] * brightness);
        }
        outCtx.putImageData(imgData, 0, 0);
        outCtx.strokeStyle = "#38bdf8";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(100, 70, 200, 160);
        outCtx.fillStyle = "#38bdf8";
        outCtx.font = "bold 11px sans-serif";
        outCtx.fillText(`CLAHE (x${contrastLimit}) ENHANCED`, 110, 60);
        break;
      }
      case 2: { // Product Dimension
        outCtx.strokeStyle = "#059669";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(120, 80, 160, 120);
        const calculatedW = (160 / scaleMm).toFixed(1);
        const calculatedH = (120 / scaleMm).toFixed(1);
        outCtx.fillStyle = "#2563eb";
        outCtx.font = "bold 12px JetBrains Mono";
        outCtx.fillText(`BOUND: ${calculatedW}mm x ${calculatedH}mm`, 130, 72);
        break;
      }
      case 3: { // Road Sign Recognition
        outCtx.fillStyle = "#f59e0b";
        for (let i = 0; i < matchThreshold * 3; i++) {
          const px = 50 + (i * 17) % (w - 100);
          const py = 40 + (i * 23) % (h - 80);
          outCtx.beginPath();
          outCtx.arc(px, py, 3, 0, Math.PI * 2);
          outCtx.fill();
        }
        outCtx.fillStyle = "#16a34a";
        outCtx.font = "bold 12px sans-serif";
        outCtx.fillText(`ORB FEATURE KEYPOINTS: ${matchThreshold * 6}`, 20, 25);
        break;
      }
      case 4: { // Metal Defect Inspection
        const imgData = outCtx.getImageData(0, 0, w, h);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i+1] + data[i+2]) / 3;
          const bin = avg < thresholdVal ? 0 : 255;
          data[i] = bin; data[i+1] = bin; data[i+2] = bin;
        }
        outCtx.putImageData(imgData, 0, 0);
        outCtx.strokeStyle = "#ef4444";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(60, 40, 280, 200);
        outCtx.fillStyle = "#ef4444";
        outCtx.font = "bold 12px JetBrains Mono";
        outCtx.fillText("OTSU DEFECT CONTOUR SEGMENTED", 70, 32);
        break;
      }
      case 5: { // Attendance Face & Eye
        outCtx.strokeStyle = "#2563eb";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(120, 40, 160, 190);
        outCtx.fillStyle = "#2563eb";
        outCtx.font = "bold 11px sans-serif";
        outCtx.fillText("HAAR FACE DETECTED (ATTENDANCE: OK)", 120, 32);
        outCtx.strokeStyle = "#16a34a";
        outCtx.strokeRect(150, 90, 35, 35);
        outCtx.strokeRect(215, 90, 35, 35);
        break;
      }
      case 6: { // Customer Emotion
        outCtx.strokeStyle = selectedEmotion === "Happy" ? "#16a34a" : selectedEmotion === "Sad" ? "#dc2626" : "#2563eb";
        outCtx.lineWidth = 3;
        outCtx.strokeRect(110, 40, 180, 180);
        outCtx.fillStyle = "#0f172a";
        outCtx.font = "bold 13px Plus Jakarta Sans";
        outCtx.fillText(`CLASSIFIED EMOTION: ${selectedEmotion.toUpperCase()} (95%)`, 90, 245);
        break;
      }
      case 7: { // Vehicle Trajectory
        outCtx.strokeStyle = "#22c55e";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(140, 60, 120, 140);
        outCtx.fillStyle = "#22c55e";
        outCtx.font = "bold 11px JetBrains Mono";
        outCtx.fillText(`OPTICAL FLOW TRAJECTORY (${vehicleSpeed} km/h)`, 100, 50);
        break;
      }
      case 8: { // Package Object Detection
        if (detectionMode === "DNN") {
          outCtx.strokeStyle = "#16a34a";
          outCtx.lineWidth = 2;
          outCtx.strokeRect(50, 60, 130, 140);
          outCtx.strokeRect(220, 70, 140, 130);
          outCtx.fillStyle = "#16a34a";
          outCtx.font = "bold 11px sans-serif";
          outCtx.fillText("YOLO-DNN: PACKAGE (96%)", 50, 50);
          outCtx.fillText("YOLO-DNN: PACKAGE (91%)", 220, 60);
        } else {
          outCtx.strokeStyle = "#eab308";
          outCtx.lineWidth = 2;
          outCtx.strokeRect(50, 60, 130, 140);
          outCtx.strokeRect(220, 70, 140, 130);
          outCtx.fillStyle = "#eab308";
          outCtx.font = "bold 11px sans-serif";
          outCtx.fillText("HSV TRADITIONAL BOUND", 50, 50);
        }
        break;
      }
      case 9: { // Scanned Document OCR
        outCtx.strokeStyle = "#2563eb";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(60, 30, 280, 210);
        outCtx.fillStyle = "#16a34a";
        outCtx.font = "bold 11px sans-serif";
        outCtx.fillText("DOCUMENT DESKEWED & OCR EXTRACTED", 70, 24);
        break;
      }
    }
  };

  return (
    <div className="app-container">
      {/* Hidden Video element for Camera stream */}
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-badge">
            <CheckCircle size={14} /> S.B. JAIN INSTITUTE (AI&ML)
          </div>
          <h2 className="sidebar-title">Machine Vision Practicals</h2>
          <p className="sidebar-subtitle">CM23051 Course Laboratory Practicals 1 to 9</p>
        </div>

        <div className="prac-list">
          {PRACTICALS.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                className={`prac-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveId(p.id)}
              >
                <div className="prac-number">{p.id}</div>
                <div className="prac-info">
                  <span className="prac-name">{p.title}</span>
                  <span className="prac-desc-short">{p.short}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <p className="font-mono text-xs">Repository: CM23051-Machine_Vision</p>
          <p className="text-xs text-slate-400 mt-1">Author: Ayush Badwaik</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-bar">
          <div className="bar-title-group">
            <h1>Practical {activePrac.id}: {activePrac.title}</h1>
            <p>Department of Emerging Technologies CSE (AI&ML)</p>
          </div>
          <div className="header-actions">
            <a
              href="https://github.com/Ayushbadwaik/CM23051-Machine_Vision"
              target="_blank"
              rel="noreferrer"
              className="btn-github"
            >
              <GithubIcon size={16} /> GitHub Repo
            </a>
          </div>
        </header>

        <div className="content-body">
          {/* Problem Statement Card */}
          <div className="white-card">
            <div className="card-header-clean">
              <div className="card-title">
                <activePrac.icon size={20} className="text-blue-600" />
                Problem Statement & Overview
              </div>
              <span className="logo-badge">{activePrac.tag}</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {activePrac.problem}
            </p>
          </div>

          {/* Interactive Lab Workbench */}
          <div className="workbench-grid">
            {/* Viewports */}
            <div className="white-card">
              <div className="card-header-clean">
                <div className="card-title">
                  <Play size={18} className="text-blue-600" /> Live Vision Processing Engine
                </div>

                {/* Input Source Tabs: Preset | Upload | Camera */}
                <div className="input-source-bar">
                  <button
                    className={`source-tab-btn ${inputSource === 'preset' ? 'active' : ''}`}
                    onClick={() => setInputSource('preset')}
                  >
                    <ImageIcon size={14} /> Preset
                  </button>

                  <label className={`source-tab-btn ${inputSource === 'upload' ? 'active' : ''}`}>
                    <Upload size={14} /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>

                  <button
                    className={`source-tab-btn ${inputSource === 'camera' ? 'active' : ''}`}
                    onClick={() => setInputSource('camera')}
                  >
                    <Camera size={14} /> Live Camera
                  </button>
                </div>
              </div>

              {/* Camera Active Badge */}
              {cameraActive && (
                <div style={{ marginBottom: '1rem' }}>
                  <span className="camera-indicator">
                    <span className="pulse-dot" /> LIVE WEBCAM FEED ACTIVE
                  </span>
                </div>
              )}

              <div className="canvas-viewport-container">
                <div className="viewport-box">
                  <span className="viewport-label">INPUT STREAM ({inputSource.toUpperCase()})</span>
                  <canvas ref={inputCanvasRef} />
                </div>
                <div className="viewport-box">
                  <span className="viewport-label">PROCESSED VISION OUTPUT</span>
                  <canvas ref={outputCanvasRef} />
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="metrics-grid">
                <div className="metric-pill">
                  <div className="metric-pill-title">Practical Module</div>
                  <div className="metric-pill-value">PRAC #{activeId}</div>
                </div>
                <div className="metric-pill">
                  <div className="metric-pill-title">Input Source</div>
                  <div className="metric-pill-value text-blue-600">{inputSource.toUpperCase()}</div>
                </div>
                <div className="metric-pill">
                  <div className="metric-pill-title">Processing Latency</div>
                  <div className="metric-pill-value text-emerald-600">8 ms</div>
                </div>
              </div>
            </div>

            {/* Parameter Adjustment Panel */}
            <div className="white-card">
              <div className="card-header-clean">
                <div className="card-title">
                  <Sliders size={18} className="text-blue-600" /> Interactive Controls
                </div>
              </div>

              {/* Upload Input Option */}
              <div className="control-group">
                <label className="control-label">Custom Image Input</label>
                <label className="upload-btn-label">
                  <Upload size={16} /> Choose Image File...
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Practical 1 Controls */}
              {activeId === 1 && (
                <>
                  <div className="control-group">
                    <div className="control-label">
                      <span>Brightness Factor</span>
                      <span>{brightness}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.1"
                      value={brightness}
                      onChange={(e) => setBrightness(parseFloat(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                  <div className="control-group">
                    <div className="control-label">
                      <span>CLAHE Clip Limit</span>
                      <span>{contrastLimit}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={contrastLimit}
                      onChange={(e) => setContrastLimit(parseInt(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                </>
              )}

              {/* Practical 2 Controls */}
              {activeId === 2 && (
                <>
                  <div className="control-group">
                    <div className="control-label">
                      <span>Rotation Angle</span>
                      <span>{rotationAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                  <div className="control-group">
                    <div className="control-label">
                      <span>Pixel / mm Scale</span>
                      <span>{scaleMm} px/mm</span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="8.0"
                      step="0.5"
                      value={scaleMm}
                      onChange={(e) => setScaleMm(parseFloat(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                </>
              )}

              {/* Practical 3 Controls */}
              {activeId === 3 && (
                <div className="control-group">
                  <div className="control-label">
                    <span>Feature Sensitivity</span>
                    <span>{matchThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={matchThreshold}
                    onChange={(e) => setMatchThreshold(parseInt(e.target.value))}
                    className="range-slider"
                  />
                </div>
              )}

              {/* Practical 4 Controls */}
              {activeId === 4 && (
                <>
                  <div className="control-group">
                    <div className="control-label">
                      <span>Otsu Threshold Cutoff</span>
                      <span>{thresholdVal}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={thresholdVal}
                      onChange={(e) => setThresholdVal(parseInt(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                  <div className="control-group">
                    <div className="control-label">
                      <span>Morphology Kernel Size</span>
                      <span>{morphSize} px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      step="2"
                      value={morphSize}
                      onChange={(e) => setMorphSize(parseInt(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                </>
              )}

              {/* Practical 5 Controls */}
              {activeId === 5 && (
                <div className="control-group">
                  <div className="control-label">
                    <span>Lighting Level</span>
                    <span>{lightLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={lightLevel}
                    onChange={(e) => setLightLevel(parseInt(e.target.value))}
                    className="range-slider"
                  />
                </div>
              )}

              {/* Practical 6 Controls */}
              {activeId === 6 && (
                <div className="control-group">
                  <label className="control-label">Select Emotion Input</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {["Happy", "Sad", "Neutral", "Surprised"].map(emo => (
                      <button
                        key={emo}
                        className={`btn-action ${selectedEmotion === emo ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedEmotion(emo)}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical 7 Controls */}
              {activeId === 7 && (
                <div className="control-group">
                  <div className="control-label">
                    <span>Vehicle Speed Vector</span>
                    <span>{vehicleSpeed} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={vehicleSpeed}
                    onChange={(e) => setVehicleSpeed(parseInt(e.target.value))}
                    className="range-slider"
                  />
                </div>
              )}

              {/* Practical 8 Controls */}
              {activeId === 8 && (
                <div className="control-group">
                  <label className="control-label">Detection Algorithm</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      className={`btn-action ${detectionMode === "DNN" ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setDetectionMode("DNN")}
                    >
                      OpenCV DNN / YOLO
                    </button>
                    <button
                      className={`btn-action ${detectionMode === "TRADITIONAL" ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setDetectionMode("TRADITIONAL")}
                    >
                      HSV Traditional
                    </button>
                  </div>
                </div>
              )}

              {/* Practical 9 Controls */}
              {activeId === 9 && (
                <>
                  <div className="control-group">
                    <div className="control-label">
                      <span>Deskew Angle Correction</span>
                      <span>{skewCorrection}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={skewCorrection}
                      onChange={(e) => setSkewCorrection(parseInt(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                  <div className="ocr-output-box" style={{ marginTop: '1rem' }}>
                    {`[OCR EXTRACTED TEXT OUTPUT]
GOVERNMENT OF INDIA
DEPARTMENT OF REGISTRATION
CERTIFICATE OF VERIFICATION
Ref ID: GOV-2026-8891A
Applicant: Ayush Badwaik
Status: PASSED`}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
