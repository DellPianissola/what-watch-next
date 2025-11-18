# 📚 Documentação da API - What Watch Next

## 🌐 Acessar Documentação Interativa

A documentação Swagger está disponível em:
**http://localhost:5000/docs**

## 📋 Endpoints Disponíveis

### Health Check

#### `GET /api/health`
Verifica se a API está funcionando.

**Resposta:**
```json
{
  "status": "ok",
  "message": "What Watch Next API is running"
}
```

---

### Movies (Filmes, Séries e Animes)

#### `GET /api/movies`
Lista todos os filmes, séries e animes cadastrados.

**Resposta:**
```json
{
  "movies": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Interestelar",
      "type": "movie",
      "description": "Um filme sobre viagem no tempo e espaço",
      "year": 2014,
      "duration": 169,
      "genres": ["Ficção Científica", "Drama"],
      "rating": 8.6,
      "priority": "high",
      "isNew": false,
      "watched": false
    }
  ]
}
```

#### `GET /api/movies/:id`
Busca um filme, série ou anime específico por ID.

**Parâmetros:**
- `id` (path) - ID do conteúdo

**Resposta:**
```json
{
  "movie": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Interestelar",
    "type": "movie",
    ...
  }
}
```

#### `POST /api/movies`
Adiciona um novo filme, série ou anime.

**Body:**
```json
{
  "title": "Interestelar",
  "type": "movie",
  "description": "Um filme sobre viagem no tempo e espaço",
  "year": 2014,
  "duration": 169,
  "genres": ["Ficção Científica", "Drama"],
  "rating": 8.6,
  "priority": "high",
  "isNew": false,
  "addedBy": "507f1f77bcf86cd799439012"
}
```

**Resposta:**
```json
{
  "message": "Filme criado com sucesso",
  "movie": { ... }
}
```

#### `PUT /api/movies/:id`
Atualiza um filme, série ou anime existente.

**Parâmetros:**
- `id` (path) - ID do conteúdo

**Body:** (mesmo formato do POST)

**Resposta:**
```json
{
  "message": "Filme atualizado com sucesso"
}
```

#### `DELETE /api/movies/:id`
Remove um filme, série ou anime.

**Parâmetros:**
- `id` (path) - ID do conteúdo

**Resposta:**
```json
{
  "message": "Filme removido com sucesso"
}
```

---

### Profiles (Perfis)

#### `GET /api/profiles`
Lista todos os perfis cadastrados.

**Resposta:**
```json
{
  "profiles": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Você",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/profiles/:id`
Busca um perfil específico por ID.

**Parâmetros:**
- `id` (path) - ID do perfil

**Resposta:**
```json
{
  "profile": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Você",
    ...
  }
}
```

#### `POST /api/profiles`
Cria um novo perfil.

**Body:**
```json
{
  "name": "Você",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Resposta:**
```json
{
  "message": "Perfil criado com sucesso",
  "profile": { ... }
}
```

#### `PUT /api/profiles/:id`
Atualiza um perfil existente.

**Parâmetros:**
- `id` (path) - ID do perfil

**Body:** (mesmo formato do POST)

**Resposta:**
```json
{
  "message": "Perfil atualizado com sucesso"
}
```

---

## 📊 Modelos de Dados

### Movie
```typescript
{
  id: string
  title: string
  type: 'movie' | 'series' | 'anime'
  description?: string
  poster?: string
  year?: number
  duration?: number
  genres?: string[]
  rating?: number (0-10)
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isNew: boolean
  addedBy: string
  addedAt: Date
  watched: boolean
  watchedAt?: Date
  externalId?: string
  createdAt: Date
  updatedAt: Date
}
```

### Profile
```typescript
{
  id: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔒 Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `404` - Não encontrado
- `500` - Erro interno do servidor

---

## 📝 Notas

- Todos os endpoints retornam JSON
- As datas são retornadas no formato ISO 8601
- IDs são strings (MongoDB ObjectId)
- A documentação completa e interativa está disponível em `/docs`

