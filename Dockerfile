# Dockerfile para Hipólito PWA
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias (incluye http-server)
RUN npm ci

# Copiar todos los archivos de la aplicación
COPY . .

# Exponer puerto
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]
