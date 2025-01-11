# Stage 1: Development
FROM node:18 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]

# Stage 2: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --prod

# Stage 3: Serve with Nginx
FROM nginx:alpine AS production

COPY --from=build /app/dist/Extended-Coding-Playgrounds /usr/share/nginx/html

EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
