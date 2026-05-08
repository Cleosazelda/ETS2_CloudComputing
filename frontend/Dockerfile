# Stage 1: Build React App
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Hapus default nginx index page
RUN rm -rf /usr/share/nginx/html/*
# Salin build output ke direktori nginx
COPY --from=build /app/dist /usr/share/nginx/html
# (Opsional) Salin custom nginx.conf jika ada konfigurasi khusus React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
