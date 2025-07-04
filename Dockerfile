# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy all source code first
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]
