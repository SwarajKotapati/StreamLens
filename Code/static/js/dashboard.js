const socket = io();

// Real-time Frame Counter
const frameCounter = document.getElementById("frame-count");

socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    socket.emit("request_live_updates");
});

socket.on("update_frames", (data) => {
    frameCounter.textContent = data.frames_processed;
    updateFramesChart(data.frames_processed);
});

// Chart.js - Frames Processed Over Time
const ctx1 = document.getElementById("framesChart").getContext("2d");
const framesChart = new Chart(ctx1, {
    type: "line",
    data: {
        labels: [], // Time points
        datasets: [{
            label: "Frames Processed",
            data: [], // Number of frames
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
        }],
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
        scales: {
            x: { title: { display: true, text: "Time" } },
            y: { title: { display: true, text: "Frames" } },
        },
    },
});

function updateFramesChart(framesProcessed) {
    const currentTime = new Date().toLocaleTimeString();
    framesChart.data.labels.push(currentTime);
    framesChart.data.datasets[0].data.push(framesProcessed);
    framesChart.update();
}

// Chart.js - Predictions Pie Chart
const ctx2 = document.getElementById("predictionsPieChart").getContext("2d");
const predictionsPieChart = new Chart(ctx2, {
    type: "pie",
    data: {
        labels: ["Category A", "Category B", "Category C"], // Example labels
        datasets: [{
            data: [10, 20, 30], // Example data
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        }],
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
    },
});

function updatePieChart(predictions) {
    predictionsPieChart.data.datasets[0].data = predictions;
    predictionsPieChart.update();
}
