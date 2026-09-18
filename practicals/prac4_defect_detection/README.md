# Practical 4: Factory Metal Defect Inspection

## Problem Statement
A factory wants to detect scratches and cracks on metal surfaces. Use edge detection, image segmentation, thresholding, contour extraction, and morphological operations to identify defects.

## Processing Pipeline
- **Otsu Automatic Binarization**: Isolates dark scratch pixels from reflective metal surface.
- **Morphological Closing**: Joins fragmented crack contours.
- **Perimeter & Aspect Filter**: Filters noise from real hairline defects.

## Usage
```bash
pip install -r requirements.txt
python main.py
```
