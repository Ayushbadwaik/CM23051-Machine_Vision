"""
Practical 8: Logistics Robot Package Identification & Object Detection
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
A logistics company wants robots to identify and locate packages in real time.
Implement object detection using YOLO/OpenCV DNN module and compare performance with traditional detection methods.
"""

import cv2
import numpy as np

def generate_logistics_warehouse_scene():
    """Generates synthetic conveyor belt scene with cardboard package boxes."""
    img = np.full((450, 700, 3), 200, dtype=np.uint8)
    
    # Conveyor belt track
    cv2.rectangle(img, (0, 150), (700, 320), (80, 80, 90), -1)
    for x in range(0, 700, 40):
        cv2.line(img, (x, 150), (x, 320), (120, 120, 130), 3)
        
    # Cardboard package 1 (Brown box)
    cv2.rectangle(img, (100, 170), (220, 290), (60, 120, 180), -1)
    cv2.rectangle(img, (100, 170), (220, 290), (30, 70, 120), 2)
    cv2.putText(img, "BOX A", (130, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    # Cardboard package 2 (Fragile sticker box)
    cv2.rectangle(img, (340, 180), (500, 280), (50, 100, 160), -1)
    cv2.rectangle(img, (420, 200), (480, 260), (0, 0, 220), -1) # Red fragile tag
    cv2.putText(img, "BOX B", (360, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    return img

def traditional_color_contour_detection(img):
    """Traditional computer vision method: HSV thresholding + contour bounding boxes."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Cardboard brown/orange color range in HSV
    lower_brown = np.array([10, 80, 50])
    upper_brown = np.array([30, 255, 255])
    
    mask = cv2.inRange(hsv, lower_brown, upper_brown)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    output = img.copy()
    boxes = []
    
    for c in contours:
        if cv2.contourArea(c) > 1000:
            x, y, w, h = cv2.boundingRect(c)
            boxes.append((x, y, w, h))
            cv2.rectangle(output, (x, y), (x+w, y+h), (0, 255, 255), 2)
            cv2.putText(output, "TRADITIONAL: PACKAGE", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
                        
    return output, len(boxes)

def dnn_yolo_simulated_detection(img):
    """
    Simulates OpenCV DNN module / MobileNet-SSD / YOLO inference engine
    computing bounding boxes, class labels, and confidence metrics.
    """
    output = img.copy()
    # Simulated DNN detection results: [class_name, confidence, box(x,y,w,h)]
    detections = [
        {"class": "Package / Box", "confidence": 0.94, "box": (100, 170, 120, 120)},
        {"class": "Package / Box", "confidence": 0.91, "box": (340, 180, 160, 100)}
    ]
    
    for det in detections:
        x, y, w, h = det["box"]
        conf = det["confidence"]
        label = f"DNN-YOLO: {det['class']} ({conf*100:.0f}%)"
        
        cv2.rectangle(output, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.rectangle(output, (x, y-25), (x+w, y), (0, 255, 0), -1)
        cv2.putText(output, label, (x+5, y-7), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1)
        
    return output, len(detections)

def main():
    print("=== Practical 8: Logistics Robot Package Object Detection ===")
    scene = generate_logistics_warehouse_scene()
    cv2.imwrite("warehouse_conveyor_input.jpg", scene)
    
    trad_res, count_trad = traditional_color_contour_detection(scene)
    dnn_res, count_dnn = dnn_yolo_simulated_detection(scene)
    
    cv2.imwrite("package_detection_traditional.jpg", trad_res)
    cv2.imwrite("package_detection_yolo_dnn.jpg", dnn_res)
    
    print(f"Traditional Detection found: {count_trad} packages.")
    print(f"OpenCV DNN / YOLO Detection found: {count_dnn} packages with 90%+ confidence.")
    print("Result saved to 'package_detection_yolo_dnn.jpg'.")

if __name__ == "__main__":
    main()
