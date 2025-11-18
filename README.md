# 🎬 What Watch Next

Uma aplicação moderna e divertida para casais escolherem o que assistir juntos! Com sistema de perfis, prioridades, sorteio inteligente e muito mais.

## ✨ Funcionalidades

### 🎯 Principais
- **Sistema de Perfis**: Cada pessoa pode adicionar seus próprios filmes, séries e animes
- **Categorias de Prioridade**: Organize seus favoritos por nível de importância
- **Sorteio Inteligente**: Algoritmo que considera preferências e prioridades
- **Avisos de Novidades**: Fique por dentro quando um filme novo é adicionado
- **Integração com APIs**: Preparado para integração com APIs públicas de filmes (TMDB, etc.)

### 🚀 Em Desenvolvimento
- Sistema de sorteio/jogo interativo
- Integração com APIs de filmes
- Histórico de assistidos
- Recomendações personalizadas
- Sistema de favoritos

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **CORS** - Cross-Origin Resource Sharing

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
what-watch-next/
├── frontend/              # Aplicação React
│   ├── src/
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── services/     # Serviços de API
│   │   ├── App.jsx       # Componente principal
│   │   └── main.jsx      # Entry point
│   ├── Dockerfile
│   └── package.json
├── backend/              # API Node.js
│   ├── routes/          # Rotas da API
│   ├── controllers/     # Lógica de negócio
│   ├── models/          # Modelos de dados
│   ├── server.js        # Servidor Express
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Configuração Docker
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- **Docker** e **Docker Compose** instalados

### Executar com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd what-watch-next
```

2. Execute tudo com um único comando:
```bash
docker compose up
```

3. Acesse:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Documentação Swagger**: http://localhost:5000/docs
- **MongoDB**: localhost:27017

### Comandos Docker Úteis

```bash
# Iniciar em background
docker compose up -d

# Parar todos os serviços
docker compose down

# Parar e remover volumes (limpa o banco de dados)
docker compose down -v

# Ver logs
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb

# Rebuildar as imagens
docker compose build

# Rebuildar e iniciar
docker compose up --build
```

### Desenvolvimento Local (Opcional - apenas para debug)

Se precisar debugar algo específico localmente:

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

## 🐳 Serviços Docker

O projeto inclui 3 serviços que são iniciados automaticamente:

1. **MongoDB** - Banco de dados (porta 27017)
2. **Backend** - API Node.js/Express (porta 5000)
3. **Frontend** - Aplicação React (porta 3000)

Todos os serviços são iniciados automaticamente com `docker compose up`.

## 📚 Documentação da API

A documentação completa da API está disponível em formato Swagger/OpenAPI:

### Acessar Documentação Interativa
**http://localhost:5000/docs**

A documentação Swagger permite:
- ✅ Visualizar todos os endpoints disponíveis
- ✅ Testar requisições diretamente no navegador
- ✅ Ver exemplos de requisições e respostas
- ✅ Entender os modelos de dados

### Documentação em Markdown
Também está disponível em: [`docs/API.md`](docs/API.md)

### Endpoints Principais

- `GET /api/health` - Health check
- `GET /api/movies` - Lista todos os filmes/séries/animes
- `POST /api/movies` - Adiciona novo conteúdo
- `GET /api/movies/:id` - Busca conteúdo por ID
- `PUT /api/movies/:id` - Atualiza conteúdo
- `DELETE /api/movies/:id` - Remove conteúdo
- `GET /api/profiles` - Lista todos os perfis
- `POST /api/profiles` - Cria novo perfil
- `GET /api/profiles/:id` - Busca perfil por ID
- `PUT /api/profiles/:id` - Atualiza perfil

### Scripts NPM (Opcional)

Se preferir usar npm scripts ao invés de comandos Docker diretos:

```bash
npm run up          # docker compose up
npm run up:build    # docker compose up --build
npm run up:d        # docker compose up -d
npm run down        # docker compose down
npm run down:v      # docker compose down -v
npm run logs        # docker compose logs -f
npm run build       # docker compose build
```

## 🎨 Design

A aplicação foi desenvolvida com foco em:
- **UI Moderna**: Design limpo e contemporâneo
- **UX Intuitiva**: Interface fácil de usar
- **Responsividade**: Funciona em todos os dispositivos
- **Animações Suaves**: Transições e efeitos visuais agradáveis
- **Tema Escuro**: Visual confortável para assistir

## 🔮 Próximos Passos

### Fase 1 - Estrutura Base ✅
- [x] Setup do projeto
- [x] Tela inicial
- [x] Docker configuration
- [x] Estrutura modular
- [x] Documentação Swagger/OpenAPI

### Fase 2 - Funcionalidades Core
- [ ] Sistema de perfis (criar, editar, gerenciar)
- [ ] CRUD de filmes/séries/animes
- [ ] Sistema de prioridades
- [ ] Marcação de "novo"
- [x] Banco de dados (MongoDB configurado)

### Fase 3 - Sorteio e Jogo
- [ ] Algoritmo de sorteio inteligente
- [ ] Interface de sorteio interativa
- [ ] Sistema de pontos/ranking
- [ ] Histórico de sorteados

### Fase 4 - Integrações
- [ ] Integração com TMDB API
- [ ] Busca de filmes/séries
- [ ] Informações detalhadas
- [ ] Posters e imagens

### Fase 5 - Features Avançadas
- [ ] Histórico de assistidos
- [ ] Recomendações baseadas em preferências
- [ ] Sistema de tags/categorias
- [ ] Export/Import de listas
- [ ] Compartilhamento

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT License - sinta-se livre para usar e modificar!

## 💝 Agradecimentos

Feito com ❤️ para assistir juntos!

---

**Desenvolvido com React, Node.js e muito carinho!** 🎬✨
