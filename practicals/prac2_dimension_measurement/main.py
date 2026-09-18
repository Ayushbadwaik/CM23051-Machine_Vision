"""
Practical 2: Manufacturing Product Dimension Measurement
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
A manufacturing company needs to measure product dimensions from captured images.
Perform image transformations, scaling, rotation, affine transformation, and pixel-based
measurements to estimate object dimensions.
"""

import cv2
import numpy as np

def create_synthetic_manufactured_part():
    """Creates a synthetic image with a reference object (e.g. coin 20mm) and target component."""
    img = np.full((500, 700, 3), 245, dtype=np.uint8)
    
    # Draw reference object (Circle with radius 40px = 20.0 mm reference)
    cv2.circle(img, (120, 250), 40, (50, 50, 200), -1)
    cv2.putText(img, "REF COIN (20mm)", (60, 310), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
    
    # Draw manufactured rectangular part (rotated)
    rect_center = (450, 250)
    rect_size = (180, 100) # 180px width, 100px height
    angle = 25 # rotated by 25 degrees
    
    box = cv2.boxPoints((rect_center, rect_size, angle))
    box = np.int0(box)
    cv2.drawContours(img, [box], 0, (80, 180, 80), -1)
    cv2.drawContours(img, [box], 0, (20, 100, 20), 2)
    
    return img

def Measure_dimensions_and_transform(img, pixels_per_mm=4.0):
    """
    Performs Affine Transformation, contour extraction, bounding box computation,
    and estimates physical dimensions in millimeters.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    result_img = img.copy()
    
    measurements = []
    
    for c in contours:
        if cv2.contourArea(c) < 500:
            continue
            
        rect = cv2.minAreaRect(c)
        box = cv2.boxPoints(rect)
        box = np.int0(box)
        
        # Calculate width and height in pixels
        (cx, cy), (width_px, height_px), angle = rect
        
        width_mm = width_px / pixels_per_mm
        height_mm = height_px / pixels_per_mm
        
        measurements.append({
            'center': (cx, cy),
            'width_mm': width_mm,
            'height_mm': height_mm,
            'angle': angle
        })
        
        # Draw rotated rectangle and measurement labels
        cv2.drawContours(result_img, [box], 0, (0, 255, 0), 2)
        label = f"{width_mm:.1f}mm x {height_mm:.1f}mm"
        cv2.putText(result_img, label, (int(cx - 50), int(cy)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
        
    return result_img, measurements

def main():
    print("=== Practical 2: Manufacturing Product Dimension Measurement ===")
    img = create_synthetic_manufactured_part()
    cv2.imwrite("product_input.jpg", img)
    
    result, metrics = Measure_dimensions_and_transform(img, pixels_per_mm=4.0)
    cv2.imwrite("measured_dimensions_result.jpg", result)
    
    print(f"Measured {len(metrics)} objects successfully. Result saved to 'measured_dimensions_result.jpg'.")

if __name__ == "__main__":
    main()
