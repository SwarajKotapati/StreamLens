from flask import Flask, render_template, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB Configuration
client = MongoClient("mongodb://localhost:27017/")
db = client["video_processing"]

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

@app.route("/api/live_stats")
def live_stats():
    stats = {"CricketBowling": 0, "Surfing": 0, "Diving": 0}
    
    # Check the count of frames in each category
    collections = db.list_collection_names()
    for collection in collections:
        if collection in stats:
            stats[collection] = db[collection].count_documents({})
    
    return jsonify({"status": "success", "data": stats})

@app.route("/api/live_predictions")
def live_predictions():
    predictions = []
    
    collections = db.list_collection_names()
    for collection in collections:
        cursor = db[collection].find().limit(5).sort("_id", -1)  # Get the latest 5 predictions
        for doc in cursor:
            for prediction in doc.get("predictions", []):
                predictions.append({
                    "category": collection,
                    "predicted_object": prediction.get("label", "Unknown"),
                    "confidence": prediction.get("confidence", 0),
                })
    
    return jsonify({"status": "success", "data": predictions})

if __name__ == "__main__":
    app.run(debug=True)
