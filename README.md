# CareCube 🏥

CareCube is a modern, full-stack healthcare logistics and resource management platform built to seamlessly facilitate operations between System Administrators, Hospitals, and NGOs. It serves as a real-time command center for critical medical resources during emergencies.

## 🚀 Key Features

- **Real-Time Resource Network**: Connects hospitals and NGOs to provide live visibility into critical medical resources across the region.
- **Dynamic Hospital Dashboards**: Hospitals get a real-time command center to process incoming resource requests and monitor operational status.
- **Closed-Loop Logistics Engine**: Automates the logistics workflow. When a hospital approves an incoming request from an NGO, the system automatically deducts the necessary resources (ICU Beds, Ventilators, Oxygen, Blood Units) from inventory and logs an immutable allocation dispatch record.
- **Dedicated Inventory Management**: A streamlined workspace for hospitals to quickly update and sync their current resource capacities with the live database.
- **Automated Resource Alerts**: Smart resource logic that automatically triggers system-wide visual alerts (`Critical`, `Moderate`, `Stable`) when supply metrics (like oxygen levels) drop below safety thresholds.
- **Role-Based Workflows**: Separate, secure environments for System Administrators, Hospitals, and NGOs, complete with dynamic approval flows for new user registrations.
- **Interactive UI/UX**: Built with a custom React Context theme provider, offering a visually stunning, responsive interface with micro-animations and intuitive progress bars.

## 💻 Tech Stack

- **Frontend**: React.js (Bootstrapped with Vite)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose)
- **Styling**: Component-level inline styling driven by a global `ThemeContext`

## 🛠️ Installation & Setup

You will need to run both the frontend and backend servers concurrently.

### 1. Backend Setup
```bash
cd CareCube/backend
npm install
```
Create a `.env` file in the `CareCube/backend` directory and add your MongoDB connection string:
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
