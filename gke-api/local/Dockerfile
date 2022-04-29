FROM node                       #imagen base
WORKDIR /app                    # directorio de trabajo
COPY . .                        # copiar todos los archivos de app al directorio de trabajo
RUN npm install                 # instalar los paquetes de node
ENV GOOGLE_APPLICATION_CREDENTIALS="./storage.key.json"
EXPOSE 3000                     # exponer el puerto 3000 del contenedor
CMD [ "node", "index"]          # correr la api