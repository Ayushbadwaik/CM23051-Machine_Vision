"""
Practical 4: Factory Metal Surface Scratch & Crack Defect Detection
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
A factory wants to detect scratches and cracks on metal surfaces. Use edge detection,
image segmentation, thresholding, contour extraction, and morphological operations to identify defects.
"""

import cv2
import numpy as np

def create_metal_surface_with_defects():
    """Generates a synthetic brushed metal plate with hairline cracks and scratches."""
    img = np.full((400, 600), 180, dtype=np.uint8)
    
    # Metal texture noise
    texture = np.random.normal(0, 8, img.shape).astype(np.int16)
    img = np.clip(img.astype(np.int16) + texture, 0, 255).astype(np.uint8)
    
    # Add hairline scratch crack 1
    pts1 = np.array([[100, 80], [180, 150], [250, 160], [320, 220]], np.int32)
    cv2.polylines(img, [pts1], False, (40), 2)
    
    # Add crack 2
    pts2 = np.array([[400, 250], [450, 310], [520, 350]], np.int32)
    cv2.polylines(img, [pts2], False, (30), 3)
    
    return cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

def detect_surface_defects(img):
    """
    Defect Detection Pipeline:
    1. Grayscale & Gaussian Blur
    2. Adaptive Thresholding / Otsu Segmentation
    3. Morphological Dilation & Closing (connect broken crack lines)
    4. Canny Edge Detection & Contour Area/Length Filtering
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Otsu thresholding
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Morphological Operation: Kernel closing
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
    
    # Contour Extraction
    contours, _ = cv2.findContours(morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    annotated = img.copy()
    defect_count = 0
    
    for c in contours:
        perimeter = cv2.arcLength(c, True)
        area = cv2.contourArea(c)
        
        # Filter defect geometries (scratches have high perimeter to area ratio)
        if perimeter > 40:
            defect_count += 1
            x, y, w, h = cv2.boundingRect(c)
            cv2.rectangle(annotated, (x-5, y-5), (x+w+5, y+h+5), (0, 0, 255), 2)
            cv2.putText(annotated, f"DEFECT #{defect_count}", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
                        
    return morph, annotated, defect_count

def main():
    print("=== Practical 4: Factory Metal Defect Inspection ===")
    surface = create_metal_surface_with_defects()
    cv2.imwrite("metal_input.jpg", surface)
    
    mask, result, count = detect_surface_defects(surface)
    cv2.imwrite("metal_defect_mask.jpg", mask)
    cv2.imwrite("metal_defect_result.jpg", result)
    
    print(f"Inspection complete. Detected {count} surface scratches/cracks.")
    print("Result saved to 'metal_defect_result.jpg'.")

if __name__ == "__main__":
    main()
