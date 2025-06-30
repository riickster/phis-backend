# Usa una imagen oficial de Node.js como base
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --only=production

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que tu app escuchará (importante para Cloud Run)
EXPOSE 4000

# Especifica el comando para arrancar la app
CMD [ "node", "src/index.js" ]
