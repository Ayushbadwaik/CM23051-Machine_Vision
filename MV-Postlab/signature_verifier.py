"""
Machine Vision Post-Lab: Offline Handwritten Signature Verification System
Core Feature Extraction & Verification Module
Author: Ayush Badwaik | CM23051

Algorithms & Technical Pipeline:
1. Auto-Cropping & Normalization (Bounding box extraction, aspect-preserved resizing to 300x150)
2. Geometric Feature Extraction:
   - Aspect Ratio (Width / Height)
   - Signature Pixel Density (Foreground / Total Area)
   - Center of Gravity / Centroid Offsets (Cx, Cy)
3. Stroke & Projection Descriptors:
   - Horizontal Projection Profile (Row sums)
   - Vertical Projection Profile (Column sums)
   - Gradient Orientation Stroke Histograms (Sobel Gx, Gy)
4. Structural & Shape Similarity Descriptors:
   - Structural Similarity Index (SSIM)
   - ORB Feature Keypoint Matching (Hamming Distance)
5. Weighted Composite Similarity Score (%) & Authenticity Verdict
"""

import cv2
import numpy as np
import base64

def mat_to_base64(img):
    """Converts OpenCV numpy image matrix to Base64 PNG data URL."""
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    success, buf = cv2.imencode(".png", img)
    if not success:
        return ""
    return "data:image/png;base64," + base64.b64encode(buf).decode()

def crop_and_normalize(img_bgr, target_size=(300, 150)):
    """
    1. Grayscale & Gaussian Blur
    2. Otsu Automatic Thresholding
    3. Auto-Cropping Bounding Box of Signature Contour
    4. Resizing to standardized target dimensions (300x150)
    """
    if len(img_bgr.shape) == 3:
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = img_bgr.copy()
        
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Otsu thresholding (Signature pixels = 255, background = 0)
    _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Find bounding box of signature pixels
    coords = cv2.findNonZero(binary)
    if coords is None:
        # Blank image fallback
        normalized = cv2.resize(gray, target_size)
        binary_norm = cv2.resize(binary, target_size)
        return gray, binary, normalized, binary_norm, (0, 0, gray.shape[1], gray.shape[0])
        
    x, y, w, h = cv2.boundingRect(coords)
    # Crop bounding box with 5px padding
    pad = 5
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(gray.shape[1], x + w + pad)
    y2 = min(gray.shape[0], y + h + pad)
    
    cropped_gray = gray[y1:y2, x1:x2]
    cropped_binary = binary[y1:y2, x1:x2]
    
    # Resize to standardized target size
    normalized_gray = cv2.resize(cropped_gray, target_size, interpolation=cv2.INTER_AREA)
    normalized_binary = cv2.resize(cropped_binary, target_size, interpolation=cv2.INTER_NEAREST)
    
    return gray, binary, normalized_gray, normalized_binary, (x, y, w, h)

def extract_geometric_features(binary_img):
    """
    Extracts geometric descriptors:
    - Aspect Ratio: w / h
    - Pixel Density: foreground_pixels / total_pixels
    - Centroid Offsets (Cx, Cy) normalized by dimensions
    """
    h, w = binary_img.shape
    total_pixels = h * w
    fg_pixels = np.count_nonzero(binary_img)
    density = fg_pixels / total_pixels if total_pixels > 0 else 0
    
    # Moments calculation
    M = cv2.moments(binary_img)
    if M["m00"] != 0:
        cx = (M["m10"] / M["m00"]) / w
        cy = (M["m01"] / M["m00"]) / h
    else:
        cx, cy = 0.5, 0.5
        
    coords = cv2.findNonZero(binary_img)
    if coords is not None:
        bx, by, bw, bh = cv2.boundingRect(coords)
        aspect_ratio = bw / float(bh) if bh > 0 else 1.0
    else:
        aspect_ratio = 1.0
        
    return {
        "density": float(density),
        "cx": float(cx),
        "cy": float(cy),
        "aspect_ratio": float(aspect_ratio),
        "fg_pixels": int(fg_pixels)
    }

