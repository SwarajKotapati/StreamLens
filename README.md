# StreamLens
Real-time distributed video processing system with Kafka, MongoDB, Docker, ResNet50, and ReactJS for high-concurrency, low-latency, and scalable video analytics.

# Distributed Video Processing System

This repository contains the code for a distributed video processing system using Kafka, MongoDB, and Flask. The system processes video frames, applies real-time object detection using the ResNet50 model, and visualizes results on a live dashboard.

---

## Prerequisites

Before starting, ensure the following are installed on your machine:
- Docker and Docker Compose
- Python (Version 3.8 or higher)
- pip (Python package installer)

---

## Install Python Dependencies

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the required Python dependencies:
  Run The following commands in the terminal to install all the required depedencies
  1. pip install flask==2.2.5
  2. pip install pymongo==4.5.0
  3. pip install numpy==1.25.0
  4. pip install opencv-python==4.8.0.74
  5. pip install tensorflow==2.17.0
  6. pip install kafka-python==2.0.2



## Steps to Set Up and Run the System


1. Start Docker Containers

#### Step 1: Build and Start Services
1. Navigate to the directory containing the `docker-compose.yml` file:
   ```bash
   cd /path/to/docker-compose.yml
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Verify that the containers are running:
   ```bash
   docker ps
   ```

#### Step 2: Check Logs
You can view the logs for all services:
```bash
docker-compose logs -f
```


### 3. Run the Producer
The producer publishes video frames to Kafka topics.

1. Navigate to the project directory:
   ```bash
   cd /path/to/project
   ```

2. Run the `producer.py` file:
   ```bash
   python producer.py
   ```

---

### 4. Run the Consumers
Consumers process frames, apply object detection, and store results in MongoDB.

1. Run all the `consumer.py` file:
   ```bash
   python diving_consumer.py
   python cricket_consumer.py
   python surfing_consumer.py
   ```

Repeat this step for each consumer to process specific Kafka topics (if applicable).

---

### 5. Run the Flask Application
The Flask app serves the real-time dashboard.

1. Navigate to the project directory:
   ```bash
   cd /path/to/project
   ```

2. Run the `app.py` file:
   ```bash
   python app.py
   ```

3. Open your web browser and go to:
   ```
   http://127.0.0.1:5000/
   ```

---

### 6. Monitor the Dashboard
The dashboard provides:
- Live statistics on processed frames.
- Predictions with confidence scores.
- Visualization charts (latency, throughput, and scalability metrics).

---

## File Structure

```
.
├── producer.py          # Publishes video frames to Kafka topics
├── diving_consumer.py
├── cricket_consumer.py
├── surfing_consumer.py  # Processes frames and stores results in MongoDB
├── app.py               # Flask application for the dashboard
├── docker-compose.yml   # Docker configuration for services
├── requirements.txt     # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css    # Styling for the dashboard
│   └── js/
│       └── script.js    # JavaScript for real-time updates
├── templates/
│   └── dashboard.html   # Dashboard HTML template
├── README.md            # Project documentation
```

---

## Expected Outputs

1. Live Dashboard
   - View real-time statistics on frames processed.
   - See predictions and confidence scores.
   - Monitor system performance using charts.

2. Performance Metrics
   - Average latency: ~154ms per frame.
   - Throughput: 50 FPS (normal load), 35 FPS (peak load).

---

## Stopping the System

To stop all services:
```bash
docker-compose down
```

---

## Troubleshooting

- Kafka Not Running: Ensure Kafka and Zookeeper containers are running:
  ```bash
  docker ps
  ```
- No Data on Dashboard: Check if `producer.py` and `consumer.py` are running correctly.
- Dependency Issues: Install Python dependencies:
  ```bash
  pip install -r requirements.txt
  ```

--- 


