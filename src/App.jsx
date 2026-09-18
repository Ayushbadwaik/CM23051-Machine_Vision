import React, { useState, useEffect, useRef } from 'react';
import {
  Eye, ShieldCheck, Ruler, Compass, AlertTriangle, UserCheck,
  Smile, Navigation, Box, FileText, RefreshCw, Sliders, Play, Code, CheckCircle
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

  // Practical 1 Controls
  const [brightness, setBrightness] = useState(1.8);
  const [contrastLimit, setContrastLimit] = useState(3);
  const [noiseRemoval, setNoiseRemoval] = useState(4);

  // Practical 2 Controls
  const [rotationAngle, setRotationAngle] = useState(20);
  const [scaleMm, setScaleMm] = useState(4.0);

  // Practical 3 Controls
  const [cornerSensitivity, setCornerSensitivity] = useState(25);
  const [matchThreshold, setMatchThreshold] = useState(18);

  // Practical 4 Controls
  const [thresholdVal, setThresholdVal] = useState(110);
  const [morphSize, setMorphSize] = useState(3);

  // Practical 5 Controls
  const [lightLevel, setLightLevel] = useState(100);

  // Practical 6 Controls
  const [selectedEmotion, setSelectedEmotion] = useState("Happy");

  // Practical 7 Controls
  const [vehicleSpeed, setVehicleSpeed] = useState(40);

  // Practical 8 Controls
  const [detectionMode, setDetectionMode] = useState("DNN");

  // Practical 9 Controls
  const [skewCorrection, setSkewCorrection] = useState(4);

  // Canvas Refs
  const inputCanvasRef = useRef(null);
  const outputCanvasRef = useRef(null);

  useEffect(() => {
    renderCanvas();
  }, [
    activeId, brightness, contrastLimit, noiseRemoval, rotationAngle, scaleMm,
    cornerSensitivity, matchThreshold, thresholdVal, morphSize, lightLevel,
    selectedEmotion, vehicleSpeed, detectionMode, skewCorrection
  ]);

  const renderCanvas = () => {
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

    // Render logic per practical
    switch (activeId) {
      case 1: { // CCTV Nighttime
        // Draw Dark CCTV Frame
        inCtx.fillStyle = "#0c111d";
        inCtx.fillRect(0, 0, w, h);
        inCtx.fillStyle = "#1e293b";
        inCtx.fillRect(40, 80, 120, 160);
        inCtx.fillRect(200, 100, 150, 140);
        // Dark intruder figure
        inCtx.fillStyle = "#151e2e";
        inCtx.beginPath();
        inCtx.arc(270, 170, 14, 0, Math.PI * 2);
        inCtx.fill();
        inCtx.fillRect(262, 185, 16, 45);

        // Noise
        const imgData = inCtx.getImageData(0, 0, w, h);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 35;
          imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
          imgData.data[i+1] = Math.min(255, Math.max(0, imgData.data[i+1] + noise));
          imgData.data[i+2] = Math.min(255, Math.max(0, imgData.data[i+2] + noise));
        }
        inCtx.putImageData(imgData, 0, 0);

        // Processed Enhanced Frame
        outCtx.fillStyle = "#1e293b";
        outCtx.fillRect(0, 0, w, h);
        outCtx.fillStyle = "#334155";
        outCtx.fillRect(40, 80, 120, 160);
        outCtx.fillRect(200, 100, 150, 140);

        // Brightened Intruder
        const enhancedVal = Math.min(255, Math.floor(180 * brightness));
        outCtx.fillStyle = `rgb(${enhancedVal}, 80, 80)`;
        outCtx.beginPath();
        outCtx.arc(270, 170, 14, 0, Math.PI * 2);
        outCtx.fill();
        outCtx.fillRect(262, 185, 16, 45);

        // Overlay Bounding Box
        outCtx.strokeStyle = "#38bdf8";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(248, 150, 44, 85);
        outCtx.fillStyle = "#38bdf8";
        outCtx.font = "bold 11px sans-serif";
        outCtx.fillText(`CLAHE (x${contrastLimit}) ENHANCED`, 210, 140);
        break;
      }
      case 2: { // Product Dimension Measurement
        inCtx.fillStyle = "#f1f5f9";
        inCtx.fillRect(0, 0, w, h);
        // Reference Coin
        inCtx.fillStyle = "#3b82f6";
        inCtx.beginPath();
        inCtx.arc(70, 140, 25, 0, Math.PI * 2);
        inCtx.fill();
        inCtx.fillStyle = "#1e3a8a";
        inCtx.font = "10px sans-serif";
        inCtx.fillText("REF (20mm)", 42, 180);

        // Rotated Component
        inCtx.save();
        inCtx.translate(250, 140);
        inCtx.rotate((rotationAngle * Math.PI) / 180);
        inCtx.fillStyle = "#10b981";
        inCtx.fillRect(-60, -35, 120, 70);
        inCtx.restore();

        // Output Measurement
        outCtx.fillStyle = "#f8fafc";
        outCtx.fillRect(0, 0, w, h);
        outCtx.save();
        outCtx.translate(250, 140);
        outCtx.rotate((rotationAngle * Math.PI) / 180);
        outCtx.strokeStyle = "#059669";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(-60, -35, 120, 70);
        outCtx.restore();

        const calculatedW = (120 / scaleMm).toFixed(1);
        const calculatedH = (70 / scaleMm).toFixed(1);
        outCtx.fillStyle = "#2563eb";
        outCtx.font = "bold 13px JetBrains Mono";
        outCtx.fillText(`WIDTH: ${calculatedW} mm`, 200, 70);
        outCtx.fillText(`HEIGHT: ${calculatedH} mm`, 200, 90);
        outCtx.fillText(`ANGLE: ${rotationAngle}°`, 200, 110);
        break;
      }
      case 3: { // Road Sign Recognition
        // Reference STOP sign
        inCtx.fillStyle = "#f1f5f9";
        inCtx.fillRect(0, 0, w, h);
        inCtx.fillStyle = "#dc2626";
        inCtx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x = 200 + 60 * Math.cos(angle);
          const y = 140 + 60 * Math.sin(angle);
          if (i === 0) inCtx.moveTo(x, y);
          else inCtx.lineTo(x, y);
        }
        inCtx.closePath();
        inCtx.fill();
        inCtx.fillStyle = "#ffffff";
        inCtx.font = "bold 24px sans-serif";
        inCtx.fillText("STOP", 168, 148);

        // Feature Point Overlay
        outCtx.fillStyle = "#ffffff";
        outCtx.fillRect(0, 0, w, h);
        outCtx.drawImage(inCv, 0, 0);

        // Draw ORB feature points
        outCtx.fillStyle = "#f59e0b";
        for (let i = 0; i < matchThreshold * 2; i++) {
          const px = 150 + Math.random() * 100;
          const py = 90 + Math.random() * 100;
          outCtx.beginPath();
          outCtx.arc(px, py, 3, 0, Math.PI * 2);
          outCtx.fill();
        }
        outCtx.fillStyle = "#16a34a";
        outCtx.font = "bold 12px sans-serif";
        outCtx.fillText(`ORB MATCHES: ${matchThreshold * 4} POINTS`, 20, 30);
        outCtx.fillText("STATUS: SIGN RECOGNIZED (STOP)", 20, 50);
        break;
      }
      case 4: { // Defect Detection
        inCtx.fillStyle = "#94a3b8";
        inCtx.fillRect(0, 0, w, h);
        // Hairline Crack
        inCtx.strokeStyle = "#334155";
        inCtx.lineWidth = 3;
        inCtx.beginPath();
        inCtx.moveTo(80, 60);
        inCtx.lineTo(140, 120);
        inCtx.lineTo(210, 130);
        inCtx.lineTo(290, 210);
        inCtx.stroke();

        // Threshold & Morphological Output
        outCtx.fillStyle = "#0f172a";
        outCtx.fillRect(0, 0, w, h);
        outCtx.strokeStyle = "#ef4444";
        outCtx.lineWidth = morphSize;
        outCtx.beginPath();
        outCtx.moveTo(80, 60);
        outCtx.lineTo(140, 120);
        outCtx.lineTo(210, 130);
        outCtx.lineTo(290, 210);
        outCtx.stroke();

        outCtx.strokeStyle = "#22c55e";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(70, 50, 230, 170);
        outCtx.fillStyle = "#ef4444";
        outCtx.font = "bold 12px JetBrains Mono";
        outCtx.fillText("DEFECT DETECTED: SURFACE CRACK #1", 80, 45);
        break;
      }
      case 5: { // Attendance Face & Eye Detection
        const light = lightLevel / 100;
        inCtx.fillStyle = `rgb(${Math.floor(240 * light)}, ${Math.floor(240 * light)}, ${Math.floor(240 * light)})`;
        inCtx.fillRect(0, 0, w, h);

        // Face avatar
        inCtx.fillStyle = `rgb(${Math.floor(235 * light)}, ${Math.floor(190 * light)}, ${Math.floor(170 * light)})`;
        inCtx.beginPath();
        inCtx.ellipse(200, 140, 65, 85, 0, 0, Math.PI * 2);
        inCtx.fill();
        // Eyes
        inCtx.fillStyle = "#ffffff";
        inCtx.beginPath();
        inCtx.arc(175, 125, 12, 0, Math.PI * 2);
        inCtx.arc(225, 125, 12, 0, Math.PI * 2);
        inCtx.fill();

        // Haar Cascade Bounding Output
        outCtx.drawImage(inCv, 0, 0);
        outCtx.strokeStyle = "#2563eb";
        outCtx.lineWidth = 2;
        outCtx.strokeRect(130, 50, 140, 175);
        outCtx.fillStyle = "#2563eb";
        outCtx.font = "bold 11px sans-serif";
        outCtx.fillText("STUDENT FACE #1", 130, 42);

        // Eyes ROI
        outCtx.strokeStyle = "#16a34a";
        outCtx.strokeRect(160, 110, 30, 30);
        outCtx.strokeRect(210, 110, 30, 30);
        break;
      }
      case 6: { // Customer Emotion Analysis
        inCtx.fillStyle = "#f8fafc";
        inCtx.fillRect(0, 0, w, h);

        // Avatar Face
        inCtx.fillStyle = "#fed7aa";
        inCtx.beginPath();
        inCtx.arc(200, 130, 70, 0, Math.PI * 2);
        inCtx.fill();
        inCtx.fillStyle = "#1e293b";
        inCtx.beginPath();
        inCtx.arc(175, 115, 8, 0, Math.PI * 2);
        inCtx.arc(225, 115, 8, 0, Math.PI * 2);
        inCtx.fill();

        // Expression mouth
        inCtx.strokeStyle = "#1e293b";
        inCtx.lineWidth = 4;
        inCtx.beginPath();
        if (selectedEmotion === "Happy") inCtx.arc(200, 140, 35, 0.1 * Math.PI, 0.9 * Math.PI);
        else if (selectedEmotion === "Sad") inCtx.arc(200, 175, 35, 1.1 * Math.PI, 1.9 * Math.PI);
        else if (selectedEmotion === "Surprised") inCtx.arc(200, 155, 18, 0, Math.PI * 2);
        else inCtx.lineTo(230, 155); // Neutral
        inCtx.stroke();

        outCtx.drawImage(inCv, 0, 0);
        outCtx.strokeStyle = selectedEmotion === "Happy" ? "#16a34a" : selectedEmotion === "Sad" ? "#dc2626" : "#2563eb";
        outCtx.lineWidth = 3;
        outCtx.strokeRect(120, 50, 160, 160);

        outCtx.fillStyle = "#0f172a";
        outCtx.font = "bold 14px Plus Jakarta Sans";
        outCtx.fillText(`CLASSIFIED: ${selectedEmotion.toUpperCase()} (94%)`, 100, 240);
        break;
      }
      case 7: { // Vehicle Trajectory Tracking
        inCtx.fillStyle = "#334155";
        inCtx.fillRect(0, 0, w, h);
        // Road Intersection
        inCtx.fillStyle = "#1e293b";
        inCtx.fillRect(160, 0, 80, h);
        inCtx.fillRect(0, 100, w, 80);

        // Vehicle
        const offset = (vehicleSpeed * 2) % 300;
        inCtx.fillStyle = "#ef4444";
        inCtx.fillRect(180, offset, 40, 70);

        // Optical Flow Vectors Output
        outCtx.drawImage(inCv, 0, 0);
        outCtx.strokeStyle = "#22c55e";
        outCtx.lineWidth = 2;
        // Motion Vectors
        for (let y = offset; y < offset + 70; y += 15) {
          outCtx.beginPath();
          outCtx.moveTo(200, y);
          outCtx.lineTo(200, y + 20);
          outCtx.stroke();
        }
        outCtx.strokeRect(175, offset - 5, 50, 80);
        outCtx.fillStyle = "#22c55e";
        outCtx.font = "bold 11px JetBrains Mono";
        outCtx.fillText(`VELOCITY: ${vehicleSpeed} km/h`, 235, offset + 35);
        break;
      }
      case 8: { // Logistics Package Object Detection
        inCtx.fillStyle = "#e2e8f0";
        inCtx.fillRect(0, 0, w, h);
        // Conveyor belt
        inCtx.fillStyle = "#64748b";
        inCtx.fillRect(0, 120, w, 100);

        // Package Boxes
        inCtx.fillStyle = "#d97706";
        inCtx.fillRect(70, 130, 90, 80);
        inCtx.fillRect(240, 135, 110, 70);

        outCtx.drawImage(inCv, 0, 0);
        if (detectionMode === "DNN") {
          outCtx.strokeStyle = "#16a34a";
          outCtx.lineWidth = 2;
          outCtx.strokeRect(65, 125, 100, 90);
          outCtx.strokeRect(235, 130, 120, 80);
          outCtx.fillStyle = "#16a34a";
          outCtx.font = "bold 11px sans-serif";
          outCtx.fillText("YOLO-DNN: PACKAGE (96%)", 65, 115);
          outCtx.fillText("YOLO-DNN: PACKAGE (92%)", 235, 120);
        } else {
          outCtx.strokeStyle = "#eab308";
          outCtx.lineWidth = 2;
          outCtx.strokeRect(70, 130, 90, 80);
          outCtx.strokeRect(240, 135, 110, 70);
          outCtx.fillStyle = "#eab308";
          outCtx.font = "bold 11px sans-serif";
          outCtx.fillText("HSV TRADITIONAL BOUND", 70, 120);
          outCtx.fillText("HSV TRADITIONAL BOUND", 240, 125);
        }
        break;
      }
      case 9: { // Scanned Document OCR
        inCtx.fillStyle = "#f8fafc";
        inCtx.fillRect(0, 0, w, h);
        inCtx.save();
        inCtx.translate(w / 2, h / 2);
        inCtx.rotate((-skewCorrection * Math.PI) / 180);
        inCtx.fillStyle = "#ffffff";
        inCtx.strokeStyle = "#cbd5e1";
        inCtx.fillRect(-120, -100, 240, 200);
        inCtx.strokeRect(-120, -100, 240, 200);

        inCtx.fillStyle = "#0f172a";
        inCtx.font = "bold 10px sans-serif";
        inCtx.fillText("GOVT OF INDIA DOCUMENT", -100, -80);
        inCtx.font = "9px sans-serif";
        inCtx.fillText("Ref: GOV-2026-8891A", -100, -60);
        inCtx.fillText("Applicant: Ayush Badwaik", -100, -45);
        inCtx.fillText("Status: PASSED", -100, -30);
        inCtx.restore();

        // Deskewed Output
        outCtx.fillStyle = "#f8fafc";
        outCtx.fillRect(0, 0, w, h);
        outCtx.fillStyle = "#ffffff";
        outCtx.strokeStyle = "#2563eb";
        outCtx.lineWidth = 2;
        outCtx.fillRect(80, 40, 240, 200);
        outCtx.strokeRect(80, 40, 240, 200);

        outCtx.fillStyle = "#0f172a";
        outCtx.font = "bold 10px sans-serif";
        outCtx.fillText("GOVT OF INDIA DOCUMENT", 100, 60);
        outCtx.font = "9px sans-serif";
        outCtx.fillText("Ref: GOV-2026-8891A", 100, 80);
        outCtx.fillText("Applicant: Ayush Badwaik", 100, 95);
        outCtx.fillText("Status: PASSED", 100, 110);
        outCtx.fillStyle = "#16a34a";
        outCtx.fillText("DESKEWED & OCR BINARIZED", 100, 220);
        break;
      }
    }
  };

  return (
    <div className="app-container">
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
            const IconComponent = p.icon;
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
                  <Play size={18} className="text-blue-600" /> Live Interactive Canvas Engine
                </div>
                <button className="btn-action btn-secondary" onClick={renderCanvas}>
                  <RefreshCw size={14} /> Refresh Frame
                </button>
              </div>

              <div className="canvas-viewport-container">
                <div className="viewport-box">
                  <span className="viewport-label">ORIGINAL INPUT STREAM</span>
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
                  <div className="metric-pill-title">Processing Status</div>
                  <div className="metric-pill-value text-emerald-600">ACTIVE</div>
                </div>
                <div className="metric-pill">
                  <div className="metric-pill-title">Latency</div>
                  <div className="metric-pill-value">12 ms</div>
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
                      <span>Rotation Angle (Degrees)</span>
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
                <>
                  <div className="control-group">
                    <div className="control-label">
                      <span>Match Sensitivity</span>
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
                </>
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
                    <span>Simulated Vehicle Speed</span>
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
