# Stage 1: Development
FROM node:18 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables for development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 4200

CMD ["npm", "start"]

# Stage 2: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables for build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build --prod

# Stage 3: Serve with Nginx
FROM nginx:alpine AS production

COPY --from=build /app/dist/Extended-Coding-Playgrounds /usr/share/nginx/html

# Set environment variables for production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
