let barChart;

function fetchLiveStatistics() {
    fetch('/live')
        .then(response => response.json())
        .then(data => {
            document.getElementById('frames-processed').innerText = Object.values(data.frames_processed).reduce((a, b) => a + b, 0);
            barChart.data.labels = Object.keys(data.frames_processed);
            barChart.data.datasets[0].data = Object.values(data.frames_processed);
            barChart.update();
        })
        .catch(error => console.error('Error fetching live statistics:', error));
}

window.onload = function () {
    const ctx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Frames Processed',
                data: [],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    setInterval(fetchLiveStatistics, 2000);
};
