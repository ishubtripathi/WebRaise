from flask import Flask, render_template
import requests
from random import choice, randint
import time
from flask_socketio import SocketIO, emit

app = Flask(__name__, template_folder='front')
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with a secure secret key
socketio = SocketIO(app)

user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
]

scraperapi_key = 'your_scraperapi_key_here'  # Replace with your ScraperAPI key

@socketio.on('start_traffic')
def handle_start_traffic(data):
    url = data['url']
    n = int(data['n'])

    success_count = 0
    failure_count = 0

    for _ in range(n):
        session = requests.Session()
        headers = {
            'User-Agent': choice(user_agents),
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }

        proxy = {
            'http': f'http://scraperapi:{scraperapi_key}@proxy-server.scraperapi.com:8001',
        }

        try:
            response = session.get(url, headers=headers, proxies=proxy)
            if response.status_code == 200:
                success_count += 1
            else:
                failure_count += 1
        except requests.RequestException as e:
            failure_count += 1

        # Emit progress update to client after each visit
        socketio.emit('progress_update', {'success_count': success_count, 'failure_count': failure_count})
        socketio.sleep(1)  # Ensure socketio can process and send the message

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
