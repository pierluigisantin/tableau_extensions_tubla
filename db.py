import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import  datetime
def createConnection():
    conn = psycopg2.connect(database="BI", user="BI", password="BITUBLA2020", host='127.0.0.1', port=5432,cursor_factory=RealDictCursor)
    return  conn

def createTableauConnection():
    conn = psycopg2.connect(database="workgroup", user="readonly", password="Paper0tt0", host='10.24.130.60', port=8060,cursor_factory=RealDictCursor)
    return  conn

def saveCalculation(data):
    conn = createConnection()
    curr = conn.cursor()
    sql = "insert into costcalc.calculation (calc_code,calc_name,configuration_id,company_code,status,date_from,date_to) " \
          " values " \
          "( %s,%s,%s,%s,%s,%s,%s )"
    curr.execute(sql,
                 (data["calc_code"],
                  data["calc_name"],
                  data["configuration_id"],
                  data["company_code"],
                  0,#status,
                  datetime.strptime(data["date_from"], '%Y-%m-%d'),
                  datetime.strptime(data["date_to"], '%Y-%m-%d')
                  )
                  )
    conn.commit()
    conn.close()


def getCompanies():
    conn = createConnection()
    data=[]
    cur = conn.cursor()
    cur.execute("select * from costcalc.company")
    rows=cur.fetchall()
    for row in rows:
        obj={
            'company_name':row["company_name"]
        }
        data.append(obj)
    conn.close()
    return {'data':data}
def checkTableauCookie(cookie):


    if cookie is not None:
        num=0
        sessionid = cookie.split('|')
        sessionid=sessionid[0]
        conn = createTableauConnection()
        cur = conn.cursor()
        cur.execute("select count(1) as num from public\"_sessions\" where session_id='%s' ", (sessionid))
        rows = cur.fetchall()
        for row in rows:
            num=row[0]
        conn.close()
        if num==0:
            raise Exception("function called by user not logged in Tableau")
    else:
        raise Exception("function called by user not logged in Tableau")

def test():
    conn = createConnection()
    print ("connection ok")
    conn.close()
    conn = createTableauConnection()
    print("connection Tableau ok")
    conn.close()
