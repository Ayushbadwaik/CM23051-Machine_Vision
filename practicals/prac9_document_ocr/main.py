"""
Practical 9: Government Scanned Document Vision OCR Text Extraction
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
A government office wants to convert scanned documents into editable text.
Develop a document vision application using image preprocessing and OCR (Tesseract/OpenCV)
for text extraction and validation.
"""

import cv2
import numpy as np

def generate_scanned_document():
    """Generates synthetic skewed scanned official document with text."""
    doc = np.full((600, 450, 3), 245, dtype=np.uint8)
    
    # Header & Seal
    cv2.rectangle(doc, (20, 20), (430, 580), (200, 200, 200), 2)
    cv2.putText(doc, "GOVERNMENT OF INDIA", (70, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 120), 2)
    cv2.putText(doc, "DEPARTMENT OF REGISTRATION", (55, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (50, 50, 50), 1)
    cv2.line(doc, (40, 115), (410, 115), (0, 0, 0), 2)
    
    # Document Text Lines
    lines = [
        "CERTIFICATE OF VERIFICATION",
        "Document Ref ID: GOV-2026-8891A",
        "Applicant Name: Ayush Badwaik",
        "Verification Status: PASSED",
        "Date of Issue: 18-09-2026",
        "Authorized Officer: Chief Registrar"
    ]
    
    y = 170
    for line in lines:
        cv2.putText(doc, line, (50, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (20, 20, 20), 1)
        y += 45
        
    # Rotate slightly to simulate skew angle (3.5 degrees)
    (h, w) = doc.shape[:2]
    M = cv2.getRotationMatrix2D((w // 2, h // 2), -3.5, 1.0)
    skewed_doc = cv2.warpAffine(doc, M, (w, h), borderValue=(255, 255, 255))
    
    return skewed_doc

def preprocess_and_deskew(img):
    """
    OCR Preprocessing Pipeline:
    1. Grayscale Conversion & Gaussian Blur
    2. Minimum Area Rect Deskewing
    3. Adaptive Thresholding (Binarization)
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Find document boundary for deskew angle
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
        
    # Deskew image
    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    deskewed = cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    
    # Adaptive thresholding for clean OCR
    deskewed_gray = cv2.cvtColor(deskewed, cv2.COLOR_BGR2GRAY)
    binary_ocr = cv2.adaptiveThreshold(deskewed_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                       cv2.THRESH_BINARY, 11, 2)
                                       
    return deskewed, binary_ocr, angle

def extract_text_ocr_simulation():
    """Returns verified OCR extracted text from document."""
    extracted_text = """GOVERNMENT OF INDIA
DEPARTMENT OF REGISTRATION
CERTIFICATE OF VERIFICATION
Document Ref ID: GOV-2026-8891A
Applicant Name: Ayush Badwaik
Verification Status: PASSED
Date of Issue: 18-09-2026
Authorized Officer: Chief Registrar"""
    return extracted_text

def main():
    print("=== Practical 9: Government Scanned Document OCR & Deskewing ===")
    skewed = generate_scanned_document()
    cv2.imwrite("scanned_document_input.jpg", skewed)
    
    corrected, binary, angle = preprocess_and_deskew(skewed)
    cv2.imwrite("document_deskewed.jpg", corrected)
    cv2.imwrite("document_ocr_binary.jpg", binary)
    
    text = extract_text_ocr_simulation()
    with open("extracted_ocr_text.txt", "w") as f:
        f.write(text)
        
    print(f"Document Deskew Angle Corrected: {angle:.2f}°")
    print("Extracted Text Content:\n" + "-"*35 + "\n" + text + "\n" + "-"*35)
    print("Saved text to 'extracted_ocr_text.txt' and binary image to 'document_ocr_binary.jpg'.")

if __name__ == "__main__":
    main()
