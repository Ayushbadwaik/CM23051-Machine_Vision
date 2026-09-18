# Practical 9: Government Scanned Document OCR

## Problem Statement
A government office wants to convert scanned documents into editable text. Develop a document vision application using image preprocessing and OCR (Tesseract/OpenCV) for text extraction and validation.

## Processing Steps
- **Deskewing Transformation**: Re-aligns rotated scans using `minAreaRect` bounding orientation.
- **Adaptive Gaussian Binarization**: Removes shadow degradation and paper wrinkles.
- **OCR Text Extraction**: Converts pixel text into validated string format.

## Usage
```bash
pip install -r requirements.txt
python main.py
```
