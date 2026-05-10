# Laki Arts - Full Stack Art Marketplace

This project consists of three parts:
1.  **Server**: Node.js/Express API with MongoDB and Cloudinary.
2.  **Client**: React.js storefront for customers.
3.  **Admin**: React.js dashboard for the artist.

## Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account (Free)
- Cloudinary Account (Free)

## Setup Instructions

### 1. Backend Setup
1.  Go to `server` directory.
2.  Create a `.env` file based on `.env.example`.
3.  Fill in your `MONGODB_URI` and `CLOUDINARY` credentials.
4.  Run `npm install`.
5.  Run `npm run seed` to initialize the database with an admin user and default settings.
6.  Run `npm run dev` to start the server.

### 2. Storefront Setup (Client)
1.  Go to `client` directory.
2.  Run `npm install`.
3.  Run `npm start`.
4.  Open [http://localhost:3000](http://localhost:3000).

### 3. Admin Panel Setup
1.  Go to `admin` directory.
2.  Run `npm install`.
3.  Run `npm start`.
4.  Open [http://localhost:3001](http://localhost:3001).

## Admin Credentials
By default (after seeding):
- **Email**: `admin@lakiarts.com`
- **Password**: `Admin@123`
*(You can change these in the `server/.env` before seeding or via the database later.)*
