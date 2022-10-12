import psycopg2

def createConnection():
    conn = psycopg2.connect(database="BI", user="BI", password="BITUBLA2020", host='127.0.0.1', port=5432)
    return  conn

def createTableauConnection():
    conn = psycopg2.connect(database="workgroup", user="readonly", password="Paper0tt0", host='10.24.130.60', port=8060)
    return  conn

def test():
    conn = createConnection()
    print ("connection ok")
    conn.close()
    conn = createTableauConnection()
    print("connection Tableau ok")
    conn.close()
