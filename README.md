# CareCube 🏥

CareCube is a modern, full-stack healthcare management application built to seamlessly facilitate operations between System Administrators, Hospitals, and NGOs. 

## 🚀 Key Features

- **Dynamic Resource Management**: Full CRUD operations for Hospitals and Resource Requests.
- **Smart Resource Logic**: Automatic status classification (`Critical`, `Moderate`, `Stable`) based on real-time metrics such as hospital oxygen levels.
- **Role-Based Security**: Robust authentication system that strictly limits the "System Administrator" portal to predefined users, while allowing open registration for participating Hospitals and NGOs.
- **Profile Customization**: Users can easily update their organizational details and independently manage their passwords.
- **Intuitive UI**: Built with a custom React Context theme provider, offering a visually stunning, reactive, and responsive interface.

## 💻 Tech Stack

- **Frontend**: React.js (Bootstrapped with Vite)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose)
- **Styling**: Component-level inline styling driven by a global `ThemeContext`

## 🛠️ Installation & Setup

You will need to run both the frontend and backend servers concurrently.

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory and add your MongoDB connection string:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd CareCube/carecube
npm install
npm run dev
```
The application will be running locally (usually at `http://localhost:5173`).

## 🔒 Default Admin Credentials
To access the System Administrator portal, you can log in using the predefined testing credentials:
- **Email:** `admin1@carecube.com`
- **Password:** `12345`
