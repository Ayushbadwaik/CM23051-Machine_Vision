"""
Practical 3: Autonomous Vehicle Road Sign Recognition
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
An autonomous vehicle must recognize road signs from images. Implement corner detection,
feature extraction, and feature matching using ORB/FAST/BRIEF descriptors to identify
road signs from a reference database.
"""

import cv2
import numpy as np

def create_synthetic_road_sign():
    """Generates a reference STOP sign image."""
    img = np.full((300, 300, 3), 255, dtype=np.uint8)
    pts = np.array([[90, 20], [210, 20], [280, 90], [280, 210],
                    [210, 280], [90, 280], [20, 210], [20, 90]], np.int32)
    pts = pts.reshape((-1, 1, 2))
    cv2.fillPoly(img, [pts], (0, 0, 220))
    cv2.polylines(img, [pts], True, (255, 255, 255), 4)
    cv2.putText(img, "STOP", (60, 175), cv2.FONT_HERSHEY_SIMPLEX, 2.2, (255, 255, 255), 6)
    return img

def create_scene_with_sign(sign_img):
    """Embeds the road sign inside a larger camera frame with rotation and perspective."""
    scene = np.full((600, 800, 3), 180, dtype=np.uint8)
    # Add road & background sky
    cv2.rectangle(scene, (0, 0), (800, 300), (220, 190, 170), -1) # Sky
    cv2.rectangle(scene, (0, 300), (800, 600), (80, 80, 80), -1) # Road
    
    # Scale and place sign on the right side
    small_sign = cv2.resize(sign_img, (150, 150))
    scene[100:250, 500:650] = small_sign
    return scene

def detect_and_match_features(ref_img, scene_img):
    """
    Uses ORB (Oriented FAST and Rotated BRIEF) descriptor extractor and
    FLANN / BFMatcher to match feature points between reference road sign and vehicle scene.
    """
    orb = cv2.ORB_create(nfeatures=1000)
    
    # Detect keypoints & descriptors
    kp1, des1 = orb.detectAndCompute(ref_img, None)
    kp2, des2 = orb.detectAndCompute(scene_img, None)
    
    # Hamming distance matcher for binary ORB descriptors
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    
    # Sort matches by distance
    matches = sorted(matches, key=lambda x: x.distance)
    
    # Draw top 30 matches
    matched_img = cv2.drawMatches(ref_img, kp1, scene_img, kp2, matches[:30], None,
                                  flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
                                  
    return matched_img, len(matches)

def main():
    print("=== Practical 3: Autonomous Vehicle Road Sign Feature Matching ===")
    sign = create_synthetic_road_sign()
    scene = create_scene_with_sign(sign)
    
    cv2.imwrite("ref_sign.jpg", sign)
    cv2.imwrite("dashcam_scene.jpg", scene)
    
    matched_res, total_matches = detect_and_match_features(sign, scene)
    cv2.imwrite("road_sign_matching_result.jpg", matched_res)
    
    print(f"Road sign feature matching completed with {total_matches} feature correspondences.")
    print("Result saved to 'road_sign_matching_result.jpg'.")

if __name__ == "__main__":
    main()
