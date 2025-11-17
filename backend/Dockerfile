FROM node:18-alpine

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto dos arquivos
COPY . .

EXPOSE 5000

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "dev"]

