FROM node:18-alpine

WORKDIR /app

# Instala OpenSSL e outras dependências necessárias para o Prisma
RUN apk add --no-cache openssl libc6-compat

# Instala Prisma CLI globalmente (opcional, mas útil)
RUN npm install -g prisma

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o schema do Prisma
COPY prisma ./prisma

# Gera o Prisma Client
RUN npx prisma generate

# Copia o resto dos arquivos
COPY . .

EXPOSE 5000

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "dev"]
