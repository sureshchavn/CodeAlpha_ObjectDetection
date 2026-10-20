
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");

const videoFeed = document.getElementById("video-feed");
const cameraPlaceholder = document.getElementById("camera-placeholder");
const feedOverlay = document.getElementById("feed-overlay");

const fpsValue = document.getElementById("fps-value");
const objectCount = document.getElementById("object-count");
const trackingCount = document.getElementById("tracking-count");
const modelStatus = document.getElementById("model-status");

const cameraStatus = document.getElementById("camera-status");
const sidebarStatus = document.getElementById("sidebar-status");
const lastUpdated = document.getElementById("last-updated");

const liveBadge = document.getElementById("live-badge");
const controlDot = document.getElementById("control-dot");

const objectList = document.getElementById("object-list");
const objectListCount = document.getElementById("object-list-count");
const objectFooterText = document.getElementById("object-footer-text");

const messageBox = document.getElementById("message-box");
const themeToggle = document.getElementById("theme-toggle");

let cameraIsRunning = false;
let statsTimer = null;
let lastObjectSignature = "";

function showMessage(message) {
    messageBox.textContent = message;
    messageBox.hidden = false;
}

function clearMessage() {
    messageBox.textContent = "";
    messageBox.hidden = true;
}

function setCameraState(running) {
    cameraIsRunning = running;

    startButton.disabled = running;
    stopButton.disabled = !running;

    cameraStatus.textContent = running
        ? "Camera running"
        : "Camera stopped";

    sidebarStatus.textContent = running
        ? "Detection active"
        : "Waiting for camera";

    controlDot.classList.toggle("is-live", running);
    liveBadge.classList.toggle("is-live", running);

    liveBadge.innerHTML = running
        ? "<span></span> LIVE"
        : "<span></span> STANDBY";

    if (running) {
        cameraPlaceholder.hidden = true;
        videoFeed.hidden = false;
        feedOverlay.hidden = false;
    } else {
        videoFeed.removeAttribute("src");
        videoFeed.hidden = true;
        feedOverlay.hidden = true;
        cameraPlaceholder.hidden = false;

        fpsValue.textContent = "0.0";
        objectCount.textContent = "0";
        trackingCount.textContent = "0";
        lastUpdated.textContent = "Last update: --";

        renderObjects([]);
    }
}

async function startCamera() {
    clearMessage();
    startButton.disabled = true;
    cameraStatus.textContent = "Connecting to camera...";

    try {
        const response = await fetch("/api/start", {
            method: "POST"
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.message || "Unable to start camera.");
        }

        setCameraState(true);

        videoFeed.src = `/video_feed?t=${Date.now()}`;

        startStatsPolling();
    } catch (error) {
        setCameraState(false);
        showMessage(error.message || "An unexpected error occurred.");
    } finally {
        startButton.disabled = cameraIsRunning;
    }
}

async function stopCamera() {
    clearMessage();
    stopButton.disabled = true;

    try {
        await fetch("/api/stop", {
            method: "POST"
        });
    } catch (error) {
        console.error("Camera stop request failed:", error);
    }

    stopStatsPolling();
    setCameraState(false);
    modelStatus.textContent = "Ready";
}

function startStatsPolling() {
    stopStatsPolling();
    updateStats();
    statsTimer = window.setInterval(updateStats, 900);
}

function stopStatsPolling() {
    if (statsTimer !== null) {
        window.clearInterval(statsTimer);
        statsTimer = null;
    }
}

async function updateStats() {
    try {
        const response = await fetch("/api/stats", {
            cache: "no-store"
        });

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        fpsValue.textContent = Number(data.fps || 0).toFixed(1);
        objectCount.textContent = data.object_count || 0;

        const objects = Array.isArray(data.objects) ? data.objects : [];

        const tracked = objects.filter(
            object => object.track_id !== null &&
                      object.track_id !== undefined
        );

        trackingCount.textContent = tracked.length;

        modelStatus.textContent = data.running ? "Active" : "Ready";
        cameraStatus.textContent = data.status || "Camera stopped";
        sidebarStatus.textContent = data.running
            ? "Detection active"
            : "Waiting for camera";

        if (data.last_updated && data.last_updated !== "--") {
            lastUpdated.textContent = `Last update: ${data.last_updated}`;
        }

        renderObjects(objects);
    } catch (error) {
        console.error("Unable to update stats:", error);
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function renderObjects(objects) {
    objectListCount.textContent = objects.length;

    const signature = JSON.stringify(objects);

    if (signature === lastObjectSignature) {
        return;
    }

    lastObjectSignature = signature;

    if (!objects.length) {
        objectList.innerHTML = `
            <div class="empty-state" id="empty-state">
                <div class="empty-icon">⌕</div>
                <strong>No objects detected</strong>
                <p>Point the camera at objects supported by the model.</p>
            </div>
        `;

        objectFooterText.textContent = cameraIsRunning
            ? "Scanning current frame"
            : "Waiting for detections";

        return;
    }

    objectList.innerHTML = objects.map(object => {
        const name = escapeHTML(object.name || "Unknown");
        const confidence = Math.min(
            100,
            Math.max(0, Number(object.confidence) || 0)
        );

        const trackId = object.track_id === null ||
                        object.track_id === undefined
            ? "Not assigned"
            : `ID ${escapeHTML(object.track_id)}`;

        const symbol = object.track_id === null ||
                       object.track_id === undefined
            ? "◈"
            : "⌖";

        return `
            <div class="object-row">
                <div class="object-symbol">${symbol}</div>

                <div class="object-main">
                    <div class="object-name-line">
                        <span class="object-name">${name}</span>
                        <span class="object-confidence">
                            ${confidence.toFixed(1)}%
                        </span>
                    </div>

                    <div class="confidence-track">
                        <div class="confidence-fill"
                             style="width: ${confidence}%"></div>
                    </div>

                    <div class="object-meta">
                        <span>Confidence score</span>
                        <span class="track-tag">${trackId}</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    objectFooterText.textContent =
        `${objects.length} detection${objects.length === 1 ? "" : "s"} in latest frame`;
}

function applyTheme(theme) {
    const light = theme === "light";

    document.body.classList.toggle("light-theme", light);
    themeToggle.textContent = light ? "☾" : "☼";
    themeToggle.setAttribute(
        "aria-label",
        light ? "Switch to dark theme" : "Switch to light theme"
    );
}

themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    const nextTheme = isLight ? "dark" : "light";

    applyTheme(nextTheme);

    try {
        localStorage.setItem("visiontrack-theme", nextTheme);
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }
});

startButton.addEventListener("click", startCamera);
stopButton.addEventListener("click", stopCamera);

videoFeed.addEventListener("error", () => {
    if (cameraIsRunning) {
        showMessage(
            "Video stream was interrupted. Try stopping and starting the camera again."
        );
    }
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

async function checkModelHealth() {
    try {
        const response = await fetch("/api/health");
        const data = await response.json();

        if (data.ok) {
            modelStatus.textContent = "Ready";
        }
    } catch (error) {
        modelStatus.textContent = "Offline";
    }
}

try {
    const savedTheme = localStorage.getItem("visiontrack-theme");
    applyTheme(savedTheme || "dark");
} catch (error) {
    applyTheme("dark");
}

setCameraState(false);
checkModelHealth();
