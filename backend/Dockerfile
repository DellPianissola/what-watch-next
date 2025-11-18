FROM node:18-alpine

WORKDIR /app

# Instala OpenSSL e outras dependências necessárias para o Prisma
RUN apk add --no-cache openssl libc6-compat

# Instala Prisma CLI globalmente
RUN npm install -g prisma

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o schema do Prisma
COPY prisma ./prisma

# Gera o Prisma Client
RUN npx prisma generate

# Copia o script de start
COPY start.sh ./

# Torna o script executável
RUN chmod +x start.sh

# Copia o resto dos arquivos
COPY . .

EXPOSE 5000

# Usa o script de entrypoint que executa migrations automaticamente
CMD ["./start.sh"]
