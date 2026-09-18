"""
Practical 1: Low-Quality Nighttime CCTV Image Enhancement
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
A security agency receives low-quality CCTV images during nighttime surveillance.
Develop a system to improve visibility using histogram equalization, filtering, brightness enhancement,
and noise removal techniques.
"""

import cv2
import numpy as np
import matplotlib.pyplot as plt
import os

def create_synthetic_cctv_image():
    """Generates a low-light, noisy synthetic CCTV surveillance image."""
    img = np.zeros((400, 600, 3), dtype=np.uint8)
    # Background building & dark road
    cv2.rectangle(img, (50, 100), (250, 380), (30, 35, 40), -1)
    cv2.rectangle(img, (300, 150), (550, 380), (20, 25, 30), -1)
    # Windows
    cv2.rectangle(img, (70, 130), (110, 170), (45, 50, 55), -1)
    cv2.rectangle(img, (180, 130), (220, 170), (45, 50, 55), -1)
    # Dark human figure (surveillance target)
    cv2.circle(img, (400, 280), 20, (15, 18, 20), -1)
    cv2.rectangle(img, (390, 300), (410, 360), (12, 15, 18), -1)
    
    # Add dark low-light contrast (scale down brightness)
    img = (img * 0.4).astype(np.uint8)
    
    # Add Gaussian & Salt-and-Pepper Noise
    noise = np.random.normal(0, 15, img.shape).astype(np.int16)
    noisy_img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    return noisy_img

def enhance_cctv_image(image):
    """
    Applies image enhancement pipeline:
    1. Brightness & Gamma Correction
    2. Denoising (Median + Gaussian Blur)
    3. Contrast Enhancement via CLAHE (Contrast Limited Adaptive Histogram Equalization)
    4. Sharpness Boosting
    """
    # 1. Convert to YCrCb / LAB color space to equalize Luminance channel
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # 2. Apply CLAHE on Luminance channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    
    # Merge channels back
    enhanced_lab = cv2.merge((cl, a, b))
    enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
    # 3. Noise Removal using Non-Local Means / Median Blur
    denoised = cv2.fastNlMeansDenoisingColored(enhanced_bgr, None, 10, 10, 7, 21)
    
    # 4. Sharpening Kernel
    kernel = np.array([[0, -1, 0],
                       [-1, 5,-1],
                       [0, -1, 0]])
    sharpened = cv2.filter2D(denoised, -1, kernel)
    
    return cl, enhanced_bgr, denoised, sharpened

def main():
    print("=== Practical 1: CCTV Nighttime Image Visibility Enhancement ===")
    
    # Load or create synthetic image
    input_img = create_synthetic_cctv_image()
    cv2.imwrite("cctv_input.jpg", input_img)
    
    hist_l, clahe_img, denoised, enhanced_result = enhance_cctv_image(input_img)
    cv2.imwrite("cctv_enhanced_result.jpg", enhanced_result)
    
    print("CCTV Image successfully enhanced and saved to 'cctv_enhanced_result.jpg'.")

if __name__ == "__main__":
    main()
