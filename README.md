# Sistema De Moeda Estudantil

## Descrição

Desenvolvimento de um sistema para estimular o reconhecimento do mérito estudantil através de uma moeda virtual. Essa moeda pode ser distribuída por professores aos seus alunos e trocada pelos alunos por produtos e descontos em empresas parceiras.

## Alunos

- Tiago Boaventura Amaral
- Kayque Allan Ribeiro Freitas

## Backend (Sprint 02)

Aplicação Spring Boot 3 (Java 17) com CRUD de Alunos e Empresas Parceiras usando Spring Data JPA e banco H2.

### Executar

1. Requisitos: Java 17, Maven 3.9+
2. Comandos:

```bash
mvn spring-boot:run
```

API disponível em `http://localhost:8080`.

### H2 Console

- Ativado em `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:moedaestudantil`
- User: `sa` (sem senha)

### Endpoints

- `POST /api/alunos`
- `GET /api/alunos`
- `GET /api/alunos/{id}`
- `PUT /api/alunos/{id}`
- `DELETE /api/alunos/{id}`

- `POST /api/empresas`
- `GET /api/empresas`
- `GET /api/empresas/{id}`
- `PUT /api/empresas/{id}`
- `DELETE /api/empresas/{id}`

## Frontend

Projeto React + Vite em `frontend/`.

### Rodando o frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação em `http://localhost:5173`.

Certifique-se de rodar o backend em `http://localhost:8080` (CORS habilitado para o frontend de dev).

### Observações

- Validações com Bean Validation em DTOs de requisição
- Tratamento global de erros com `@ControllerAdvice`