def extract_projection_profiles(binary_img):
    """Computes normalized horizontal (row) and vertical (col) projection profiles."""
    h_proj = np.sum(binary_img > 0, axis=1, dtype=np.float32)
    v_proj = np.sum(binary_img > 0, axis=0, dtype=np.float32)
    
    # Normalize by max
    h_proj = h_proj / np.max(h_proj) if np.max(h_proj) > 0 else h_proj
    v_proj = v_proj / np.max(v_proj) if np.max(v_proj) > 0 else v_proj
    
    return h_proj, v_proj

def extract_gradient_stroke_histogram(gray_img):
    """Computes Sobel gradient orientation stroke histogram (8 orientation bins)."""
    gx = cv2.Sobel(gray_img, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(gray_img, cv2.CV_32F, 0, 1, ksize=3)
    mag, angle = cv2.cartToPolar(gx, gy, angleInDegrees=True)
    
    hist, _ = np.histogram(angle, bins=8, range=(0, 360), weights=mag)
    hist_norm = hist / np.sum(hist) if np.sum(hist) > 0 else hist
    return hist_norm

def compute_orb_similarity(norm1, norm2):
    """Computes ORB feature keypoint descriptor match similarity (0.0 to 1.0)."""
    orb = cv2.ORB_create(nfeatures=500)
    kp1, des1 = orb.detectAndCompute(norm1, None)
    kp2, des2 = orb.detectAndCompute(norm2, None)
    
    if des1 is None or des2 is None or len(des1) < 2 or len(des2) < 2:
        return 0.5, 0
        
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    if not matches:
        return 0.0, 0
        
    matches = sorted(matches, key=lambda x: x.distance)
    good_matches = [m for m in matches if m.distance < 60]
    
    similarity = min(1.0, len(good_matches) / float(max(len(kp1), len(kp2))))
    return float(similarity), len(good_matches)

def compute_structural_similarity(norm1, norm2):
    """Computes mean structural similarity score based on normalized pixel difference."""
    diff = np.abs(norm1.astype(np.float32) - norm2.astype(np.float32))
    ssim_score = 1.0 - (np.mean(diff) / 255.0)
    return float(ssim_score)

def compare_signatures(ref_img, test_img, threshold=80.0):
    """
    Full Verification Pipeline comparing Reference Signature vs Test Signature:
    - Normalization & Bounding Cropping
    - Feature Extractions
    - Individual Similarity Metric Computations:
      1. Geometric Similarity (Aspect ratio + Centroid + Density distance)
      2. Projection Profile Correlation (Horizontal & Vertical)
      3. Stroke Gradient Orientation Histogram Similarity
      4. ORB Keypoint Feature Matching
      5. Structural SSIM Pixel Similarity
    - Weighted Composite Similarity Score Calculation (%)
    """
    # 1. Normalization
    ref_gray, ref_bin, ref_norm_g, ref_norm_b, ref_box = crop_and_normalize(ref_img)
    test_gray, test_bin, test_norm_g, test_norm_b, test_box = crop_and_normalize(test_img)
    
    # 2. Geometric Features
    ref_geo = extract_geometric_features(ref_norm_b)
    test_geo = extract_geometric_features(test_norm_b)
    
    # Geometric Similarity
    aspect_diff = abs(ref_geo["aspect_ratio"] - test_geo["aspect_ratio"])
    density_diff = abs(ref_geo["density"] - test_geo["density"])
    centroid_dist = np.sqrt((ref_geo["cx"] - test_geo["cx"])**2 + (ref_geo["cy"] - test_geo["cy"])**2)
    
    geo_sim = max(0.0, 1.0 - (0.4 * aspect_diff + 0.4 * density_diff + 0.5 * centroid_dist))
    
    # 3. Projection Profile Similarity
    ref_hp, ref_vp = extract_projection_profiles(ref_norm_b)
    test_hp, test_vp = extract_projection_profiles(test_norm_b)
    
    hp_corr = np.corrcoef(ref_hp, test_hp)[0, 1]
    vp_corr = np.corrcoef(ref_vp, test_vp)[0, 1]
    proj_sim = max(0.0, (np.nan_to_num(hp_corr, nan=0.5) + np.nan_to_num(vp_corr, nan=0.5)) / 2.0)
    
    # 4. Stroke Orientation Histogram Similarity
    ref_stroke = extract_gradient_stroke_histogram(ref_norm_g)
    test_stroke = extract_gradient_stroke_histogram(test_norm_g)
    stroke_sim = np.sum(np.minimum(ref_stroke, test_stroke)) # Histogram Intersection
    
    # 5. ORB & Structural Similarity
    orb_sim, match_count = compute_orb_similarity(ref_norm_g, test_norm_g)
    ssim_score = compute_structural_similarity(ref_norm_b, test_norm_b)
    
    # 6. Weighted Composite Score
    # Weights: Geometric (20%), Projections (20%), Stroke Hist (20%), ORB Keypoints (20%), SSIM (20%)
    composite_score = (
        0.20 * geo_sim +
        0.20 * proj_sim +
        0.20 * stroke_sim +
        0.20 * orb_sim +
        0.20 * ssim_score
    ) * 100.0
    
    composite_score = round(min(100.0, max(0.0, composite_score)), 2)
    is_genuine = bool(composite_score >= threshold)
    
    # Draw Verification Visual Overlay
    ref_vis = cv2.cvtColor(ref_gray, cv2.COLOR_GRAY2BGR)
    test_vis = cv2.cvtColor(test_gray, cv2.COLOR_GRAY2BGR)
    
    # Draw bounding boxes
    rx, ry, rw, rh = ref_box
    cv2.rectangle(ref_vis, (rx, ry), (rx+rw, ry+rh), (0, 255, 0), 2)
    cv2.putText(ref_vis, "REF TEMPLATE", (rx, max(15, ry-5)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    
    tx, ty, tw, th = test_box
    box_color = (0, 200, 0) if is_genuine else (0, 0, 220)
    cv2.rectangle(test_vis, (tx, ty), (tx+tw, ty+th), box_color, 2)
    status_label = "GENUINE SIGNATURE" if is_genuine else "FORGED / SUSPECTED"
    cv2.putText(test_vis, status_label, (tx, max(15, ty-5)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, box_color, 2)
    
    return {
        "composite_similarity": composite_score,
        "is_genuine": is_genuine,
        "verdict": "GENUINE" if is_genuine else "FORGED / SUSPECTED",
        "threshold_used": threshold,
        "metrics": {
            "geometric_similarity": round(geo_sim * 100, 2),
            "projection_similarity": round(proj_sim * 100, 2),
            "stroke_similarity": round(stroke_sim * 100, 2),
            "orb_similarity": round(orb_sim * 100, 2),
            "ssim_similarity": round(ssim_score * 100, 2),
            "orb_good_matches": match_count,
            "ref_aspect_ratio": round(ref_geo["aspect_ratio"], 2),
            "test_aspect_ratio": round(test_geo["aspect_ratio"], 2),
            "ref_density": round(ref_geo["density"], 4),
            "test_density": round(test_geo["density"], 4)
        },
        "visuals": {
            "ref_annotated": mat_to_base64(ref_vis),
            "test_annotated": mat_to_base64(test_vis),
            "ref_normalized": mat_to_base64(ref_norm_g),
            "test_normalized": mat_to_base64(test_norm_g),
            "ref_binary": mat_to_base64(ref_norm_b),
            "test_binary": mat_to_base64(test_norm_b)
        }
    }
