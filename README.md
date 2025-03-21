# Skill Marketplace

A web application that connects college students with job opportunities based on their skills. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (register, login, profile management)
- Interactive skill tree visualization
- Job posting and application system
- Real-time messaging between employers and students
- Portfolio showcase
- Review and rating system

## Tech Stack

- **Frontend**: React, Material-UI, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd skill-marketplace
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

4. Create a .env file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gighub
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend server:
   ```bash
   cd frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

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