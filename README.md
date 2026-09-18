# Department of Emerging Technologies CSE (AI&ML)
## S. B. Jain Institute of Technology, Management & Research, Nagpur
### Course Code: CM23051 - Machine Vision Laboratory

This repository contains the complete practical codebase and an interactive Web Application for **Practicals 1 to 9** of the Machine Vision course curriculum.

---

## 🌐 Interactive Web Application (White Theme)

The interactive Web Application is built with Vite, React, and an HTML5 Canvas vision processing engine featuring real-time parameter tuning and side-by-side stream comparison.

- **Theme**: Minimalist, clean White Theme background (`#ffffff` / `#f8fafc`).
- **Live Demos**: Interactive sliders for brightness boost, CLAHE clip limits, rotation angles, Otsu thresholds, feature matching sensitivity, face cascades, emotion classification, and OCR deskewing.

---

## 📂 Practical Modules Directory

| Practical | Module Title | Problem Statement & Key Algorithms | Folder Link |
| :---: | :--- | :--- | :---: |
| **Prac 1** | **Nighttime CCTV Enhancement** | Low-light surveillance image enhancement using CLAHE, Non-Local Means Denoising & Sharpening filters. | [`prac1_cctv_enhancement`](./practicals/prac1_cctv_enhancement/) |
| **Prac 2** | **Product Dimension Measurement** | Manufacturing product dimension estimation using Affine Transformations, Minimum Area Bounding Rectangles & mm scaling calibration. | [`prac2_dimension_measurement`](./practicals/prac2_dimension_measurement/) |
| **Prac 3** | **Road Sign Feature Recognition** | Autonomous vehicle road sign matching using FAST corner detection, ORB binary feature descriptors & BFMatcher. | [`prac3_road_sign_recognition`](./practicals/prac3_road_sign_recognition/) |
| **Prac 4** | **Metal Surface Defect Detection** | Quality inspection system for metal scratch and hairline crack detection using Otsu binarization, morphological closing & contour geometry. | [`prac4_defect_detection`](./practicals/prac4_defect_detection/) |
| **Prac 5** | **Attendance Face & Eye Detection** | Automated college classroom attendance system using OpenCV Haar Cascade Frontal Face and Eye Classifiers under varying lighting. | [`prac5_face_eye_detection`](./practicals/prac5_face_eye_detection/) |
| **Prac 6** | **Retail Customer Emotion Analysis** | Customer emotion analytics using deep facial feature representations classifying expressions into Happy, Sad, Neutral, and Surprised. | [`prac6_emotion_classification`](./practicals/prac6_emotion_classification/) |
| **Prac 7** | **Intersection Vehicle Tracking** | Smart city traffic analysis using MOG2 background subtraction and Lucas-Kanade / Farneback Optical Flow motion vector tracking. | [`prac7_vehicle_movement_analysis`](./practicals/prac7_vehicle_movement_analysis/) |
| **Prac 8** | **Logistics Package Object Detection** | Real-time robot package localization comparing OpenCV DNN module (YOLO/MobileNet-SSD) vs traditional HSV color thresholding. | [`prac8_package_object_detection`](./practicals/prac8_package_object_detection/) |
| **Prac 9** | **Document Vision OCR Text Extraction** | Government scanned document deskewing, adaptive binarization, and Tesseract/OpenCV text extraction & validation. | [`prac9_document_ocr`](./practicals/prac9_document_ocr/) |

---

## 🚀 Running the Python Practical Scripts

To execute any individual practical module:

```bash
cd practicals/prac1_cctv_enhancement
pip install -r requirements.txt
python main.py
```

---

## 💻 Running the Web Application Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 👤 Author
- **Name**: Ayush Badwaik
- **Repository**: [CM23051-Machine_Vision](https://github.com/Ayushbadwaik/CM23051-Machine_Vision)
- **Institution**: S. B. Jain Institute of Technology, Management & Research, Nagpur
