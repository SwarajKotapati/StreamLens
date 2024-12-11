from kafka import KafkaProducer
import cv2
import json
import os
import time

# Kafka configuration
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda m: json.dumps(m).encode("utf-8"),
)

categories = ["Surfing", "CricketBowling", "Diving"]
base_path = "UCF-101"

# Process videos for the selected categories
for category in categories:
    folder_path = os.path.join(base_path, category)
    for video_file in os.listdir(folder_path):
        video_path = os.path.join(folder_path, video_file)
        cap = cv2.VideoCapture(video_path)
        frame_id = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Encode frame to bytes
            _, buffer = cv2.imencode(".jpg", frame)
            frame_bytes = buffer.tobytes()

            # Publish frame to a Kafka topic named after the category
            producer.send(
                category,
                {
                    "category": category,
                    "video_file": video_file,
                    "frame_id": frame_id,
                    "frame_bytes": frame_bytes.hex(),
                },
            )
            frame_id += 1
            time.sleep(0.1)  # Throttle to simulate real-time streaming

        cap.release()

print("Finished sending frames.")
