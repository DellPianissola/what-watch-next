FROM node:18-alpine

WORKDIR /app

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
