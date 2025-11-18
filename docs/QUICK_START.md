# 🚀 Guia Rápido de Início

## Instalação e Execução em 3 Passos

### 1️⃣ Clone e Entre no Projeto
```bash
git clone <seu-repositorio>
cd what-watch-next
```

### 2️⃣ Execute com Docker Compose
```bash
docker compose up
```

### 3️⃣ Acesse a Aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **PostgreSQL**: localhost:5432

Pronto! 🎉

## Comandos Docker Úteis

```bash
# Iniciar tudo
docker compose up

# Iniciar em background
docker compose up -d

# Parar todos os serviços
docker compose down

# Parar e remover volumes (limpa o banco)
docker compose down -v

# Ver logs de todos os serviços
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Rebuildar as imagens
docker compose build

# Rebuildar e iniciar
docker compose up --build
```

### Desenvolvimento Local (sem Docker)

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

## Estrutura de URLs da API

### Health Check
```
GET /api/health
```

### Filmes
```
GET    /api/movies          # Lista todos
GET    /api/movies/:id      # Busca por ID
POST   /api/movies          # Cria novo
PUT    /api/movies/:id      # Atualiza
DELETE /api/movies/:id      # Remove
```

### Perfis
```
GET    /api/profiles        # Lista todos
GET    /api/profiles/:id    # Busca por ID
POST   /api/profiles        # Cria novo
PUT    /api/profiles/:id    # Atualiza
```

## Próximos Passos

1. ✅ Projeto configurado e rodando
2. 📝 Adicionar banco de dados (MongoDB/PostgreSQL)
3. 🔐 Implementar autenticação (se necessário)
4. 🎬 Criar interface de adicionar filmes
5. 🎲 Implementar sistema de sorteio
6. 🔌 Integrar com APIs externas (TMDB, etc.)

## Dúvidas?

Consulte o [README.md](../README.md) principal para mais informações!

