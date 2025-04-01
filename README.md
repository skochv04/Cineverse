# 🎬 Cineverse

A Python-based full-stack cinema web application, developed as part of the 4th semester of studies at AGH.

## 👥 Team Members:
- **Stas Kochevenko**  
- **Wiktor Dybalski**

## 📌 Project Overview:
Cineverse is a web application that allows users to:  
✅ Reserve seats  
✅ Purchase tickets  
✅ Cancel bookings  

It provides an intuitive and user-friendly interface for both moviegoers and cinema operators.

## 🛠️ Technologies Used:
- **Database Server**: PostgreSQL  
- **Frontend Framework**: React.js  
- **Backend Framework**: Django (Python)  

[![web-page_banner](img/baner.png)](https://youtu.be/ba-O6UYtpy8)

## 🚀 How to Run the Application?

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/skochv04/Cineverse  
cd repository
```

### 2️⃣ Install dependencies
```bash
cd server
pip install -r requirements.txt
```

### 3️⃣ Set up the database
- Start PostgreSQL server
- Import the provided database schema:
```bash
psql -U your_username -d your_database -f CinemaDatabase.sql
```

### 4️⃣ Run the backend server
```bash
cd server
python manage.py runserver
```

### 5️⃣ Run the frontend
```bash
cd client
npm install
npm run dev
```
