# KoinX Backend Assignment

This repository contains the KoinX Backend Internship Assignment, focusing on building a production-grade solution with clean code, scalable architecture, and best practices.

## Features

- **API Development**: Built using Node.js and Express.js.
- **Database Integration**: Utilizes MongoDB for data storage.
- **Cryptocurrency Data**: Fetches and processes cryptocurrency data from external APIs.
- **Docker Support**: Includes a Dockerfile for containerization.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios
- Docker

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB instance running locally or a cloud-based MongoDB URI.
- Docker (optional, for containerization).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/saketh-05/KoinX-Backend-Assignment.git
   cd KoinX-Backend-Assignment
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```env
   MONGODB_URI=your_mongodb_uri
   PORT=your_preferred_port
   ```

4. **Run the application**:

   ```bash
   npm start
   ```

   The server should now be running at `http://localhost:your_preferred_port`.

### Using Docker

1. **Build the Docker image**:

   ```bash
   docker build -t koinx-backend-assignment .
   ```

2. **Run the Docker container**:

   ```bash
   docker run -p your_preferred_port:your_preferred_port --env-file .env koinx-backend-assignment
   ```

## API Endpoints

- **GET** `/api/transactions/:address`: Fetches cryptocurrency transactions for a given address.
- **GET** `/api/balance/:address`: Retrieves the current balance for a given address.
- **GET** `/api/price`: Returns the current price of Ethereum.

## Deployment

The application is deployed and accessible at [koin-x-backend-assignment-self.vercel.app](https://koin-x-backend-assignment-self.vercel.app).

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

