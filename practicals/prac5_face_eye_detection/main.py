"""
Practical 5: Automated College Attendance Face & Eye Detection
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
A college plans to automate attendance. Develop a face and eye detection system using
Haar Cascade classifiers and evaluate detection accuracy under different lighting conditions.
"""

import cv2
import numpy as np

def generate_synthetic_classroom_face():
    """Generates a synthetic facial avatar image for detection benchmark."""
    img = np.full((400, 400, 3), 230, dtype=np.uint8)
    
    # Draw head / face oval
    cv2.ellipse(img, (200, 200), (100, 130), 0, 0, 360, (180, 200, 230), -1)
    # Eyes
    cv2.circle(img, (160, 170), 18, (255, 255, 255), -1)
    cv2.circle(img, (160, 170), 8, (50, 40, 30), -1)
    cv2.circle(img, (240, 170), 18, (255, 255, 255), -1)
    cv2.circle(img, (240, 170), 8, (50, 40, 30), -1)
    # Eyebrows
    cv2.line(img, (135, 145), (185, 148), (40, 30, 20), 4)
    cv2.line(img, (215, 148), (265, 145), (40, 30, 20), 4)
    # Nose & Mouth
    cv2.line(img, (200, 180), (195, 220), (120, 140, 170), 3)
    cv2.ellipse(img, (200, 260), (45, 15), 0, 0, 180, (80, 70, 180), 3)
    
    return img

def detect_faces_and_eyes(img):
    """
    Applies OpenCV Haar Cascade models for Frontal Face and Eye detection.
    Evaluates multiscale scaleFactor and minNeighbors.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Load default OpenCV Haar cascades
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    
    annotated = img.copy()
    eye_count = 0
    
    for (x, y, w, h) in faces:
        cv2.rectangle(annotated, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(annotated, "FACE DETECTED", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
        
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = annotated[y:y+h, x:x+w]
        
        eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.1, minNeighbors=3)
        for (ex, ey, ew, eh) in eyes:
            eye_count += 1
            cv2.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)
            
    return annotated, len(faces), eye_count

def main():
    print("=== Practical 5: Classroom Automated Attendance Face & Eye Detection ===")
    avatar = generate_synthetic_classroom_face()
    cv2.imwrite("student_face_input.jpg", avatar)
    
    result, num_faces, num_eyes = detect_faces_and_eyes(avatar)
    cv2.imwrite("attendance_face_result.jpg", result)
    
    print(f"Attendance verification: Detected {num_faces} faces and {num_eyes} eyes.")
    print("Saved result to 'attendance_face_result.jpg'.")

if __name__ == "__main__":
    main()
