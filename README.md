# Department of Emerging Technologies CSE (AI&ML)
## S. B. Jain Institute of Technology, Management & Research, Nagpur
### Course Code: CM23051 - Machine Vision Laboratory

This repository contains the complete practical curriculum codebase, Pre-Lab system, interactive White Theme Web Application, and the **Post-Lab Offline Handwritten Signature Verification System**.

---

## 🚀 Lab System Structure

- 🌐 **Interactive Web Application (White Theme)**: `http://localhost:5173`
- 📑 **MV-Prelab Application**: `http://localhost:5050`
- ✒️ **MV-Postlab Signature Verification System**: `http://localhost:5051`

---

## 📂 Laboratory Folders & Modules

| Module Directory | Description & Key Features | Server / Execution |
| :--- | :--- | :---: |
| **[`MV-Postlab`](./MV-Postlab/)** | **Offline Handwritten Signature Verification System**: Auto-cropping, Otsu binarization, normalized template comparison, Geometric, Projection, Stroke Gradient, ORB & SSIM descriptors, percentage similarity score, and printable PDF certificate generator. | `python app.py` (`:5051`) or `python main.py` |
| **[`MV-Prelab`](./MV-Prelab/)** | **Machine Vision Fundamentals Pre-Lab**: Image loading, display, properties extraction (dimensions, channels, mean colors), RGB/HSV channel decomposition, and live webcam video streaming. | `python app.py` (`:5050`) |
| **`practicals/prac1_cctv_enhancement`** | **Prac 1**: Low-quality CCTV image visibility enhancement using CLAHE, Non-Local Means Denoising & Sharpening filters. | `python main.py` |
| **`practicals/prac2_dimension_measurement`** | **Prac 2**: Manufacturing product dimension estimation using Affine Transformations, Minimum Area Bounding Rectangles & mm scaling calibration. | `python main.py` |
| **`practicals/prac3_road_sign_recognition`** | **Prac 3**: Autonomous vehicle road sign matching using FAST corner detection, ORB binary feature descriptors & BFMatcher. | `python main.py` |
| **`practicals/prac4_defect_detection`** | **Prac 4**: Quality inspection system for metal scratch and hairline crack detection using Otsu binarization, morphological closing & contour geometry. | `python main.py` |
| **`practicals/prac5_face_eye_detection`** | **Prac 5**: Automated college classroom attendance system using OpenCV Haar Cascade Frontal Face and Eye Classifiers under varying lighting. | `python main.py` |
| **`practicals/prac6_emotion_classification`** | **Prac 6**: Customer emotion analytics using deep facial feature representations classifying expressions into Happy, Sad, Neutral, and Surprised. | `python main.py` |
| **`practicals/prac7_vehicle_movement_analysis`** | **Prac 7**: Smart city traffic analysis using MOG2 background subtraction and Lucas-Kanade / Farneback Optical Flow motion vector tracking. | `python main.py` |
| **`practicals/prac8_package_object_detection`** | **Prac 8**: Real-time robot package localization comparing OpenCV DNN module (YOLO/MobileNet-SSD) vs traditional HSV color thresholding. | `python main.py` |
| **`practicals/prac9_document_ocr`** | **Prac 9**: Government scanned document deskewing, adaptive binarization, and Tesseract/OpenCV text extraction & validation. | `python main.py` |

---

## 💻 Running Applications Locally

### Post-Lab Signature Verification System
```bash
cd MV-Postlab
pip install -r requirements.txt
python app.py
```

### Main React Web Application
```bash
npm install
npm run dev
```

---

## 👤 Author Details
- **Student Name**: Ayush Badwaik
- **Roll Number**: CM23051
- **Repository**: [CM23051-Machine_Vision](https://github.com/Ayushbadwaik/CM23051-Machine_Vision)
- **Institution**: S. B. Jain Institute of Technology, Management & Research, Nagpur
