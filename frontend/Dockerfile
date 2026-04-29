# Stage 1 — build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# VITE_API_URL é injetada em build time (não funciona como env de runtime no nginx)
# Passar via --build-arg no docker build ou via build.args no compose
ARG VITE_API_URL

RUN npm run build

# Stage 2 — serve com nginx
FROM nginx:alpine

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Config customizada pra SPA (fallback pro index.html em qualquer rota)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build gerado pelo stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
