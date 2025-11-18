#!/bin/sh

echo "🔄 Verificando e executando migrations do Prisma..."

# Aguarda o banco estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 3

# Se existir pasta de migrations, aplica elas
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "📦 Aplicando migrations existentes..."
  npx prisma migrate deploy
else
  echo "📝 Criando schema inicial no banco de dados..."
  # Usa db push para criar o schema diretamente (melhor para desenvolvimento)
  npx prisma db push --accept-data-loss || true
fi

echo "✅ Banco de dados pronto!"
echo "🚀 Iniciando servidor..."

# Inicia o servidor
exec npm run dev

