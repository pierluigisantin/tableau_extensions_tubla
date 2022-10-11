

from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World! these are extensions</p>"


if __name__ == "__main__":
    app.run(debug=True,host='127.0.0.1',ssl_context='adhoc',port=5000 )