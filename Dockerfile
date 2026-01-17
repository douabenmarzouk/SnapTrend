# =========================
# STAGE 1 : BUILD ANGULAR
# =========================
FROM node:20-alpine AS build
WORKDIR /app
# Copier seulement les fichiers nécessaires
COPY package*.json ./
RUN npm ci
# Copier le reste du code
COPY . .
# Build Angular (prod)
RUN npm run build -- --configuration production
# =========================
# STAGE 2 : NGINX (PROD)
# =========================
FROM nginx:alpine
# Supprimer config nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier la config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copier uniquement le build Angular
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
