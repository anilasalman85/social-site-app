# Social-Site
# Social Post Scheduler App

A **MERN (MongoDB, Express, React, Node.js)** application that allows users to schedule social media posts across multiple platforms (Twitter, Facebook, Instagram). Users can create, edit, delete, and schedule posts, with automatic publishing when the scheduled time arrives.

---

##  Features

- User registration and login using **JWT authentication**
- Create, edit, delete, and schedule posts
- Dashboard includes:
  - Total posts
  - Scheduled posts
  - Published posts
  - Posts grouped by platform (Bar Chart)
  - Upcoming scheduled posts
- Automatic publishing when scheduled time arrives
- Fully protected backend routes
- Input validation, error handling, and meaningful user feedback


---

## Pre-Created Test User

| Email             | Password |
|-------------------|----------|
| **user2@gmail.com** | **user02** |

---

##  Setup Instructions

###  Backend Setup

1. Navigate to the backend folder:
2. Install dependencies:

npm install


Create a .env file inside the backend directory:

MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000


Start backend server:

npm run dev


Backend API runs at:

http://localhost:5000/api

 Frontend Setup

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install



Run frontend development server:

npm start


Frontend runs at:

http://localhost:3000

Environment Variable Templates
Backend .env
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000

Frontend .env (optional)
REACT_APP_API_URL=http://localhost:5000/api


```bash
API Documentation
✔ Authentication Routes
Method	                 Endpoint	           Description	
POST	/auth/register	Register new user	{ email, password }
POST	/auth/login	Login user	{ email, password }
✔ Post Routes (Protected)
Method	                 Endpoint	            Description
GET	/posts	Fetch all posts (pagination supported)
POST	/posts	Create a new post
GET	/posts/:id	Get post by ID
PUT	/posts/:id	Update post
DELETE	/posts/:id	Delete post

✔ Dashboard Routes (Protected)
Method	                Endpoint               	Description
GET	/dashboard/stats	Summary stats for posts
GET	/dashboard/upcoming	Upcoming scheduled posts

Use the provided test user:

Email: user2@gmail.com
Password: user02
Then:
Login and open the dashboard
Create, update, delete posts
Observe automatic publishing of scheduled posts
