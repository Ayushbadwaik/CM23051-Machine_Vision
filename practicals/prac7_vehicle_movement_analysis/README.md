# Practical 7: Smart City Intersection Vehicle Trajectory Tracking

## Problem Statement
A smart city project requires vehicle movement analysis at intersections. Use video streams for motion detection, optical flow, background subtraction, and object tracking to monitor vehicle trajectories.

## Algorithms Applied
- **Frame Differencing & MOG2 Background Subtraction**: Identifies transient motion pixels.
- **Farneback Dense Optical Flow**: Computes per-pixel motion velocity vectors.
- **Trajectory Bounding Box Tracking**: Monitors intersection flow path and vehicle directional vectors.

## Usage
```bash
pip install -r requirements.txt
python main.py
```
