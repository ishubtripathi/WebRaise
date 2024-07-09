document.getElementById('trafficForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const n = document.getElementById('n').value;

    fetch('/visit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, n })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerText = `Total successful visits: ${data.success_count}\nTotal failed visits: ${data.failure_count}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
