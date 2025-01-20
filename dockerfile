# Start from the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 5004 (or the port your service uses)
EXPOSE 5004

# Start the application (ensure your app listens on port 5004)
CMD ["npm", "start"]
