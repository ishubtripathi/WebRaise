document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('trafficForm');
    const successCountDiv = document.getElementById('successCount');
    const failureCountDiv = document.getElementById('failureCount');

    // Establish WebSocket connection
    const socket = io.connect(window.location.origin);

    // Initialize the chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Successful Visits',
                    data: [],
                    borderColor: 'green',
                    fill: false,
                },
                {
                    label: 'Failed Visits',
                    data: [],
                    borderColor: 'red',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Visit Number'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Count'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const url = document.getElementById('url').value;
        const n = parseInt(document.getElementById('n').value);

        // Emit start_traffic event to backend
        socket.emit('start_traffic', { url: url, n: n });

        // Clear previous chart data
        progressChart.data.labels = [];
        progressChart.data.datasets[0].data = [];
        progressChart.data.datasets[1].data = [];
        progressChart.update();
    });

    // Handle progress update event from backend
    socket.on('progress_update', function (data) {
        const visitNumber = progressChart.data.labels.length + 1;
        progressChart.data.labels.push(visitNumber);
        progressChart.data.datasets[0].data.push(data.success_count);
        progressChart.data.datasets[1].data.push(data.failure_count);
        progressChart.update();

        successCountDiv.textContent = `Success Count: ${data.success_count}`;
        failureCountDiv.textContent = `Failure Count: ${data.failure_count}`;
    });
});
