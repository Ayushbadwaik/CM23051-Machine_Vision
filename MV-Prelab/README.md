# Machine Vision Pre-Lab
### Ayush Badwaik | CM23051

---

## 📌 Overview
An interactive web-based demonstration of core Machine Vision concepts using **Python**, **OpenCV**, **Flask**, and **NumPy**.

## 🧪 Demonstrations Covered

| # | Topic | OpenCV API |
|---|-------|-----------|
| 1 | **Image Loading** | `cv2.imread()`, `cv2.imdecode()` |
| 2 | **Image Display** | `cv2.imshow()`, base64 encoding |
| 3 | **Video Capture** | `cv2.VideoCapture()`, `cap.read()` |
| 4 | **Image Properties** | `.shape`, `.dtype`, `.nbytes` |
| 5 | **Color Channels** | `cv2.split()`, `cv2.merge()` |
| 6 | **Webcam Access** | `VideoCapture(0)`, streaming via Flask |

## 🚀 Running the Server

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py

# Open in browser
http://localhost:5050
```

## 📁 Project Structure
```
machine_vision_prelab/
├── app.py              # Flask server + OpenCV logic
├── requirements.txt    # Python dependencies
├── README.md
└── templates/
    └── index.html      # UI with all demos
```

## 🔑 Key Concepts

### Image Loading
```python
img = cv2.imread("image.jpg")   # returns NumPy array (H, W, 3) BGR
```

### Image Properties
```python
h, w, c = img.shape             # height, width, channels
dtype    = img.dtype            # uint8
nbytes   = img.nbytes           # memory footprint
```

### Color Channel Splitting
```python
b, g, r = cv2.split(img)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
```

### Webcam Access
```python
cap = cv2.VideoCapture(0)       # 0 = default webcam
ret, frame = cap.read()
cap.release()
```

---
*Machine Vision Pre-Lab · Ayush Badwaik · CM23051*
