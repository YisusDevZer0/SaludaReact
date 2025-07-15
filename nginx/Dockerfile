FROM nginx:alpine

# Copiar configuración personalizada
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Crear directorio para SSL
RUN mkdir -p /etc/nginx/ssl

# Exponer puertos
EXPOSE 80 443

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"] 