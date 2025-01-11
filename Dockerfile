# Use a base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the backend service will run
EXPOSE 3000

# Start the backend service
ENTRYPOINT ["node", "server.js"]
