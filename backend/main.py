from flask import Flask, jsonify, request
app = Flask(__name__)
@app.route('/form')

@app.route('/live', methods=['POST'])
def process_batch():
    return request

@app.route('/end', methods=['GET'])
def end():
    return jsonify({"done": True})
