# IAMShield (Identity and Access Management Platform)

A full-stack modern Identity and Access Management (IAM) security assessment and recommendation platform. This project helps organizations evaluate their current IAM infrastructure, identify vulnerabilities, and receive actionable zero-trust recommendations.

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, React Router DOM v7, React Hot Toast, Vanilla CSS (Glassmorphism design)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Email Service**: Nodemailer (for OTPs and password resets)

## 📁 Project Structure

The repository is structured into two main directories:
- `/frontend` - Contains the Vite React application.
- `/backend` - Contains the Express server and MongoDB models.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas cluster)

### 1. Backend Setup
The backend runs on port 5000 by default.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # For Nodemailer (Forgot Password functionality)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   OTP_EXPIRES_MINUTES=10
   ```
   *(Note: If using Gmail, you must generate an "App Password" to use in `EMAIL_PASS`)*

4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
The frontend runs on Vite's default port (usually 5173).

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (e.g., `http://localhost:5173`).

## 🔑 Features
- **Public Area**: Responsive Landing page, Login, Signup, Forgot Password, Request Demo.
- **User Dashboard**: Glassmorphic UI with dynamic assessment metrics and real-time history.
- **Security Assessment Tool**: Multi-phase interactive assessment wizard for identifying enterprise IAM vulnerabilities.
- **AI-Driven Recommendations**: Post-assessment tailored actions based on user input.
- **Admin Panel**: Dedicated `/admin/login` for viewing platform statistics, users, access requests, and security logs.
- **User Segregation**: Assessment reports and data are scoped strictly to the authenticated user's account.

## 🛡️ Authentication & Privacy
- **JWT Protection**: Secure API endpoints for both users and administrators.
- **Password Hashes**: `bcryptjs` is used to salt and hash all passwords.
- **OTP Verification**: Multi-step flow for resetting forgotten passwords securely via email.
- **Guest Handoff**: Unauthenticated users can try the assessment, and their results are seamlessly migrated if they decide to register at the end.

