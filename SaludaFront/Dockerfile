# Usar imagen de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Instalar dependencias primero (mejora el caching de Docker)
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo con hot reload
CMD ["npm", "start"]