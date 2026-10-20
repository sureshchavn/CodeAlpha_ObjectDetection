
import threading
import time
from datetime import datetime

import cv2
from flask import Flask, Response, jsonify, render_template
from ultralytics import YOLO

app = Flask(__name__)

MODEL_PATH = "yolo11n.pt"
model = YOLO(MODEL_PATH)

camera = None
camera_lock = threading.Lock()
state_lock = threading.Lock()
camera_running = False

latest_stats = {
    "fps": 0.0,
    "object_count": 0,
    "objects": [],
    "status": "Camera stopped",
    "last_updated": "--",
}


def open_camera():
    """Open the default Windows webcam."""
    if hasattr(cv2, "CAP_DSHOW"):
        cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    else:
        cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        cap.release()
        return None

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 960)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 540)

    return cap


def generate_frames():
    global camera, latest_stats

    previous_time = time.perf_counter()
    smoothed_fps = 0.0

    while True:
        with state_lock:
            running = camera_running

        if not running:
            time.sleep(0.08)
            continue

        with camera_lock:
            cap = camera

            if cap is None or not cap.isOpened():
                time.sleep(0.1)
                continue

            success, frame = cap.read()

        if not success:
            time.sleep(0.03)
            continue

        try:
            results = model.track(
                frame,
                persist=True,
                conf=0.40,
                verbose=False
            )

            result = results[0]
            annotated = result.plot()
            objects = []

            current_time = time.perf_counter()
            delta = current_time - previous_time
            previous_time = current_time

            if delta > 0:
                instant_fps = 1.0 / delta

                if smoothed_fps == 0:
                    smoothed_fps = instant_fps
                else:
                    smoothed_fps = (
                        0.8 * smoothed_fps
                        + 0.2 * instant_fps
                    )

            boxes = result.boxes

            if boxes is not None:
                for box in boxes:
                    class_id = int(box.cls[0].item())
                    confidence = float(box.conf[0].item())

                    track_id = None

                    if box.id is not None:
                        track_id = int(box.id[0].item())

                    object_name = model.names.get(
                        class_id,
                        str(class_id)
                    )

                    objects.append({
                        "name": object_name,
                        "confidence": round(confidence * 100, 1),
                        "track_id": track_id
                    })

            cv2.rectangle(
                annotated,
                (16, 16),
                (265, 92),
                (25, 20, 35),
                -1
            )

            cv2.putText(
                annotated,
                f"FPS: {smoothed_fps:.1f}",
                (30, 47),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.75,
                (100, 255, 180),
                2,
                cv2.LINE_AA
            )

            cv2.putText(
                annotated,
                f"Objects: {len(objects)}",
                (30, 76),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (245, 245, 255),
                2,
                cv2.LINE_AA
            )

            with state_lock:
                latest_stats = {
                    "fps": round(smoothed_fps, 1),
                    "object_count": len(objects),
                    "objects": objects[:30],
                    "status": "Live detection",
                    "last_updated": datetime.now().strftime(
                        "%H:%M:%S"
                    )
                }

            success, encoded = cv2.imencode(
                ".jpg",
                annotated,
                [int(cv2.IMWRITE_JPEG_QUALITY), 82]
            )

            if success:
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n"
                    + encoded.tobytes()
                    + b"\r\n"
                )

        except Exception as error:
            with state_lock:
                latest_stats["status"] = (
                    f"Detection error: {str(error)[:100]}"
                )

            time.sleep(0.1)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )


@app.post("/api/start")
def start_camera():
    global camera, camera_running, latest_stats

    with state_lock:
        if camera_running:
            return jsonify({
                "ok": True,
                "message": "Camera is already running."
            })

    with camera_lock:
        if camera is None or not camera.isOpened():
            camera = open_camera()

        if camera is None or not camera.isOpened():
            return jsonify({
                "ok": False,
                "message": (
                    "Could not open webcam. Close other camera apps "
                    "and check Windows camera permissions."
                )
            }), 400

    with state_lock:
        camera_running = True
        latest_stats["status"] = "Live detection"

    return jsonify({
        "ok": True,
        "message": "Camera started."
    })


@app.post("/api/stop")
def stop_camera():
    global camera, camera_running, latest_stats

    with state_lock:
        camera_running = False
        latest_stats["status"] = "Camera stopped"
        latest_stats["fps"] = 0.0
        latest_stats["object_count"] = 0
        latest_stats["objects"] = []

    with camera_lock:
        if camera is not None:
            camera.release()
            camera = None

    return jsonify({
        "ok": True,
        "message": "Camera stopped."
    })


@app.get("/api/stats")
def stats():
    with state_lock:
        return jsonify({
            **latest_stats,
            "running": camera_running
        })


@app.get("/api/health")
def health():
    return jsonify({
        "ok": True,
        "model": MODEL_PATH,
        "classes": len(model.names)
    })


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        threaded=True
    )
