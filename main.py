
from pyexpat import model

import cv2 # type: ignore
import time
from ultralytics import YOLO # type: ignore


def main():
    # Load pretrained YOLO model
    model = YOLO("yolo11n.pt")
    print("Supported object classes:")
    print(model.names)

    # Open webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Webcam could not be opened.")
        return

    prev_time = time.perf_counter()
    fps = 0.0

    print("CodeAlpha Object Detection and Tracking started.")
    print("Press 'q' to quit.")

    try:
        while True:
            success, frame = cap.read()

            if not success:
                print("Error: Unable to read webcam frame.")
                break

            # Detect and track objects
            results = model.track(
                frame,
                persist=True,
                conf=0.50,
                verbose=False
            )

            # Draw boxes, labels and tracking IDs
            output = results[0].plot()

            # Calculate FPS
            current_time = time.perf_counter()
            elapsed = current_time - prev_time

            if elapsed > 0:
                instant_fps = 1.0 / elapsed
                fps = instant_fps if fps == 0 else 0.8 * fps + 0.2 * instant_fps

            prev_time = current_time

            # Count detected objects in current frame
            boxes = results[0].boxes
            object_count = len(boxes) if boxes is not None else 0

            # Display information panel
            cv2.rectangle(output, (10, 10), (310, 100), (25, 25, 25), -1)

            cv2.putText(
                output, f"FPS: {fps:.1f}",
                (22, 40), cv2.FONT_HERSHEY_SIMPLEX,
                0.7, (0, 255, 0), 2
            )

            cv2.putText(
                output, f"Objects detected: {object_count}",
                (22, 75), cv2.FONT_HERSHEY_SIMPLEX,
                0.6, (255, 255, 255), 2
            )

            # Show live output
            cv2.imshow("CodeAlpha - Object Detection & Tracking", output)

            # Press q to exit
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("Detection stopped.")


if __name__ == "__main__":
    main()
