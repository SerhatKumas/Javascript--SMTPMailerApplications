# This instruction specifies the base image for your build. 
# Every Docker image must start with a FROM instruction, defining the initial operating system and core software.
FROM node:18-alpine

# This instruction sets the working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]