# BD2_PROJECT

Database project, carried out in the 4th semester of studies at AGH.


** Setup and Running

Clone the repository:

git clone https://github.com/your-username/your-repo-name.git

Start the PostgreSQL database:

docker-compose up -d


Set up and run the Django backend:

cd server

python -m venv venv

On Windows use `venv\Scripts\activate`

pip install -r requirements.txt

python manage.py runserver


Set up and run the React frontend:

cd client

npm install

npm run dev