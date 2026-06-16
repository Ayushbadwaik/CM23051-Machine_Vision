"""
Machine Vision Pre-Lab
Author: Ayush Badwaik | CM23051
Topics: Image Loading, Display, Video Capture, Image Properties, Color Channels, Webcam Access
"""

import cv2
import numpy as np
import base64
import json
import threading
import time
from flask import Flask, render_template, Response, jsonify, request
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# ─── Global webcam state ───────────────────────────────────────────────────────
camera = None
camera_lock = threading.Lock()
camera_active = False


# ─── Helper: numpy → base64 PNG ───────────────────────────────────────────────
def mat_to_base64(img_bgr):
    success, buf = cv2.imencode(".png", img_bgr)
    if not success:
        return ""
    return "data:image/png;base64," + base64.b64encode(buf).decode()


# ─── Demo 1: Load & display a generated test image ────────────────────────────
def make_demo_image():
    """Create a colorful synthetic test image (no file needed)."""
    h, w = 300, 500
    img = np.zeros((h, w, 3), dtype=np.uint8)

    # Background gradient
    for x in range(w):
        img[:, x, 0] = int(x / w * 180)   # B
        img[:, x, 1] = 80                  # G
        img[:, x, 2] = int((1 - x / w) * 220)  # R

    # Colored circles
    cv2.circle(img, (130, 150), 90, (255, 100, 50), -1)
    cv2.circle(img, (250, 150), 90, (50, 200, 100), -1)
    cv2.circle(img, (370, 150), 90, (50, 100, 255), -1)

    # Text
    cv2.putText(img, "Machine Vision Pre-Lab", (60, 270),
                cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)
    cv2.putText(img, "Ayush Badwaik - CM23051", (95, 295),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 1)
    return img


DEMO_IMG = make_demo_image()


# ─── Demo 2: Image Properties ─────────────────────────────────────────────────
def get_image_properties(img):
    h, w = img.shape[:2]
    channels = img.shape[2] if len(img.shape) == 3 else 1
    dtype = str(img.dtype)
    size_kb = round(img.nbytes / 1024, 2)
    mean_b, mean_g, mean_r = [round(float(v), 2) for v in cv2.mean(img)[:3]]
    return {
        "height": h, "width": w, "channels": channels,
        "dtype": dtype, "size_kb": size_kb,
        "mean_r": mean_r, "mean_g": mean_g, "mean_b": mean_b,
        "total_pixels": h * w,
        "aspect_ratio": round(w / h, 3),
    }


# ─── Demo 3: Color Channels ───────────────────────────────────────────────────
def split_channels(img_bgr):
    b, g, r = cv2.split(img_bgr)
    zero = np.zeros_like(b)

    # Each channel visualised as a colour image
    r_vis = cv2.merge([zero, zero, r])
    g_vis = cv2.merge([zero, g, zero])
    b_vis = cv2.merge([b, zero, zero])

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    return {
        "original":  mat_to_base64(img_bgr),
        "red":       mat_to_base64(r_vis),
        "green":     mat_to_base64(g_vis),
        "blue":      mat_to_base64(b_vis),
        "grayscale": mat_to_base64(cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)),
        "hsv":       mat_to_base64(hsv),
    }


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/demo-image")
def demo_image():
    """Return the synthetic demo image and its properties."""
    channels = split_channels(DEMO_IMG)
    props = get_image_properties(DEMO_IMG)
    return jsonify({"channels": channels, "properties": props})


@app.route("/api/upload", methods=["POST"])
def upload_image():
    """Accept an uploaded image, analyse it, return channels + properties."""
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    data = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "Cannot decode image"}), 400
    # Resize large images for display
    max_dim = 600
    h, w = img.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)))
    channels = split_channels(img)
    props = get_image_properties(img)
    return jsonify({"channels": channels, "properties": props})


# ─── Webcam ───────────────────────────────────────────────────────────────────
def gen_frames():
    global camera, camera_active
    while camera_active:
        with camera_lock:
            if camera is None or not camera.isOpened():
                break
            ret, frame = camera.read()
        if not ret:
            break
        # Overlay label
        cv2.putText(frame, "Machine Vision | Ayush Badwaik CM23051",
                    (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)
        ts = time.strftime("%H:%M:%S")
        cv2.putText(frame, ts, (10, frame.shape[0] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 255, 200), 1)
        _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" +
               buf.tobytes() + b"\r\n")
        time.sleep(1 / 30)


@app.route("/api/webcam/start")
def webcam_start():
    global camera, camera_active
    with camera_lock:
        if camera is None or not camera.isOpened():
            camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            return jsonify({"error": "No webcam found"}), 503
        camera_active = True
    return jsonify({"status": "started"})


@app.route("/api/webcam/stop")
def webcam_stop():
    global camera, camera_active
    camera_active = False
    with camera_lock:
        if camera and camera.isOpened():
            camera.release()
        camera = None
    return jsonify({"status": "stopped"})


@app.route("/video_feed")
def video_feed():
    return Response(gen_frames(),
                    mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/api/webcam/snapshot")
def webcam_snapshot():
    global camera
    with camera_lock:
        if camera is None or not camera.isOpened():
            return jsonify({"error": "Webcam not active"}), 503
        ret, frame = camera.read()
    if not ret:
        return jsonify({"error": "Capture failed"}), 500
    channels = split_channels(frame)
    props = get_image_properties(frame)
    return jsonify({"channels": channels, "properties": props})


if __name__ == "__main__":
    print("=" * 60)
    print("  Machine Vision Pre-Lab  |  Ayush Badwaik  |  CM23051")
    print("  Server → http://localhost:5050")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5050, debug=False, threaded=True)
