"""
Machine Vision Post-Lab: Offline Signature Verification System
Verification Report Generator Module (HTML & PDF Certificate)
Author: Ayush Badwaik | CM23051
"""

import time

def generate_report_html(result_data, ref_name="Reference Template", test_name="Test Signature"):
    """Generates printable HTML Verification Certificate."""
    verdict = result_data["verdict"]
    score = result_data["composite_similarity"]
    is_genuine = result_data["is_genuine"]
    metrics = result_data["metrics"]
    visuals = result_data["visuals"]
    
    status_color = "#16a34a" if is_genuine else "#dc2626"
    status_bg = "#f0fdf4" if is_genuine else "#fef2f2"
    status_border = "#bbf7d0" if is_genuine else "#fecaca"
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Signature Verification Certificate | Machine Vision</title>
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 2rem; }}
        .cert-card {{ max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }}
        .header {{ text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 2rem; }}
        .header h1 {{ margin: 0; font-size: 1.5rem; color: #1e293b; letter-spacing: -0.02em; }}
        .header p {{ margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #64748b; }}
        .verdict-badge {{ text-align: center; padding: 1.25rem; background: {status_bg}; border: 1px solid {status_border}; border-radius: 8px; margin-bottom: 2rem; }}
        .verdict-title {{ font-size: 2rem; font-weight: 800; color: {status_color}; margin: 0; }}
        .verdict-subtitle {{ font-size: 1.1rem; font-weight: 700; color: #334155; margin-top: 0.5rem; }}
        .comparison-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }}
        .sig-box {{ background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 1rem; text-align: center; }}
        .sig-box h3 {{ margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #475569; text-transform: uppercase; }}
        .sig-box img {{ max-width: 100%; height: auto; border-radius: 4px; background: #ffffff; border: 1px solid #e2e8f0; }}
        .metrics-table {{ width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.85rem; }}
        .metrics-table th {{ background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; color: #475569; }}
        .metrics-table td {{ border: 1px solid #e2e8f0; padding: 0.75rem; color: #1e293b; }}
        .footer {{ border-top: 1px solid #e2e8f0; padding-top: 1rem; font-size: 0.75rem; color: #94a3b8; display: flex; justify-content: space-between; }}
    </style>
</head>
<body>
    <div class="cert-card">
        <div class="header">
            <h1>DEPARTMENT OF EMERGING TECHNOLOGIES (AI&ML)</h1>
            <p>S. B. Jain Institute of Technology, Management & Research, Nagpur</p>
            <p style="font-weight: 700; color: #2563eb; margin-top: 0.5rem;">OFFLINE HANDWRITTEN SIGNATURE AUTHENTICITY REPORT</p>
        </div>

        <div class="verdict-badge">
            <div class="verdict-title">{score}% SIMILARITY</div>
            <div class="verdict-subtitle">VERDICT: {verdict}</div>
        </div>

        <div class="comparison-grid">
            <div class="sig-box">
                <h3>Reference Template</h3>
                <img src="{visuals['ref_annotated']}" alt="Reference Signature" />
            </div>
            <div class="sig-box">
                <h3>Test Signature Sample</h3>
                <img src="{visuals['test_annotated']}" alt="Test Signature" />
            </div>
        </div>

        <h3 style="font-size: 1rem; color: #1e293b; margin-bottom: 0.75rem;">Feature Descriptors Breakdown</h3>
        <table class="metrics-table">
            <thead>
                <tr>
                    <th>Feature Extraction Method</th>
                    <th>Similarity Score (%)</th>
                    <th>Extracted Metrics</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Geometric Descriptors</strong></td>
                    <td>{metrics['geometric_similarity']}%</td>
                    <td>Aspect Ratio Ref: {metrics['ref_aspect_ratio']} vs Test: {metrics['test_aspect_ratio']}</td>
                </tr>
                <tr>
                    <td><strong>Horizontal & Vertical Projections</strong></td>
                    <td>{metrics['projection_similarity']}%</td>
                    <td>Row/Col Correlation Density Ref: {metrics['ref_density']} vs Test: {metrics['test_density']}</td>
                </tr>
                <tr>
                    <td><strong>Gradient Stroke Orientation</strong></td>
                    <td>{metrics['stroke_similarity']}%</td>
                    <td>8-Bin Sobel Gradient Histogram Intersection</td>
                </tr>
                <tr>
                    <td><strong>ORB Feature Matching</strong></td>
                    <td>{metrics['orb_similarity']}%</td>
                    <td>Good Keypoint Matches: {metrics['orb_good_matches']} points</td>
                </tr>
                <tr>
                    <td><strong>Structural SSIM</strong></td>
                    <td>{metrics['ssim_similarity']}%</td>
                    <td>Normalised Image Matrix SSIM Score</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <span>Author: Ayush Badwaik | CM23051</span>
            <span>Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}</span>
        </div>
    </div>
</body>
</html>"""
    return html
