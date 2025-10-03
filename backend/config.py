import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Dinesh@2301",
        database="Handscape",
        port=9000
    )
    return connection