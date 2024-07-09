document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('trafficForm');
    const successCountDiv = document.getElementById('successCount');
    const failureCountDiv = document.getElementById('failureCount');
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close');

    // Establish WebSocket connection
    const socket = io.connect(window.location.origin);

    // Initialize the chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, chartConfig);

    let totalVisits = 0;
    let successCount = 0;
    let failureCount = 0;

    // Function to validate URL
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const urlInput = document.getElementById('url');
        const nInput = document.getElementById('n');

        const url = urlInput.value.trim();
        const n = parseInt(nInput.value);

        // Validate URL
        if (!isValidUrl(url)) {
            alert('Please enter a valid URL.');
            urlInput.focus();
            return;
        }

        // Reset counts
        totalVisits = n;
        successCount = 0;
        failureCount = 0;

        // Emit start_traffic event to backend
        socket.emit('start_traffic', { url: url, n: n });

        // Clear previous chart data
        progressChart.data.labels = [];
        progressChart.data.datasets[0].data = [];
        progressChart.data.datasets[1].data = [];
        progressChart.update();

        // Hide modal if visible
        modal.style.display = 'none';
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

        // Check if all visits are successful
        if (data.success_count + data.failure_count === totalVisits && data.success_count === totalVisits) {
            // Show congratulations message
            modal.style.display = 'block';
        }
    });

    // Close the modal
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});

// Chart configuration
const chartConfig = {
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
};
