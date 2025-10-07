# API REST - Users and Tasks

API REST escalável construída com Elysia, TypeScript, Prisma e PostgreSQL.

## Links Importantes

- **Produção**: [https://rest-api-bun.onrender.com](https://rest-api-bun.onrender.com)
- **Documentação (Swagger)**: [https://rest-api-bun.onrender.com/docs](https://rest-api-bun.onrender.com/docs)
- **Health Check**: [https://rest-api-bun.onrender.com/health](https://rest-api-bun.onrender.com/health)

## Funcionalidades

### Usuários
- `POST /users` - Criar novo usuário
- `GET /users` - Listar todos os usuários (com paginação e filtros)
- `GET /users/:id` - Obter usuário específico
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

### Tarefas
- `POST /tasks` - Criar nova tarefa vinculada a um usuário
- `GET /tasks` - Listar todas as tarefas (com nome do usuário associado)
- `GET /tasks/:id` - Obter tarefa específica
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa
- `GET /tasks/statistics` - Estatísticas das tarefas
- `GET /tasks/user/:userId` - Obter tarefas por usuário

## Arquitetura

```
src/
├── config/          # Configurações (env, etc)
├── lib/             # Bibliotecas compartilhadas (banco de dados, repositório-base)
├── middleware/      # Middlewares globais
├── schemas/         # Schemas de validação Zod
├── types/           # Tipos TypeScript
└── modules/
    ├── users/
    │   ├── controllers/  # Controladores
    │   ├── useCases/     # Serviços/Casos de Uso
    │   ├── repositories/ # Repositórios
    │   └── routes.ts     # Rotas
    └── tasks/
        ├── controllers/
        ├── useCases/
        ├── repositories/
        └── routes.ts
```

## Configuração Local

### Pré-requisitos

- [Bun](https://bun.sh/) instalado
- [Docker](https://www.docker.com/) e Docker Compose
- PostgreSQL (via Docker ou local)

### Instalação

1. Clone o repositório e instale as dependências:
```bash
bun install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco"
PORT=3001
NODE_ENV=development
```

3. Inicie o PostgreSQL com Docker:
```bash
docker-compose up -d
```

4. Gere o Client Prisma e execute as migrações:
```bash
bun run db:generate
bun run db:migrate
```

5. Inicie o servidor de desenvolvimento:
```bash
bun run dev
```

A API estará disponível em `http://localhost:3001`

## Exemplos de Uso da API

> **Nota**: Os exemplos abaixo usam a URL de produção. Para testar localmente, substitua `https://rest-api-bun.onrender.com` por `http://localhost:3001`

### Verificação de Saúde

Verifique se a API está funcionando:

```bash
curl https://rest-api-bun.onrender.com/health
```

**Resposta:**
```json
{
  "success": true,
  "status": "saudável",
  "services": {
    "database": "conectado",
    "server": "rodando"
  },
  "meta": {
    "timestamp": "2024-01-15T10:50:00.000Z",
    "uptime": 120.5
  }
}
```

### Criando um Usuário

```bash
curl -X POST https://rest-api-bun.onrender.com/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@exemplo.com"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao.silva@exemplo.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Usuário criado com sucesso",
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Listando Usuários com Paginação

```bash
curl "https://rest-api-bun.onrender.com/users?page=1&limit=10"
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao.silva@exemplo.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2024-01-15T10:40:00.000Z"
  }
}
```

### Buscando um Usuário Específico

```bash
curl https://rest-api-bun.onrender.com/users/550e8400-e29b-41d4-a716-446655440000
```

### Atualizando um Usuário

```bash
curl -X PUT https://rest-api-bun.onrender.com/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.atualizado@exemplo.com"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva Atualizado",
    "email": "joao.atualizado@exemplo.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  },
  "message": "Usuário atualizado com sucesso",
  "meta": {
    "timestamp": "2024-01-15T10:45:00.000Z"
  }
}
```

### Deletando um Usuário

```bash
curl -X DELETE https://rest-api-bun.onrender.com/users/550e8400-e29b-41d4-a716-446655440000
```

### Criando uma Tarefa

```bash
curl -X POST https://rest-api-bun.onrender.com/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finalizar documentação do projeto",
    "description": "Escrever documentação completa para o projeto da API REST",
    "status": "PENDING",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Finalizar documentação do projeto",
    "description": "Escrever documentação completa para o projeto da API REST",
    "status": "PENDING",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  "message": "Tarefa criada com sucesso",
  "meta": {
    "timestamp": "2024-01-15T10:35:00.000Z"
  }
}
```

### Listando Tarefas com Filtros

```bash
# Todas as tarefas
curl "https://rest-api-bun.onrender.com/tasks?page=1&limit=10"

# Tarefas pendentes
curl "https://rest-api-bun.onrender.com/tasks?status=PENDING"

# Tarefas de um usuário específico
curl "https://rest-api-bun.onrender.com/tasks?userId=550e8400-e29b-41d4-a716-446655440000"

# Busca por texto
curl "https://rest-api-bun.onrender.com/tasks?search=documentação"

# Ordenação
curl "https://rest-api-bun.onrender.com/tasks?sortBy=createdAt&sortOrder=desc"
```

### Obtendo Estatísticas das Tarefas

```bash
curl https://rest-api-bun.onrender.com/tasks/statistics
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "pending": 15,
    "done": 10,
    "completionRate": 40
  },
  "meta": {
    "timestamp": "2024-01-15T12:00:00.000Z"
  }
}
```

### Buscando Tarefas de um Usuário

```bash
curl https://rest-api-bun.onrender.com/tasks/user/550e8400-e29b-41d4-a716-446655440000
```

### Atualizando uma Tarefa

```bash
curl -X PUT https://rest-api-bun.onrender.com/tasks/660e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Documentação finalizada",
    "status": "DONE"
  }'
