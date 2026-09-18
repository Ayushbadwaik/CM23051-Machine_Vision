"""
Machine Vision Post-Lab: Offline Handwritten Signature Verification System
Flask Web Application Server
Author: Ayush Badwaik | CM23051
"""

import cv2
import numpy as np
import base64
from flask import Flask, render_template, jsonify, request, Response
from signature_verifier import compare_signatures, mat_to_base64
from report_generator import generate_report_html
from main import generate_synthetic_signature

app = Flask(__name__)

# Pre-generate benchmark signature templates
REF_SIG = generate_synthetic_signature("Ayush Badwaik", "genuine")
TEST_GENUINE_SIG = generate_synthetic_signature("Ayush Badwaik", "genuine_variant")
TEST_FORGED_SIG = generate_synthetic_signature("Ayush Badwaik", "forged")

# Cached last verification result
LAST_RESULT = None

def base64_to_mat(base64_str):
    """Converts base64 data URL to OpenCV BGR image matrix."""
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]
    img_bytes = base64.b64decode(base64_str)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/preset-ref")
def preset_ref():
    _, buf = cv2.imencode(".png", REF_SIG)
    return Response(buf.tobytes(), mimetype="image/png")

@app.route("/api/preset-test-genuine")
def preset_test_genuine():
    _, buf = cv2.imencode(".png", TEST_GENUINE_SIG)
    return Response(buf.tobytes(), mimetype="image/png")

@app.route("/api/preset-test-forged")
def preset_test_forged():
    _, buf = cv2.imencode(".png", TEST_FORGED_SIG)
    return Response(buf.tobytes(), mimetype="image/png")

@app.route("/api/verify", methods=["POST"])
def verify_signatures_api():
    global LAST_RESULT
    data = request.get_json() or {}
    
    ref_b64 = data.get("ref_image", "")
    test_b64 = data.get("test_image", "")
    threshold = float(data.get("threshold", 75.0))
    
    # Load reference template
    if ref_b64:
        ref_mat = base64_to_mat(ref_b64)
    else:
        ref_mat = REF_SIG
        
    # Load test sample
    if test_b64:
        test_mat = base64_to_mat(test_b64)
    else:
        test_mat = TEST_GENUINE_SIG
        
    if ref_mat is None or test_mat is None:
        return jsonify({"error": "Failed to decode signature image."}), 400
        
    result = compare_signatures(ref_mat, test_mat, threshold=threshold)
    LAST_RESULT = result
    return jsonify(result)

@app.route("/api/report")
def get_report():
    global LAST_RESULT
    if LAST_RESULT is None:
        LAST_RESULT = compare_signatures(REF_SIG, TEST_GENUINE_SIG, threshold=75.0)
    html_report = generate_report_html(LAST_RESULT)
    return html_report

if __name__ == "__main__":
    print("=" * 60)
    print("  Machine Vision Post-Lab Signature Verification System")
    print("  Author: Ayush Badwaik | CM23051")
    print("  Server -> http://localhost:5051")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5051, debug=False, threaded=True)
