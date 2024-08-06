from flask import Flask, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from readmrz import MrzDetector, MrzReader

app = Flask(__name__)
CORS(app)

detector = MrzDetector()
reader = MrzReader()

def process_frame(frame):
    frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    result = reader.process(frame_bgr)
    return result

@app.route('/scan', methods=['POST'])
def scan_mrz():
    # Load image from local file
    image_path = '../scanner-front/images/cin.jpg'
    frame = cv2.imread(image_path)

    if frame is None:
        return jsonify({"error": "Failed to load image"}), 400

    try:
        result = process_frame(frame)
        if result:
            return jsonify(result)
        else:
            return jsonify({"error": "No MRZ code detected"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
