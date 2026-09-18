"""
Machine Vision Post-Lab: Offline Handwritten Signature Verification System
CLI Execution & Batch Verification Demonstration
Author: Ayush Badwaik | CM23051
"""

import cv2
import numpy as np
import json
import os
from signature_verifier import compare_signatures

def generate_synthetic_signature(name="Ayush Badwaik", style="genuine"):
    """Generates synthetic handwritten signature sample images for testing."""
    img = np.full((200, 450, 3), 255, dtype=np.uint8)
    
    # Draw paper texture noise
    noise = np.random.normal(0, 3, img.shape).astype(np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    # Signature stroke curves
    if style == "genuine":
        # Signature stroke A
        pts1 = np.array([[40, 140], [90, 50], [130, 160], [180, 70], [240, 150]], np.int32)
        cv2.polylines(img, [pts1], False, (20, 30, 120), 3, lineType=cv2.LINE_AA)
        
        # Flourish loop
        cv2.ellipse(img, (280, 100), (60, 40), 30, 0, 360, (20, 30, 120), 2, lineType=cv2.LINE_AA)
        cv2.line(img, (40, 165), (380, 160), (20, 30, 120), 2, lineType=cv2.LINE_AA)
        cv2.putText(img, "A. Badwaik", (220, 140), cv2.FONT_HERSHEY_SCRIPT_SIMPLEX, 1.2, (20, 30, 120), 2, cv2.LINE_AA)
        
    elif style == "genuine_variant":
        # Slight natural human variation of genuine signature
        pts1 = np.array([[42, 138], [88, 52], [132, 158], [182, 72], [238, 148]], np.int32)
        cv2.polylines(img, [pts1], False, (15, 25, 115), 3, lineType=cv2.LINE_AA)
        
        cv2.ellipse(img, (278, 102), (58, 42), 28, 0, 360, (15, 25, 115), 2, lineType=cv2.LINE_AA)
        cv2.line(img, (42, 163), (378, 162), (15, 25, 115), 2, lineType=cv2.LINE_AA)
        cv2.putText(img, "A. Badwaik", (222, 138), cv2.FONT_HERSHEY_SCRIPT_SIMPLEX, 1.15, (15, 25, 115), 2, cv2.LINE_AA)
        
    else: # Forgery attempt
        # Altered shape, different stroke thickness and loop angle
        pts1 = np.array([[30, 110], [110, 120], [160, 90], [210, 130]], np.int32)
        cv2.polylines(img, [pts1], False, (40, 40, 40), 4, lineType=cv2.LINE_AA)
        cv2.circle(img, (300, 110), 35, (40, 40, 40), 3)
        cv2.line(img, (30, 150), (320, 150), (40, 40, 40), 3)
        cv2.putText(img, "A Badwaik", (200, 120), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (40, 40, 40), 2)
        
    return img

def run_verification_demo():
    print("=" * 70)
    print("  MACHINE VISION POST-LAB: OFFLINE SIGNATURE VERIFICATION SYSTEM")
    print("  Author: Ayush Badwaik | CM23051")
    print("=" * 70)
    
    # 1. Generate test templates
    os.makedirs("sample_signatures", exist_ok=True)
    ref_sig = generate_synthetic_signature("Ayush Badwaik", "genuine")
    test_sig_genuine = generate_synthetic_signature("Ayush Badwaik", "genuine_variant")
    test_sig_forged = generate_synthetic_signature("Ayush Badwaik", "forged")
    
    cv2.imwrite("sample_signatures/ref_template.png", ref_sig)
    cv2.imwrite("sample_signatures/test_genuine.png", test_sig_genuine)
    cv2.imwrite("sample_signatures/test_forged.png", test_sig_forged)
    
    # 2. Test Genuine Verification Case
    print("\n[TEST 1] Comparing Reference Template vs Genuine Variant...")
    result_genuine = compare_signatures(ref_sig, test_sig_genuine, threshold=75.0)
    
    print(f" -> Composite Similarity Score : {result_genuine['composite_similarity']}%")
    print(f" -> Authenticity Verdict        : {result_genuine['verdict']}")
    print(" -> Feature Breakdown:")
    for k, v in result_genuine["metrics"].items():
        print(f"    - {k:25s}: {v}")
        
    # 3. Test Forgery Verification Case
    print("\n[TEST 2] Comparing Reference Template vs Forgery Attempt...")
    result_forged = compare_signatures(ref_sig, test_sig_forged, threshold=75.0)
    
    print(f" -> Composite Similarity Score : {result_forged['composite_similarity']}%")
    print(f" -> Authenticity Verdict        : {result_forged['verdict']}")
    print(" -> Feature Breakdown:")
    for k, v in result_forged["metrics"].items():
        print(f"    - {k:25s}: {v}")
        
    # Save verification JSON report
    report_data = {
        "institution": "S. B. Jain Institute of Technology, Management & Research",
        "department": "Emerging Technologies CSE (AI&ML)",
        "author": "Ayush Badwaik (CM23051)",
        "genuine_test": result_genuine,
        "forged_test": result_forged
    }
    with open("verification_report.json", "w") as f:
        json.dump(report_data, f, indent=2)
        
    print("\n" + "=" * 70)
    print("Verification complete. Full report written to 'verification_report.json'.")
    print("Sample signature images saved in 'sample_signatures/' directory.")
    print("=" * 70)

if __name__ == "__main__":
    run_verification_demo()
