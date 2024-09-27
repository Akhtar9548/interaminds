from flask import Flask, jsonify, request
from pymongo import MongoClient, errors
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 


try:
    client = MongoClient('mongodb://localhost:27017')
    db = client['ak_kh']  
    collection = db['khan'] 
    print("Connected to MongoDB")
except errors.ConnectionError as e:
    print(f"Error connecting to MongoDB: {e}")


@app.route('/api/donations', methods=['GET'])
def get_donations():
    try:
        donations = list(collection.find({}, {'_id': 0})) 
        return jsonify(donations)
    except Exception as e:
        print(f"Error fetching donations: {e}")
        return jsonify({"error": "Failed to fetch donations"}), 500

@app.route('/api/donations', methods=['POST'])
def add_donation():
    donation = request.json
    print(donation)  
    if 'name' in donation and 'amount' in donation:
        try:
            result = collection.insert_one(donation)
            print(f"Inserted document id: {result.inserted_id}")  
            return jsonify({"message": "Donation added successfully"}), 201
        except Exception as e:
            print(f"Error inserting donation: {e}")
            return jsonify({"error": "Failed to add donation"}), 500
    return jsonify({"error": "Invalid data"}), 400


@app.route('/api/donations/<string:name>', methods=['DELETE'])
def delete_donation(name):
    try:
        result = collection.delete_one({'name': name})
        if result.deleted_count > 0:
            return jsonify({"message": "Donation deleted successfully"}), 200
        else:
            return jsonify({"error": "Donation not found"}), 404
    except Exception as e:
        print(f"Error deleting donation: {e}")
        return jsonify({"error": "Failed to delete donation"}), 500

if __name__ == "__main__":
    app.run(debug=True)
