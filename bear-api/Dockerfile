# Base image for development
FROM node:18-bullseye AS development

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose port for the API
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "start:dev"]
