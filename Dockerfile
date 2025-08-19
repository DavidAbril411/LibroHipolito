# Dockerfile para Hipólito PWA
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Solo necesitamos las dependencias básicas (sin http-server)
RUN npm ci --only=production

# Copiar todos los archivos de la aplicación
COPY . .

# Exponer puerto
EXPOSE 8080

# Comando para iniciar la aplicación con servidor nativo
CMD ["npm", "start"]
