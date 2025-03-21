# GigHub - Student Job Portal

A full-stack web application that connects students with job opportunities from companies. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **For Students:**
  - Create and manage your profile
  - Browse available jobs
  - Apply to jobs
  - Track application status
  - Receive notifications for application updates

- **For Recruiters:**
  - Create and manage job postings
  - View student applications
  - Accept/reject applications
  - Send notifications to applicants
  - Track job performance

## Tech Stack

- **Frontend:**
  - React.js
  - Material-UI
  - React Router
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/GigHub.git
cd GigHub
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
skill-marketplace/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── contexts/
        ├── pages/
        └── App.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 