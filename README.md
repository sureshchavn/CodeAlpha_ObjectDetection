# 🚀 Real-Time Object Detection and Tracking System

A real-time computer vision application built using **Python, Flask, YOLO11, and OpenCV**. The system detects objects from a live webcam feed, displays bounding boxes and class labels, and tracks detected objects with tracking IDs.

## 📌 Project Overview

This project was developed as part of the **CodeAlpha Artificial Intelligence Internship – Task 4: Object Detection and Tracking**.

The application combines a deep learning object detection model with a web-based dashboard to provide a user-friendly interface for real-time object detection and tracking.

## ✨ Features

- 🎯 **Real-Time Object Detection** — Detect objects from a live webcam feed using YOLO11.
- 📦 **Bounding Boxes** — Display detected objects with bounding boxes and class labels.
- 🔍 **Object Tracking** — Track detected objects using tracking IDs.
- 📊 **Detection Statistics** — Display object counts and detection information supported by the application.
- 🎥 **Live Camera Feed** — Start and stop camera processing through the dashboard.
- 💯 **Confidence Scores** — Display model confidence scores for detected objects.
- 🌙 **Dark/Light Mode** — Switch between dashboard themes.
- 🖥️ **Web-Based Dashboard** — Access the application through a local web browser.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Flask | Web application backend |
| YOLO11 | Object detection model |
| OpenCV | Webcam access and image processing |
| HTML5 | Web page structure |
| CSS3 | Dashboard styling and responsive layout |
| JavaScript | Dashboard interactions and live updates |

## 📂 Project Structure

```text
CodeAlpha_ObjectDetection/
│
├── app.py
├── main.py
├── requirements.txt
├── README.md
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
└── .venv/
```

**Note:** The `.venv` directory is your local virtual environment and should not be uploaded to GitHub.

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CodeAlpha_ObjectDetection
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Create a Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate the Virtual Environment

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install Dependencies

```bash
python -m pip install -r requirements.txt
```

### 5. Run the Application

```bash
python app.py
```

### 6. Open the Dashboard

Open your browser and visit:

```text
http://127.0.0.1:5000
```

The YOLO11 model weights may be downloaded automatically by Ultralytics when the application first loads the model, if they are not already available locally.

## 🚦 How to Use

1. Start the Flask application.
2. Open the dashboard in your browser.
3. Click **Start Camera** to begin live detection.
4. Allow camera access if prompted.
5. Show objects to the webcam.
6. Observe the detected objects, bounding boxes, class labels, confidence scores, and tracking IDs.
7. Click **Stop Camera** to stop processing.
8. Use the theme toggle to switch between dark and light modes.

## 🧠 How It Works

1. **Video Capture:** OpenCV captures frames from the webcam.
2. **Object Detection:** The YOLO11 model processes the frames and identifies supported object classes.
3. **Object Tracking:** The tracking pipeline associates detections across consecutive frames.
4. **Visualization:** Detection results are drawn on the frames.
5. **Web Streaming:** Flask streams the processed frames to the browser.
6. **Dashboard Updates:** JavaScript updates the detection information displayed in the interface.

## 🎯 Applications

- Real-time surveillance and monitoring
- Smart traffic monitoring
- Retail analytics
- Computer vision demonstrations
- Object tracking research and learning

## ⚠️ Limitations

- Detection performance depends on lighting, camera quality, and object visibility.
- The default pretrained model recognizes only the object classes it was trained to detect.
- Objects outside the model's supported classes may not be recognized.
- Processing speed depends on the hardware and model configuration.
- This project is intended for educational and demonstration purposes.

## 🔮 Future Enhancements

- Image and video file upload support
- Detection history and report generation
- Object tracking analytics
- Improved performance through GPU acceleration
- Custom-trained object detection models
- Exportable detection statistics

## 👨‍💻 Author

**Suresh Chavan**

GitHub: [@sureshchavn](https://github.com/sureshchavn)

LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/in/suresh-chavan/)

## 🏢 Internship

Developed as part of the **CodeAlpha Artificial Intelligence Internship**.

## 📄 License

This project is intended for educational and learning purposes. Review the applicable licenses of the model weights and third-party dependencies before redistributing them.
