# MedCare - Medical Appointment Booking System

A full-stack medical appointment booking system built with React.js frontend and Node.js backend with MongoDB Atlas database.

## 🚀 Features

- **User Authentication**: Patient and Doctor registration/login
- **Appointment Management**: Book, view, and manage appointments
- **Prescription Management**: Create and view prescriptions
- **Lab Reports**: Manage patient lab reports
- **Medical History**: Track patient medical history
- **Emergency Cases**: Handle emergency case management
- **Time Slot Management**: Manage doctor availability

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios for API calls
- React Toastify for notifications

### Backend

- Node.js
- Express.js
- MongoDB Atlas (MongoDB)
- Mongoose ODM
- JWT Authentication
- bcryptjs for password hashing
- Nodemailer for email notifications

## 📁 Project Structure

```
web_project/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/             # API controllers
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   ├── middleware/              # Auth middleware
│   └── server.js               # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── styles/            # CSS files
│   └── package.json
└── render.yaml                 # Render deployment config
```

## 🚀 Deployment to Render

### Prerequisites

1. MongoDB Atlas account and cluster
2. Render account
3. GitHub repository with your code

### Environment Variables

Set these environment variables in your Render dashboard:

#### Backend Environment Variables:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `EMAIL_USER`: Gmail account for sending emails
- `EMAIL_PASSWORD`: Gmail app password
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: production

#### Frontend Environment Variables:

- `REACT_APP_API_URL`: Your backend service URL (e.g., https://medcare-backend.onrender.com)

### Deployment Steps

1. **Connect your GitHub repository to Render**

2. **Create Backend Service:**

   - Service Type: Web Service
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add environment variables as listed above

3. **Create Frontend Service:**

   - Service Type: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
   - Add environment variables as listed above

4. **Deploy:**
   - Render will automatically deploy your services
   - Backend will be available at: `https://your-backend-name.onrender.com`
   - Frontend will be available at: `https://your-frontend-name.onrender.com`

## 🔧 Local Development

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm start
```

## 🧪 Testing

Run the endpoint tests:

```bash
cd backend
node test-endpoints.js
```

## 📝 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `POST /auth/reset-password` - Reset password

### Users

- `GET /api/users/:id` - Get user by ID

### Patients

- `GET /api/patients` - Get all patients

### Appointments

- `GET /api/appointments/doctors` - Get all doctors
- `GET /api/appointments/patient` - Get patient appointments
- `GET /api/appointments/doctor` - Get doctor appointments
- `GET /api/appointments/available-slots/:doctorId` - Get available slots
- `POST /api/appointments/book` - Book appointment
- `PUT /api/appointments/update-status` - Update appointment status
- `GET /api/appointments/view/:appointmentId` - Get appointment by ID
- `POST /api/appointments/add-slot` - Add time slot
- `DELETE /api/appointments/remove-slot/:slotId` - Remove time slot

### Prescriptions

- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions` - Get prescriptions

### Lab Reports

- `GET /api/lab-reports` - Get lab reports
- `POST /api/lab-reports` - Add lab report
- `PUT /api/lab-reports` - Update lab report
- `DELETE /api/lab-reports/:id` - Delete lab report

### Medical History

- `GET /api/medical-history` - Get medical history
- `POST /api/medical-history` - Add medical history
- `PUT /api/medical-history` - Update medical history
- `DELETE /api/medical-history/:id` - Delete medical history

### Emergency Cases

- `GET /api/emergency-cases` - Get emergency cases
- `POST /api/emergency-cases` - Add emergency case
- `PUT /api/emergency-cases` - Update emergency case
- `DELETE /api/emergency-cases/:id` - Delete emergency case

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS enabled
- Input validation
- Error handling middleware

## 📧 Email Notifications

The system sends email notifications for:

- Appointment confirmations
- Prescription updates
- Password resets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
