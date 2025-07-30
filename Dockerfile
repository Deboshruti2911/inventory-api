# Use an official Node.js LTS base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (for better caching)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the entire project (including routes, models, etc.)
COPY . .

# Ensure environment variable PORT is used (insecure HTTP port)
ENV PORT=5000

# Expose the application port (default is 5000, override via -e PORT)
EXPOSE ${PORT}

# Start the server
CMD ["node", "server.js"]