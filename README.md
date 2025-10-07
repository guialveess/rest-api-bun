

# REST API - Users & Tasks

Uma API REST escalável construída com Elysia, TypeScript, Prisma e PostgreSQL.

## 🚀 Funcionalidades

### Users
- `POST /users` - Criar novo usuário
- `GET /users` - Listar todos os usuários (com paginação e filtros)
- `GET /users/:id` - Buscar usuário específico
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Tasks
- `POST /tasks` - Criar nova tarefa vinculada a um usuário
- `GET /tasks` - Listar todas as tarefas (com nome do usuário associado)
- `GET /tasks/:id` - Buscar tarefa específica
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `GET /tasks/statistics` - Estatísticas das tarefas
- `GET /tasks/user/:userId` - Buscar tarefas por usuário

## 🏗️ Arquitetura

```
src/
├── config/          # Configurações (env, etc)
├── lib/             # Bibliotecas compartilhadas (database, base-repository)
├── middleware/      # Middlewares globais
├── schemas/         # Schemas de validação Zod
├── types/           # Tipos TypeScript
└── modules/
    ├── users/
    │   ├── controllers/  # Controllers
    │   ├── repositories/ # Repositories
    │   ├── useCases/     # Services/Use Cases
    └── tasks/
        ├── controllers/
        ├── repositories/
        ├── useCases/
```

## 🛠️ Setup

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

4. Gere o Prisma Client e rode as migrações:
```bash
bun run db:generate
bun run db:migrate
```

5. Inicie o servidor de desenvolvimento:
```bash
bun run dev
```

## 📚 Documentação

Acesse a documentação interativa em [http://localhost:3000/docs](http://localhost:3000/docs)

## 🧪 Health Check

Verifique se a API está saudável:
```bash
curl http://localhost:3000/health
```

## 📊 Features Avançadas

- ✅ Validação com Zod
- ✅ Paginação e filtros
- ✅ CORS configurado
- ✅ Error handling centralizado
- ✅ Logging de requisições
- ✅ OpenAPI/Swagger documentation
- ✅ TypeScript strict mode
- ✅ Code formatting com Biome
- ✅ Arquitetura escalável (Repository + Service pattern)
