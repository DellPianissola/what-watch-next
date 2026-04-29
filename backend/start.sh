#!/bin/sh
set -e

echo "[start] Aguardando PostgreSQL em $PGHOST:$PGPORT..."
PGHOST=${PGHOST:-postgres}
PGPORT=${PGPORT:-5432}

# Espera ativa em vez de sleep fixo
until nc -z "$PGHOST" "$PGPORT" 2>/dev/null; do
  sleep 1
done

echo "[start] Banco respondendo. Aplicando migrations..."

if [ -d "prisma/migrations" ] && [ -n "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  npx prisma migrate deploy
else
  echo "[start] Sem migrations — usando db push (criação inicial)"
  npx prisma db push --accept-data-loss
fi

echo "[start] Rodando seed (idempotente)..."
node prisma/seed.js || echo "[start] Seed falhou ou foi pulado"

# Em dev usa node --watch (hot reload). Em prod, exec direto.
if [ "$NODE_ENV" = "production" ]; then
  echo "[start] Iniciando servidor em modo produção..."
  exec node server.js
else
  echo "[start] Iniciando servidor em modo desenvolvimento (watch)..."
  exec node --watch server.js
fi
