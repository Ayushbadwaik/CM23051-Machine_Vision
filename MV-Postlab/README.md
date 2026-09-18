# Machine Vision Post-Lab: Offline Handwritten Signature Verification System

## Department of Emerging Technologies CSE (AI&ML)
### S. B. Jain Institute of Technology, Management & Research, Nagpur
**Author:** Ayush Badwaik | CM23051

---

## 🎯 Problem Statement & Overview
Develop a machine vision-based offline handwritten signature verification system using digital image processing (DIP) and feature extraction techniques that can:
1. **Crop, Binarize, and Normalize** signature images into standard 300x150 templates.
2. **Calculate Multi-Descriptor Similarity Scores** comparing Reference and Test signature samples.
3. **Extract Descriptors**:
   - **Geometric**: Aspect Ratio, Foreground Pixel Density, Centroid (Cx, Cy) Offsets.
   - **Stroke & Projection**: Horizontal and Vertical Projection Profiles, 8-Bin Sobel Gradient Stroke Orientation Histogram.
   - **Structural & Shape**: ORB Feature Keypoints Matching & SSIM (Structural Similarity Index).
4. **Generate Verification Reports**: Calculates weighted percentage similarity scores, determines authenticity verdicts (GENUINE vs FORGED/SUSPECTED), and exports printable verification certificate reports.

---

## 🚀 Execution Instructions

### 1. Run Interactive Flask Web Application
```bash
cd MV-Postlab
pip install -r requirements.txt
python app.py
```
Open **[http://localhost:5051](http://localhost:5051)** in your browser.

### 2. Run CLI Batch Signature Verification Engine
```bash
python main.py
```
This executes automated tests comparing synthetic reference templates against genuine and forged signature variants, outputting `verification_report.json` and saved images in `sample_signatures/`.

---

## 🔬 Feature Descriptors & Similarity Metrics

| Feature Category | Extraction Technique | Metric Computed |
| :--- | :--- | :--- |
| **Preprocessing** | Otsu Thresholding & Bounding Rect Padding | Standardized 300x150 crop |
| **Geometric Descriptors** | Moments & Contour Area Bounding | Aspect ratio, density & centroid distance |
| **Projection Profiles** | Horizontal (Row) & Vertical (Col) Sums | Cross-correlation profile score |
| **Stroke Orientation** | Sobel Gx, Gy Gradient Magnitude/Angle | 8-Bin Histogram Intersection |
| **ORB Feature Match** | Binary Descriptor Extraction | Brute-force Hamming distance matching |
| **Structural SSIM** | Matrix Pixel Normalization Difference | Mean Structural Similarity Index |

---

## 👤 Author & Course Details
- **Student Name**: Ayush Badwaik
- **Roll Number**: CM23051
- **Course**: Machine Vision Laboratory (CM23051)
- **Institution**: S. B. Jain Institute of Technology, Management & Research, Nagpur
