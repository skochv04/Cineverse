import psycopg2

conn = psycopg2.connect(
    dbname="railway",
    user="postgres",
    password="qeVVEvyMMRDYMrxbjebxyMusSnPXRqFd",
    host="roundhouse.proxy.rlwy.net",
    port="36427"
)
cur = conn.cursor()

with open('client/src/assets/movies_img/king.jpg', 'rb') as file:
    binary_data = file.read()

cur.execute("UPDATE user_api_movie SET image = %s", (binary_data,))

conn.commit()
cur.close()
conn.close()

print("Image updated for all records in user_api_movie.")