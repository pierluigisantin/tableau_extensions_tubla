import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import  datetime
def createConnection():
    conn = psycopg2.connect(database="BI", user="BI", password="BITUBLA2020", host='127.0.0.1', port=5432,cursor_factory=RealDictCursor)
    return  conn

def createTableauConnection():
    conn = psycopg2.connect(database="workgroup", user="readonly", password="Paper0tt0", host='10.24.130.60', port=8060,cursor_factory=RealDictCursor)
    return  conn





def saveCostRate(data):
    uname = data["user_name"]
    checkTableauUser(uname)

    conn = createConnection()
    curr =conn.cursor()
    sql = "delete from costcalc.cost_rates_modification where calc_id=%s and cost_center=%s and cost_type=%s"
    curr.execute(sql,
                 (data["calc_id"],
                 data["cost_center"],
                  data["cost_type"]))
    sql= "insert into costcalc.cost_rates_modification (cost_type,created_by,calc_id,cost_center,new_value,delta)"\
         "values"\
         "(%s,%s,%s,%s,case when %s='' then null else %s end::double precision,case when %s='' then null else %s end::double precision)"
    curr.execute(sql,
                 (
                 data["cost_type"],
                 data["user_name"],
                 data["calc_id"],
                 data["cost_center"],
                 data["new_value"],
                 data["new_value"],
                 data["delta"],
                 data["delta"]))
    conn.commit()
    conn.close()

def saveCalculationBomExplosion(data):
    uname = data["user_name"]
    checkTableauUser(uname)

    conn = createConnection()
    curr = conn.cursor()
    curr2 = conn.cursor()
    curr3 = conn.cursor()



    new_calc_bom_exp_id=1
    sql ="select coalesce(max(calc_bom_exp_id),0) as num from costcalc.calculation_bom_explosion where calc_id=%s"
    curr.execute(sql, (data["calc_id"],))
    rows = curr.fetchall()
    for row in rows:
        new_calc_bom_exp_id=row["num"]

    new_calc_bom_exp_id=new_calc_bom_exp_id+1

    sql="insert into costcalc.calculation_bom_explosion (calc_id,calc_code,calc_name,status,created_by,calc_bom_exp_id,date_for_price_list) values "\
        "(%s,%s,%s,%s,%s,%s,%s)"
    curr2.execute(sql,(
        data["calc_id"],
        data["calc_code"],
        data["calc_name"],
        0,
        data["user_name"],
        new_calc_bom_exp_id,
        datetime.strptime(data["date_for_price_list"],'%Y-%m-%d')
    ))

    sql= "select costcalc.copy_cost_rates(%s,%s,%s)"
    curr3.execute(sql,(
        data["calc_id"],
        new_calc_bom_exp_id,
        data["user_name"]
    ))



    conn.commit()
    conn.close()


def saveCalculation(data):
    uname = data["user_name"]
    checkTableauUser(uname)

    conn = createConnection()
    curr = conn.cursor()
    sql = "insert into costcalc.calculation (calc_code,calc_name,configuration_id,company_code,status,date_from,date_to,created_by) " \
          " values " \
          "( %s,%s,%s,%s,%s,%s,%s ,%s)"
    curr.execute(sql,
                 (data["calc_code"],
                  data["calc_name"],
                  data["configuration_id"],
                  data["company_code"],
                  0,#status,
                  datetime.strptime(data["date_from"], '%Y-%m-%d'),
                  datetime.strptime(data["date_to"], '%Y-%m-%d'),
                  uname
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


def checkTableauUser(user):

        if user is not None:
            num = 0

            conn = createTableauConnection()
            cur = conn.cursor()
            sql="select count(1) as num from public.\"_sessions\" where user_name='{uname}'    ".format(uname=user)

            cur.execute(sql)
            rows = cur.fetchall()
            for row in rows:
                num = row["num"]
            conn.close()
            if num == 0:
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
