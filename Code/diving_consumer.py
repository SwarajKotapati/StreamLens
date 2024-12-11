from kafka import KafkaConsumer
import json
import cv2
import numpy as np
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import img_to_array
from pymongo import MongoClient

# Kafka configurations
consumer = KafkaConsumer(
    "Surfing",
    bootstrap_servers="localhost:9092",
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    group_id="diving_group"
)

# Load pre-trained ResNet50 model
model = ResNet50(weights="imagenet")

# MongoDB configuration
client = MongoClient("mongodb://localhost:27017/")
db = client["video_processing"]

# Process frames
for message in consumer:
    frame_info = message.value
    try:
        frame_bytes = bytes.fromhex(frame_info["frame_bytes"])
        frame_array = np.frombuffer(frame_bytes, dtype=np.uint8)
        frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)

        if frame is None:
            print(f"Error decoding frame for {frame_info['video_file']}, skipping...")
            continue

        # Preprocess the frame for ResNet50
        image = cv2.resize(frame, (224, 224))
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0)
        image = preprocess_input(image)

        # Predict using ResNet50
        predictions = model.predict(image)
        decoded_predictions = decode_predictions(predictions, top=3)[0]

        # Add predictions to metadata
        frame_info["predictions"] = [
            {"label": pred[1], "confidence": float(pred[2])} for pred in decoded_predictions
        ]
        print(f"Processed Surfing frame: {frame_info['predictions']}")

        # Store results in MongoDB
        collection = db["Diving"]
        collection.insert_one(frame_info)

    except Exception as e:
        print(f"Error processing frame: {e}")
