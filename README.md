# API REST - Usuários e Tarefas

Uma API REST escalável construída com Elysia, TypeScript, Prisma e PostgreSQL.

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

## Configuração

1. Instale as dependências:
```bash
bun install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
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

## Exemplos de Teste da API

### Criando um Usuário

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@exemplo.com"
  }'
```

**Resposta Esperada:**
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

### Criando uma Tarefa

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finalizar documentação do projeto",
    "description": "Escrever documentação completa para o projeto da API REST",
    "status": "PENDENTE",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Finalizar documentação do projeto",
    "description": "Escrever documentação completa para o projeto da API REST",
    "status": "PENDENTE",
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

### Listando Usuários com Paginação

```bash
curl "http://localhost:3001/users?page=1&limit=10"
```

**Resposta Esperada:**
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

### Atualizando um Usuário

```bash
curl -X PUT http://localhost:3001/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Atualizado",
    "email": "joao.atualizado@exemplo.com"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Atualizado",
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

## Documentação

Acesse a documentação interativa com exemplos ao vivo em [http://localhost:3001/docs](http://localhost:3001/docs)

## Verificação de Saúde

Verifique se a API está saudável:
```bash
curl http://localhost:3001/health
```

**Resposta Esperada:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "database": "connected",
    "server": "running"
  },
  "meta": {
    "timestamp": "2024-01-15T10:50:00.000Z",
    "uptime": 120.5
  }
}
```

## Recursos Avançados

- Validação com Zod
- Paginação e filtros
- CORS configurado
- Tratamento centralizado de erros
- Registro de requisições
- Documentação OpenAPI/Swagger
- TypeScript modo estrito
- Formatação de código com Biome
- Arquitetura escalável (padrão Repository + Service)