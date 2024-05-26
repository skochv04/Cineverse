import psycopg2

conn = psycopg2.connect(
    dbname="railway",
    user="postgres",
    password="qeVVEvyMMRDYMrxbjebxyMusSnPXRqFd",
    host="roundhouse.proxy.rlwy.net",
    port="36427"
)
cur = conn.cursor()

with open('client/src/assets/movies_img/undefined.png', 'rb') as file:
    binary_data = file.read()

cur.execute("UPDATE movies SET image= %s  where title = 'TEST' or title = 'TEST2'", (binary_data,))

conn.commit()
cur.close()
conn.close()

print("Image updated for all records in user_api_movie.")