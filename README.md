<div align="center">
  <h1>🏥 CareCube</h1>
  <p><strong>Next-Generation Hospital Logistics & Resource Management Platform</strong></p>
</div>

---

## 📖 Overview

**CareCube** is a comprehensive, full-stack hospital resource and logistics management platform designed to solve critical resource shortages during emergencies. It bridges the gap between hospitals, NGOs, and administrators by offering real-time inventory tracking, automated inter-hospital resource allocations, and seamless end-to-end delivery tracking.

Whether managing ICU Beds, Ventilators, Oxygen Cylinders, or Blood Units, CareCube ensures that life-saving resources are always directed precisely where they are needed most.

---

## ✨ Key Features

- **🛡️ Role-Based Access Architecture**  
  Custom interfaces and routing dynamically tailored for **Hospitals** (resource exchange), **NGOs** (resource requests/outreach), and **Administrators** (global network monitoring).

- **🔄 Automated Logistics Engine**  
  Seamlessly request resources from other hospitals. Approving a request automatically deducts inventory, generates an official **Allocation** record, and launches an active **Tracking** timeline for the delivery.

- **📊 Smart Dashboard & Analytics**  
  Real-time visualization of current inventory levels, active requests, and critical shortages in a sleek, modern UI.

- **⚠️ Automated Alert System**  
  Background alert engine that instantly triggers warnings if a hospital's resource levels drop below minimum safety thresholds.

- **📄 Professional Document Exports**  
  Built-in engine to instantly export logistics tables and tracking histories into beautifully formatted **PDF reports** or raw **CSV spreadsheets** with a single click.

---

## 🛠️ Tech Stack

CareCube is built using a modern **MERN** (MongoDB, Express, React, Node) stack tailored for speed, scalability, and developer experience.

- **Frontend**: React.js (Vite), Context API for state management, CSS Modules (Custom Design System), `jspdf` & `papaparse` for exports.
- **Backend**: Node.js, Express.js, JWT Authentication, RESTful API architecture.
- **Database**: MongoDB (Mongoose ORM).
- **Environment**: Managed via `.env` configuration for secure deployment.

---

## 🚀 Getting Started

### Prerequisites
Before running CareCube locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/carecube.git
   cd carecube
   ```

2. **Setup the Backend**
   ```bash
   cd CareCube/backend
   npm install
   ```
   Create a `.env` file in `CareCube/backend/` and add your database credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/carecube
   JWT_SECRET=your_super_secret_jwt_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../carecube
   npm install
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`. 
   *(Note: The frontend expects the backend to be running on port 5000).*

---

## 📂 Project Structure

```text
CareCube/
├── backend/               # Node.js/Express Backend Core
│   ├── config/            # DB and Environment config
│   ├── controllers/       # Business logic (Logistics, Tracking, Auth)
│   ├── models/            # MongoDB Schemas (Hospital, Request, Allocation, Tracking)
│   ├── routes/            # REST API Routes
│   └── utils/             # Helper scripts (Alert Engine)
│
└── carecube/              # React.js (Vite) Frontend Core
    ├── public/            # Static assets
    ├── src/
    │   ├── components/    # Reusable UI elements (Shell, Nav, Badges)
    │   ├── context/       # React Context (Auth, Theme)
    │   ├── pages/         # Core Views (Dashboard, Inventory, Logistics)
    │   └── utils/         # PDF and CSV Export Engines
    └── index.css          # Global Design System
```

---

## 🤝 Contribution Guidelines

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

<div align="center">
  <p>Built with ❤️ for a more connected healthcare ecosystem.</p>
</div>
