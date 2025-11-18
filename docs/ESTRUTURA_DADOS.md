# 📊 Estrutura de Dados

Este documento descreve a estrutura de dados do What Watch Next usando PostgreSQL.

## 👤 Perfil (Profile)

**Tabela: `profiles`**

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  avatar VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Campos:**
- `id`: UUID único do perfil
- `name`: Nome do perfil (ex: "Você", "Ela")
- `avatar`: URL do avatar (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🎬 Filme/Série/Anime (Movie)

**Tabela: `movies`**

```sql
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('MOVIE', 'SERIES', 'ANIME')),
  description TEXT,
  poster VARCHAR,
  year INTEGER,
  duration INTEGER,  -- Duração em minutos (filmes) ou episódios (séries)
  genres TEXT[],     -- Array de gêneros
  rating DECIMAL(3,1),  -- Nota de 0 a 10
  priority VARCHAR DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  is_new BOOLEAN DEFAULT false,
  watched BOOLEAN DEFAULT false,
  watched_at TIMESTAMP,
  external_id VARCHAR,  -- ID da API externa (TMDB, etc.)
  added_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Campos:**
- `id`: UUID único do filme/série/anime
- `title`: Título
- `type`: Tipo (`MOVIE`, `SERIES`, `ANIME`)
- `description`: Descrição
- `poster`: URL do poster
- `year`: Ano de lançamento
- `duration`: Duração em minutos (filmes) ou número de episódios (séries)
- `genres`: Array de gêneros
- `rating`: Nota de 0 a 10
- `priority`: Prioridade (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- `isNew`: Marcação de "novo"
- `watched`: Já foi assistido?
- `watchedAt`: Data que foi assistido (se aplicável)
- `externalId`: ID da API externa (TMDB, etc.)
- `addedById`: ID do perfil que adicionou (Foreign Key)
- `addedAt`: Data de adição
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

**Relacionamentos:**
- `Movie` pertence a um `Profile` (many-to-one)
- `Profile` tem muitos `Movies` (one-to-many)

## 🎲 Sorteio (Draw)

**Nota:** Esta tabela será implementada na Fase 3 do projeto.

```sql
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  selected_movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  draw_type VARCHAR NOT NULL CHECK (draw_type IN ('RANDOM', 'PRIORITY', 'SMART')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE draw_participants (
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (draw_id, profile_id)
);
```

## 📝 Notas de Implementação

### Prioridades
- **LOW**: Baixa prioridade
- **MEDIUM**: Prioridade média (padrão)
- **HIGH**: Alta prioridade
- **URGENT**: Urgente (quer assistir logo!)

### Tipos de Conteúdo
- **MOVIE**: Filme
- **SERIES**: Série
- **ANIME**: Anime

### Tipo de Sorteio (Futuro)
- **RANDOM**: Sorteio completamente aleatório
- **PRIORITY**: Considera apenas prioridades
- **SMART**: Algoritmo inteligente que considera:
  - Prioridades
  - Data de adição (novos têm mais peso)
  - Preferências dos perfis
  - Histórico de assistidos

## 🗄️ Banco de Dados

**PostgreSQL** com **Prisma ORM**

### Comandos Úteis

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Abrir Prisma Studio (interface visual)
npm run prisma:studio
```

### Integração com APIs
- **TMDB (The Movie Database)**: Para filmes e séries
- **Jikan API**: Para animes
- Campos `externalId` e `poster` serão preenchidos automaticamente