```

### Deletando uma Tarefa

```bash
curl -X DELETE https://rest-api-bun.onrender.com/tasks/660e8400-e29b-41d4-a716-446655440001
```

## 🔍 Parâmetros de Query

### Paginação
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máximo: 100)

### Filtros para Usuários
- `search` - Busca por nome ou email
- `sortBy` - Campo para ordenação: `name`, `email`, `createdAt`
- `sortOrder` - Ordem: `asc` ou `desc`

### Filtros para Tarefas
- `search` - Busca no título e descrição
- `status` - Filtra por status: `PENDING`, `IN_PROGRESS`, `DONE`
- `userId` - Filtra por ID do usuário
- `sortBy` - Campo para ordenação: `title`, `status`, `createdAt`
- `sortOrder` - Ordem: `asc` ou `desc`

## Tecnologias Utilizadas

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia](https://elysiajs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: PostgreSQL (hospedado no [Supabase](https://supabase.com/))
- **Validação**: [Zod](https://zod.dev/)
- **Documentação**: Swagger/OpenAPI
- **Deploy**: [Render](https://render.com/)

## Recursos

- ✅ Validação de dados com Zod
- ✅ Paginação e filtros avançados
- ✅ CORS configurado
- ✅ Tratamento centralizado de erros
- ✅ Registro de requisições (logs)
- ✅ Documentação OpenAPI/Swagger interativa
- ✅ TypeScript em modo estrito
- ✅ Formatação de código com Biome
- ✅ Arquitetura escalável (Repository Pattern + Service Layer)
- ✅ Mensagens de erro em português
- ✅ Health check endpoint

## Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev

# Produção
bun run start

# Gerar Prisma Client
bun run db:generate

# Executar migrations
bun run db:migrate

# Abrir Prisma Studio
bun run db:studio

# Formatação de código
bun run format
```

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

**Guilherme Alves de Souza**
- Email: 97guilherme.alves@gmail.com
- GitHub: [@guiialves](https://github.com/guiialves)
