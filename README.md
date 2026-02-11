# Projedata Autoflex

Sistema de controle de estoque industrial para gerenciamento de produtos, materias-primas e sugestoes de producao.

## Tecnologias

**Backend**
- Java 17, Spring Boot 4.0, Spring Data JPA, Hibernate
- PostgreSQL 15, Flyway (migracao de banco)
- Bean Validation, Lombok
- SpringDoc OpenAPI (Swagger UI)
- Testes unitarios com JUnit

**Frontend**
- React 19, TypeScript, Vite
- Material UI (MUI), fonte Inter
- Redux Toolkit para gerenciamento de estado
- React Router para navegacao

## Pre-requisitos

- Java 17+
- Node.js 18+
- Docker e Docker Compose (para o banco de dados)

## Como executar

### 1. Banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe um PostgreSQL na porta 5432. As tabelas sao criadas automaticamente pelo Flyway ao iniciar o backend.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

A API estara disponivel em `http://localhost:8080`. A documentacao Swagger UI pode ser acessada em `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicacao estara disponivel em `http://localhost:5173`.

## Estrutura do projeto

```
projedata-autoflex/
  backend/
    src/main/java/com/autoflex/backend/
      controller/       # Endpoints REST
      service/          # Logica de negocio
      model/            # Entidades JPA
      dto/              # Request/Response DTOs
      repository/       # Repositorios Spring Data
      exception/        # Tratamento de erros
      config/           # Configuracoes (CORS)
    src/main/resources/
      db/migration/     # Scripts Flyway
      application.yaml  # Configuracoes da aplicacao
    src/test/           # Testes unitarios
  frontend/
    src/
      api/              # Clients HTTP
      components/       # Componentes reutilizaveis
      pages/            # Paginas (Products, RawMaterials, Suggestions)
      store/            # Redux slices
      types/            # Tipos TypeScript
  docker-compose.yml
```

## Funcionalidades

- **CRUD de Produtos** — cadastro com codigo, nome e preco
- **CRUD de Materias-Primas** — cadastro com codigo, nome e quantidade em estoque
- **Associacao Produto x Materia-Prima** — definicao das materias-primas necessarias para cada produto, com as respectivas quantidades
- **Sugestao de Producao** — calculo automatico de quais produtos podem ser produzidos com o estoque disponivel, priorizando os de maior valor

## Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/products | Lista todos os produtos |
| POST | /api/products | Cria um produto |
| GET | /api/products/{id} | Busca produto por ID |
| PUT | /api/products/{id} | Atualiza um produto |
| DELETE | /api/products/{id} | Remove um produto |
| GET | /api/raw-materials | Lista todas as materias-primas |
| POST | /api/raw-materials | Cria uma materia-prima |
| GET | /api/raw-materials/{id} | Busca materia-prima por ID |
| PUT | /api/raw-materials/{id} | Atualiza uma materia-prima |
| DELETE | /api/raw-materials/{id} | Remove uma materia-prima |
| GET | /api/products/{id}/materials | Lista materias-primas de um produto |
| PUT | /api/products/{id}/materials | Substitui materias-primas de um produto |
| GET | /api/production-suggestions | Retorna sugestoes de producao |
| GET | /api/health | Health check |
