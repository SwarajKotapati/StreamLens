document.addEventListener("DOMContentLoaded", function () {
    const totalFramesEl = document.getElementById("total-frames");
    const predictionsTableBody = document.querySelector("#predictions-table tbody");
    const framesChartCtx = document.getElementById("frames-chart").getContext("2d");
    const pieChartCtx = document.getElementById("pie-chart").getContext("2d");
    const lineChartCtx = document.getElementById("line-chart").getContext("2d"); // Line Chart

    // Bar Chart for frames processed per category
    const framesChart = new Chart(framesChartCtx, {
        type: "bar",
        data: {
            labels: ["CricketBowling", "Surfing", "Diving"], // Updated category name
            datasets: [{
                label: "Frames Processed",
                data: [0, 0, 0], // Default values
                backgroundColor: "#36A2EB",
            }],
        },
    });

    // Pie Chart for predicted object distribution
    const pieChart = new Chart(pieChartCtx, {
        type: "pie",
        data: {
            labels: [], // Dynamic labels will be filled
            datasets: [{
                data: [],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0"],
            }],
        },
    });

    // Line Chart for live statistics
    const lineChart = new Chart(lineChartCtx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Total Frames Processed",
                data: [],
                borderColor: "#FF5733",
                backgroundColor: "rgba(255, 87, 51, 0.2)",
                fill: true,
            }],
        },
    });

    // Fetch and update live stats (frame counts)
    async function fetchLiveStats() {
        const response = await fetch("/api/live_stats");
        const data = await response.json();
        if (data.status === "success") {
            const stats = data.data;
            framesChart.data.datasets[0].data = [stats.CricketBowling, stats.Surfing, stats.Diving];
            totalFramesEl.textContent = stats.CricketBowling + stats.Surfing + stats.Diving;

            // Update Line Chart (Live Statistics)
            const currentTime = new Date().toLocaleTimeString();
            lineChart.data.labels.push(currentTime);
            lineChart.data.datasets[0].data.push(stats.CricketBowling + stats.Surfing + stats.Diving);
            lineChart.update();

            framesChart.update();
        }
    }

    // Fetch and update live predictions
    async function fetchLivePredictions() {
        const response = await fetch("/api/live_predictions");
        const data = await response.json();
        if (data.status === "success") {
            const predictions = data.data;
            const objectCounts = {};

            // Update Predictions Table
            predictionsTableBody.innerHTML = ""; // Clear old data
            predictions.forEach((prediction) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${prediction.category}</td>
                    <td>${prediction.predicted_object}</td>
                    <td>${(prediction.confidence * 100).toFixed(2)}%</td>
                `;
                predictionsTableBody.appendChild(row);

                // Update Pie Chart
                const object = prediction.predicted_object;
                objectCounts[object] = (objectCounts[object] || 0) + 1;
            });

            // Update Pie Chart
            pieChart.data.labels = Object.keys(objectCounts);
            pieChart.data.datasets[0].data = Object.values(objectCounts);
            pieChart.update();
        }
    }

    // Periodically fetch live stats and predictions
    setInterval(fetchLiveStats, 2000);
    setInterval(fetchLivePredictions, 2000);
});
