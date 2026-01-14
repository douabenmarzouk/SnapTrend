
FROM node:18-alpine

# 1️⃣ Dossier de travail
WORKDIR /usr/src/app

# 2️⃣ Copier seulement les fichiers nécessaires pour npm install
COPY package*.json ./

# 3️⃣permet utiliser commande ng 
RUN npm install -g @angular/cli

# 4️⃣ Installer les dépendances du projet
RUN npm install

# 5️⃣ Copier le reste du projet
COPY . .

# 6️⃣ Exposer le port Angular
EXPOSE 4200

# 7️⃣ Lancer l’application Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
