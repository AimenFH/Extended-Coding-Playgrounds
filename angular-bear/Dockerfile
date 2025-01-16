# Development stage
FROM node:18-bullseye AS development

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose port for Angular dev server
EXPOSE 4200

# Start Angular dev server
CMD ["npm", "start"]
