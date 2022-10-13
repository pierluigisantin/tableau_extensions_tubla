import flask
from flask import Flask
from time import strftime
import traceback
import  db

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World! these are extensions</p>"


@app.errorhandler(Exception)
def exceptions(e):
    ts=strftime('[%Y-%b-%d %H:%M]')
    tb=traceback.format_exc()
    app.logger.error('%s %s %s %s %s %s',
                     ts,
                     flask.request.remote_addr,
                     flask.request.method,
                     flask.request.scheme,
                     flask.request.full_path,
                     tb)
    return "Logged Internal Server Error",500



if __name__ == "__main__":
    db.test()
    app.run(debug=True,host='127.0.0.1',port=5001)