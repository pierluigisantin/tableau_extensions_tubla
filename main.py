import json
import sys
import flask
from flask import Flask
from time import strftime
import traceback
import  db

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World! these are extensions</p>"

@app.route("/companies",methods=['GET'])
def getCompanies():

    return flask.jsonify(db.getCompanies())

@app.route("/calculation",methods=['POST'])
def postCalculation():
    content = flask.request.get_json()
    db.saveCalculation(content)
    return json.dumps({'status':'OK'})

@app.route("/calculation_bom_explosion",methods=['POST'])
def postCalculationBomExplosion():
    content = flask.request.get_json()
    db.saveCalculationBomExplosion(content)
    return json.dumps({'status':'OK'})
@app.route("/costrate",methods=['POST'])
def postCostRate():
    content = flask.request.get_json()
    db.saveCostRate(content)
    return json.dumps({'status':'OK'})


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



def checkTableauCookie():
    res = flask.request.cookies.get("workgroup_session_id")
    db.checkTableauCookie(res)

if __name__ == "__main__":
    db.test()

    #read port from command line
    portToUse = 5001
    if len(sys.argv[1:])>0:
        portToUse=    sys.argv[1:][0]


    app.run(debug=True,host='127.0.0.1',port=portToUse)