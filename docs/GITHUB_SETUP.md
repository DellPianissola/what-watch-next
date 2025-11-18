# 🔐 Configuração do GitHub - Resolver Erro 403

## Problema
Erro 403 ao fazer push no GitHub geralmente significa problema de autenticação.

## Solução 1: Personal Access Token (PAT) - Recomendado

### Passo 1: Criar um Personal Access Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Dê um nome descritivo (ex: "GitAhead - What Watch Next")
4. Selecione o prazo de expiração (recomendo 90 dias ou "No expiration")
5. **Marque as permissões necessárias:**
   - ✅ `repo` (acesso completo aos repositórios)
   - ✅ `workflow` (se usar GitHub Actions)
6. Clique em **"Generate token"**
7. **COPIE O TOKEN IMEDIATAMENTE** (você não verá ele novamente!)

### Passo 2: Configurar no GitAhead

1. Abra o GitAhead
2. Vá em **Settings** → **Git** → **Authentication**
3. Configure:
   - **Username**: Seu username do GitHub (DellPianissola)
   - **Password**: Cole o **Personal Access Token** (não sua senha!)
4. Salve e tente fazer push novamente

### Passo 3: Ou configurar via linha de comando

```bash
# Configurar o token como senha
git config --global credential.helper store

# Na próxima vez que fizer push, use:
# Username: DellPianissola
# Password: [seu-token-aqui]
```

## Solução 2: Usar SSH (Alternativa)

### Passo 1: Gerar chave SSH (se ainda não tiver)

```bash
ssh-keygen -t ed25519 -C "dell.pianissola@outlook.com"
```

Pressione Enter para aceitar o local padrão e defina uma senha (opcional).

### Passo 2: Adicionar chave SSH ao GitHub

1. Copie sua chave pública:
```bash
# Windows
type %USERPROFILE%\.ssh\id_ed25519.pub

# Ou
cat ~/.ssh/id_ed25519.pub
```

2. Acesse: https://github.com/settings/keys
3. Clique em **"New SSH key"**
4. Cole a chave e salve

### Passo 3: Alterar remote para SSH

```bash
git remote set-url origin git@github.com:DellPianissola/what-watch-next.git
```

### Passo 4: Testar conexão

```bash
ssh -T git@github.com
```

Deve retornar: "Hi DellPianissola! You've successfully authenticated..."

## Solução 3: GitHub CLI (Mais fácil)

Se preferir, pode instalar o GitHub CLI:

```bash
# Instalar GitHub CLI
winget install GitHub.cli

# Autenticar
gh auth login

# Seguir as instruções na tela
```

## Verificar Configuração Atual

```bash
# Ver remote atual
git remote -v

# Ver configuração de usuário
git config user.name
git config user.email
```

## Dicas Importantes

⚠️ **NUNCA compartilhe seu Personal Access Token!**
⚠️ **NUNCA commite tokens no código!**
✅ Use `.gitignore` para proteger arquivos sensíveis
✅ Revogue tokens antigos que não usa mais

## Problemas Comuns

### "Authentication failed"
- Verifique se está usando o token correto (não a senha)
- Verifique se o token não expirou
- Verifique se o token tem permissão `repo`

### "Permission denied"
- Verifique se você tem permissão de escrita no repositório
- Verifique se o repositório existe e você tem acesso

### "Repository not found"
- Verifique se o nome do repositório está correto
- Verifique se você tem acesso ao repositório

