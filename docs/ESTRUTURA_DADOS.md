# 📊 Estrutura de Dados

Este documento descreve a estrutura de dados planejada para o What Watch Next.

## 👤 Perfil (Profile)

```javascript
{
  id: string,
  name: string,              // Nome do perfil (ex: "Você", "Ela")
  avatar: string,            // URL do avatar (opcional)
  createdAt: Date,
  updatedAt: Date
}
```

## 🎬 Filme/Série/Anime (Movie)

```javascript
{
  id: string,
  title: string,             // Título
  type: 'movie' | 'series' | 'anime',
  description: string,       // Descrição
  poster: string,            // URL do poster
  year: number,              // Ano de lançamento
  duration: number,          // Duração em minutos (filmes) ou episódios (séries)
  genres: string[],          // Gêneros
  rating: number,            // Nota (0-10)
  priority: 'low' | 'medium' | 'high' | 'urgent',  // Prioridade
  isNew: boolean,            // Marcação de "novo"
  addedBy: string,           // ID do perfil que adicionou
  addedAt: Date,             // Data de adição
  watched: boolean,          // Já foi assistido?
  watchedAt: Date,           // Data que foi assistido (se aplicável)
  externalId: string,        // ID da API externa (TMDB, etc.)
  createdAt: Date,
  updatedAt: Date
}
```

## 🎲 Sorteio (Draw)

```javascript
{
  id: string,
  selectedMovie: string,     // ID do filme sorteado
  participants: string[],    // IDs dos perfis que participaram
  drawType: 'random' | 'priority' | 'smart',  // Tipo de sorteio
  createdAt: Date
}
```

## 📝 Notas de Implementação

### Prioridades
- **low**: Baixa prioridade
- **medium**: Prioridade média
- **high**: Alta prioridade
- **urgent**: Urgente (quer assistir logo!)

### Tipo de Sorteio
- **random**: Sorteio completamente aleatório
- **priority**: Considera apenas prioridades
- **smart**: Algoritmo inteligente que considera:
  - Prioridades
  - Data de adição (novos têm mais peso)
  - Preferências dos perfis
  - Histórico de assistidos

### Integração com APIs
- **TMDB (The Movie Database)**: Para filmes e séries
- **Jikan API**: Para animes
- Campos `externalId` e `poster` serão preenchidos automaticamente

