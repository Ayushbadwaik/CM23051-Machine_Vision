# Practical 2: Manufacturing Product Dimension Measurement

## Problem Statement
A manufacturing company needs to measure product dimensions from captured images. Perform image transformations, scaling, rotation, affine transformation, and pixel-based measurements to estimate object dimensions.

## Algorithms & Techniques Used
- **Perspective / Affine Scaling**: Calibrates pixel counts to physical millimeters using a known reference metric.
- **Minimum Area Bounding Box**: Uses OpenCV `minAreaRect` to calculate oriented length and width irrespective of rotation angle.
- **Contour Extraction**: Isolates manufactured workpieces from image background.

## Usage
```bash
pip install -r requirements.txt
python main.py
```
