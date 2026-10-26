Experiment 11: JWT Authentication and Authorized Endpoints

📌 Description

This project demonstrates how to implement JSON Web Token (JWT) authentication in a Node.js application using Express.js and SQLite. It provides secure access to student records through authentication and authorization mechanisms.

Users can log in with valid credentials to receive a JWT token. This token must be included in requests to access protected student endpoints.

🎯 Objectives

* To understand JWT-based authentication.
* To generate and verify JWT tokens.
* To implement authentication middleware in Express.js.
* To create REST API endpoints for managing student records.
* To connect a Node.js application with an SQLite database.

🛠️ Technologies Used

* Node.js – JavaScript runtime environment.
* Express.js – Web framework for building REST APIs.
* JSON Web Token (JWT) – Token-based authentication.
* SQLite – Database for storing student records.

✨ Features

* User login and JWT token generation.
* Token verification using authentication middleware.
* Protected student management endpoints.
* Retrieve all student records.
* Retrieve a student by ID.
* Add new student records.
* Update existing student records.
* Delete student records.
* Automatic creation of the students database table.

📂 Project Structure

exp11_jwt_auth/
├── app.js
├── db.js
├── package.json
├── README.md
└── .gitignore

⚙️ Installation and Execution

1. Install Dependencies

npm install

2. Start the Server

npm start

The server runs at:

http://localhost:3000

🔑 Authentication

Send a POST request to /auth/login with the following JSON body:

{
  "username": "admin",
  "password": "admin123"
}

A successful login returns a JWT token.

Include the token in the Authorization header when accessing protected endpoints:

Authorization: Bearer <your_token>

📡 API Endpoints

Method	Endpoint	Description
GET	/	Welcome message
POST	/auth/login	Authenticate user and generate JWT
GET	/students	Retrieve all students
GET	/students/:id	Retrieve a student by ID
POST	/students	Add a student
PUT	/students/:id	Update a student
DELETE	/students/:id	Delete a student

Note: All /students endpoints require a valid JWT token.

🔒 Security

The application verifies JWT tokens before allowing access to protected endpoints. Missing tokens return an unauthorized response, while invalid or expired tokens are rejected.

For real-world applications, use environment variables for JWT secrets and implement secure user credential storage.

📚 Learning Outcome

This experiment helps demonstrate JWT authentication, Express.js middleware, REST API development, and SQLite database integration in a Node.js application.
