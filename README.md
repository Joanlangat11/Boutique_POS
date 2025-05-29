# Boutique POS

A simple and efficient Point of Sale (POS) system tailored for small boutique stores to manage inventory, sales, and customer transactions with ease.

## 🔍 Overview

The **Boutique POS** system is designed to help boutique store owners streamline their operations with key features including product management, customer tracking, and sales recording. Built with simplicity and usability in mind.

## ✨ Features

- 🛍️ Product management (Add/Edit/Delete)
- 📦 Inventory tracking
- 💰 Sales transactions & receipts
- 👥 Customer management
- 📊 Dashboard analytics
- 🧾 Printable receipts/invoices
- 🔐 User authentication

## 🧰 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (or React/Vue if applicable)
- **Backend**: Node.js / Flask / Django (update based on your stack)
- **Database**: MongoDB / PostgreSQL / SQLite (update accordingly)
- **Version Control**: Git & GitHub

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Joanlangat11/Boutique_POS.git
cd Boutique_POS
### 2. Install dependencies
# If Node.js
npm install

# If Python
pip install -r requirements.txt
### 3. Set up your environment variables
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
### 4. Start the server
npm run dev

🗂️ Project Structure
Boutique_POS/
├── controllers/        # Route logic
├── models/             # MongoDB models
├── routes/             # API routes
├── middleware/         # Auth and error handling
├── public/             # Static files (optional)
├── .env                # Environment variables
├── server.js           # App entry point
└── package.json
📊 Example APIs
POST /api/products - Add product

GET /api/products - List all products

POST /api/sales - Record sale

POST /api/auth/login - User login

