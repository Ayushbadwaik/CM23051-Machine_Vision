# Practical 1: Low-Quality CCTV Image Enhancement

## Problem Statement
A security agency receives low-quality CCTV images during nighttime surveillance. Develop a system to improve visibility using histogram equalization, filtering, brightness enhancement, and noise removal techniques.

## Algorithms & Techniques Used
- **Luminance Channel Extraction**: Converts RGB/BGR into LAB color space.
- **CLAHE (Contrast Limited Adaptive Histogram Equalization)**: Enhances local contrast without amplifying noise.
- **Fast Non-Local Means Denoising**: Removes sensor noise & low-light artifacts.
- **Unsharp Masking / Sharpening**: Restores crisp outline edges for subject identification.

## Usage
```bash
pip install -r requirements.txt
python main.py
```
