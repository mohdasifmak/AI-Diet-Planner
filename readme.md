# 🥗 AI-Powered Diet Planner

An intelligent, full-stack web application that generates personalized diet plans using AI models from Together.ai based on user profile data such as age, gender, weight, and health goals.

---

## 🚀 Features

- 🔐 User authentication with registration and login
- 🧠 AI-generated meal plans using Together.ai models
- 📝 Inputs include age, height, weight, gender, location, goals, and dietary restrictions
- 📅 Stores and displays diet plans for 7 days per user
- 💾 MongoDB integration to persist user and diet data
- 🌐 Responsive UI built with EJS and Bootstrap

---

## 🛠️ Tech Stack

- **Frontend:** EJS, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Passport.js (LocalStrategy)
- **AI Integration:** Together.ai Inference API

---

## 🔧 Setup Instructions

1. **Clone the Repository**

2. **Install Dependencies**

npm install

3. **Create .env File**

PORT=3000
MONGO_URI=your_mongodb_uri
AI_API_KEY=togetherai_key

4. **Run the App**

npm start
Visit the app at:
http://localhost:3000
