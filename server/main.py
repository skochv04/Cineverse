import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

cors = CORS(app, origins='*')

@app.route("/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'user1',
                'user2',
                'user3'
            ]
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8080)
