
# Wix Product Integration

This project is a full-stack application that integrates with the Wix API to manage products, supporting CRUD operations and synchronization with Wix.

## Features Implemented

- **Backend**:
  - CRUD operations for products (Create, Read, Update, Delete)
  - Synchronization with Wix products
  - Product caching using Redis to improve performance
  - PostgreSQL as the main database
  - Prisma ORM for database operations
  - Dockerized services for PostgreSQL and Redis using docker-compose
  - API endpoints secured with input validation using `class-validator` and `class-transformer`
  - Global Error Handling with a custom `HttpExceptionFilter` to manage and format errors consistently

- **Frontend**:
  - Vue 3 application with TypeScript
  - Element Plus UI library for styling and components
  - Product listing table
  - Create and Edit product modals
  - Sync products from Wix button
  - Select multiple products for deletion
  - Responsive and user-friendly UI

## Technologies Used

### Backend Stack
- **Node.js** with **NestJS** framework
- **Prisma ORM** for PostgreSQL
- **Redis** for caching
- **Docker** & **Docker Compose** for containerization
- **PostgreSQL** as the database
- **Axios** for HTTP requests to Wix API

### Frontend Stack
- **Vue 3** with **TypeScript**
- **Element Plus** for UI components
- **Vite** for building the frontend
- **Axios** for API communication

## How to Run the Project

### Prerequisites
- Docker installed
- Node.js and npm installed
- Nest.js installed

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file in the `server` directory with the following variables:
   ```env
   DATABASE_URL=postgres://postgres:example@localhost:5432/wix-catalog?schema=public
   WIX_API_KEY=your_wix_api_key_here
   WIX_SITE_ID=your_wix_site_id_here
   PORT=3000
   ```
3. Run database and redis services using Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the backend
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend application:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Notes
- Ensure the backend service is running before starting the frontend.
- The `.env` file is required for the backend to connect to the PostgreSQL database and Wix API.

