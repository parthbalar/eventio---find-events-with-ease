# 🎉 Eventio – Find Events with Ease

**Eventio** is a full-stack event discovery and management web application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. It allows users to find and register for events, while providing a secure platform for event hosts to upload and manage their events.


## 🚀 Features

### 👥 User Features
- View upcoming events with event details.
- Search and filter events.
- Register/login securely (including Google authentication).
- Purchase event tickets and manage bookings.
- Cancel tickets and get status updates.

### 🧑‍💼 Host Features
- Create and manage events (premium hosts only).
- Upload event banners, set timings, location, and descriptions.
- Track ticket bookings and event performance.

### 🛡️ Admin Panel (Optional)
- Manage users, events, and reported issues.

---

## 🛠️ Tech Stack

| Tech         | Description                    |
|--------------|--------------------------------|
| React.js     | Frontend UI                    |
| Tailwind CSS | Responsive styling             |
| Node.js      | Backend server logic           |
| Express.js   | API routing and middleware     |
| MongoDB      | NoSQL database                 |
| Mongoose     | ODM for MongoDB                |
| Axios        | API calls between frontend/backend |
| SweetAlert2  | Alert popups for UX feedback   |
| JWT/Auth     | User authentication (including Google OAuth) |

---

## 🔧 Installation & Setup

1. **Clone the repository**
```bash
git clone ......
cd eventio

# For frontend
cd client
npm install

# For backend
cd ../server
npm install

# Frontend
npm run dev  # or npm start (inside /client)

# Backend
node --watch index.js  # (inside /server)
