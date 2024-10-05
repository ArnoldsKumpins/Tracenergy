from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/get_coordinates', methods=['POST'])
def get_coordinates():
    data = request.get_json()
    address = data.get('address')
    print(f"Received address: {address}")

    if not address:
        print("No address provided.")
        return jsonify({'error': 'No address provided'}), 400

    geolocator = Nominatim(user_agent="geoapiExercises", timeout=10)  # Set timeout to 10 seconds
    print("Trying to get coordinates...")
    
    try:
        location = geolocator.geocode(address)
        print(f"Geocoding result: {location}")

        if location:
            print(f"Coordinates found: {location.latitude}, {location.longitude}")
            return jsonify({
                'latitude': location.latitude,
                'longitude': location.longitude
            })
        else:
            print("Location not found.")
            return jsonify({'error': 'Location not found'}), 404

    except GeocoderTimedOut:
        print("Geocoding service timed out.")
        return jsonify({'error': 'Geocoding service timed out. Please try again.'}), 503
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
