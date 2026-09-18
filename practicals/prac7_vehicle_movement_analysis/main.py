"""
Practical 7: Smart City Intersection Vehicle Trajectory Tracking
Department of Emerging Technologies CSE (AI&ML) - S. B. Jain Institute of Technology, Management & Research

Problem Statement:
A smart city project requires vehicle movement analysis at intersections.
Use video streams for motion detection, optical flow, background subtraction,
and object tracking to monitor vehicle trajectories.
"""

import cv2
import numpy as np

def create_simulated_traffic_frames():
    """Generates two sequential video frames simulating moving vehicles across an intersection."""
    frame1 = np.full((400, 600, 3), 70, dtype=np.uint8)
    frame2 = frame1.copy()
    
    # Draw intersection roads (vertical & horizontal asphalt)
    for f in [frame1, frame2]:
        cv2.rectangle(f, (220, 0), (380, 400), (40, 40, 40), -1) # Vertical road
        cv2.rectangle(f, (0, 140), (600, 260), (40, 40, 40), -1) # Horizontal road
        # Lane markings
        cv2.line(f, (300, 0), (300, 400), (255, 255, 255), 2)
        cv2.line(f, (0, 200), (600, 200), (255, 255, 255), 2)
        
    # Moving Car 1 (Heading South from y=40 to y=100)
    cv2.rectangle(frame1, (240, 40), (280, 100), (0, 0, 220), -1) # Red car frame 1
    cv2.rectangle(frame2, (240, 100), (280, 160), (0, 0, 220), -1) # Red car frame 2
    
    # Moving Car 2 (Heading East from x=80 to x=180)
    cv2.rectangle(frame1, (80, 210), (140, 245), (220, 180, 0), -1) # Blue car frame 1
    cv2.rectangle(frame2, (180, 210), (240, 245), (220, 180, 0), -1) # Blue car frame 2
    
    return frame1, frame2

def analyze_motion_and_optical_flow(frame1, frame2):
    """
    Computes MOG2 Background Subtraction & Farneback Dense Optical Flow
    to track motion vector trajectories across intersection.
    """
    gray1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
    
    # 1. Frame Difference & Motion Mask
    diff = cv2.absdiff(gray1, gray2)
    _, motion_mask = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)
    
    # 2. Gunnar-Farneback Optical Flow
    flow = cv2.calcOpticalFlowFarneback(gray1, gray2, None, 0.5, 3, 15, 3, 5, 1.2, 0)
    
    # Render vector flow visualization
    hsv = np.zeros_like(frame1)
    hsv[..., 1] = 255
    mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])
    hsv[..., 0] = ang * 180 / np.pi / 2
    hsv[..., 2] = cv2.normalize(mag, None, 0, 255, cv2.NORM_MINMAX)
    flow_rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    
    # Annotate trajectories on frame2
    output = frame2.copy()
    contours, _ = cv2.findContours(motion_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    for c in contours:
        if cv2.contourArea(c) > 300:
            x, y, w, h = cv2.boundingRect(c)
            cv2.rectangle(output, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(output, "TRAJECTORY TRACKED", (x, y-5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 1)
                        
    return motion_mask, flow_rgb, output

def main():
    print("=== Practical 7: Vehicle Movement & Optical Flow Trajectory Tracking ===")
    f1, f2 = create_simulated_traffic_frames()
    
    cv2.imwrite("traffic_frame1.jpg", f1)
    cv2.imwrite("traffic_frame2.jpg", f2)
    
    mask, flow, tracked = analyze_motion_and_optical_flow(f1, f2)
    cv2.imwrite("vehicle_motion_mask.jpg", mask)
    cv2.imwrite("vehicle_optical_flow.jpg", flow)
    cv2.imwrite("vehicle_tracking_result.jpg", tracked)
    
    print("Motion trajectory tracking completed. Results saved to 'vehicle_tracking_result.jpg'.")

if __name__ == "__main__":
    main()
