FROM node:20-alpine

WORKDIR /app

# OpenSSL para Prisma, netcat para o start.sh esperar o banco
RUN apk add --no-cache openssl libc6-compat netcat-openbsd

# Prisma CLI global
RUN npm install -g prisma

# Dependências (cache layer separado)
COPY package.json package-lock.json ./
RUN npm install

# Schema + Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Resto do código
COPY . .
RUN chmod +x start.sh

EXPOSE 5000
CMD ["./start.sh"]
