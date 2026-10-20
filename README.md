# CodeAlpha Object Detection and Tracking

A real-time object detection and tracking application developed using **Python, OpenCV, and Ultralytics YOLO11**. The system uses a webcam to detect objects, display bounding boxes, track objects across video frames, and show live performance statistics.

## Features

- Real-time object detection using a webcam
- Pretrained YOLO11n model
- Bounding boxes and object labels
- Object tracking with tracking IDs when available
- Live FPS (Frames Per Second) counter
- Current-frame object detection count
- Automatic model weight download when required
- Simple and easy-to-use interface

## Technologies Used

- **Programming Language:** Python
- **Object Detection:** Ultralytics YOLO11n
- **Computer Vision:** OpenCV
- **Tracking:** YOLO tracking API with persistent tracking across frames
- **Version Control:** Git and GitHub

## Project Structure

```text
CodeAlpha_ObjectDetection/
├── main.py
├── requirements.txt
├── README.md
└── .gitignore
```

## Installation and Setup

### Prerequisites

- Python installed on your system
- Webcam or compatible camera
- Internet connection for downloading model weights if needed

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CodeAlpha_ObjectDetection.git
cd CodeAlpha_ObjectDetection
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Create a Virtual Environment

```powershell
python -m venv .venv
```

### 3. Activate the Virtual Environment

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 5. Run the Application

```powershell
python main.py
```

On the first run, the pretrained `yolo11n.pt` model may be downloaded automatically if it is not already available.

Allow webcam access if requested. Press **`q`** to stop the application and close the detection window.

## How It Works

1. OpenCV captures live video frames from the webcam.
2. YOLO11n processes each frame and detects supported object classes.
3. The tracking API associates detections across consecutive frames.
4. Bounding boxes and object labels are drawn on the video.
5. Tracking IDs are displayed when available.
6. The application calculates and displays FPS and the number of detections in the current frame.

## Understanding the Results

- **Object Label:** The predicted class of a detected object.
- **Bounding Box:** A rectangle indicating the detected object's location.
- **Tracking ID:** An identifier assigned to a tracked detection when available.
- **FPS:** The approximate number of processed frames per second.
- **Objects Detected:** The number of detections in the current frame, not the total number of unique objects tracked.

## Limitations

- The pretrained model recognizes only the object classes it was trained to detect.
- The standard COCO model does not include `pen` as a separate class, so a pen may be misclassified.
- Detection accuracy depends on lighting, image quality, object size, and camera conditions.
- Custom objects may require a labeled dataset and a separately trained model.
- Processing speed depends on the available hardware.

## Future Enhancements

- Add a graphical dashboard with start and stop controls.
- Support video file input in addition to a webcam.
- Save detection results and recorded videos.
- Display object-specific statistics.
- Train a custom model for additional object classes.

## Internship Project

Developed as part of the **CodeAlpha Artificial Intelligence Internship**.

## 👨‍💻 Author

**Suresh Chavan**

GitHub: [@sureshchavn](https://github.com/sureshchavn)

LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/in/suresh-chavan/)
---

*This project is intended for educational and demonstration purposes.*