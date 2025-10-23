# Sistema De Moeda Estudantil

## Descrição

Desenvolvimento de um sistema para estimular o reconhecimento do mérito estudantil através de uma moeda virtual. Essa moeda pode ser distribuída por professores aos seus alunos e trocada pelos alunos por produtos e descontos em empresas parceiras.

## Alunos

- Tiago Boaventura Amaral
- Kayque Allan Ribeiro Freitas

## Backend (Sprint 02)

Aplicação Spring Boot 3 (Java 17) com CRUD de Alunos, Empresas Parceiras e Instituições de Ensino usando Spring Data JPA e banco H2 em memória.

### Pré-requisitos

- Java 17 ou superior
- Maven 3.9+
- IDE de sua preferência (IntelliJ IDEA, Eclipse, VS Code)

### Executar a Aplicação

1. **Clone o repositório** (se ainda não fez):

```bash
git clone <url-do-repositorio>
cd LAB03-SistemaDeMoedaEstudantil
```

2. **Execute a aplicação**:

```bash
mvn spring-boot:run
```

3. **Acesse a aplicação**:

- API disponível em: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`

### Banco de Dados H2

O sistema utiliza o banco H2 em memória com as seguintes configurações:

#### Configuração de Acesso ao H2 Console

- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:moedaestudantil`
- **Username**: `sa`
- **Password**: (deixe em branco)

#### Estrutura do Banco de Dados

**Tabela: `usuarios` (tabela base)**

- `id` (BIGINT, PK, AUTO_INCREMENT)
- `nome` (VARCHAR, NOT NULL)
- `email` (VARCHAR, NOT NULL, UNIQUE)
- `senha` (VARCHAR, NOT NULL)

**Tabela: `alunos` (herda de usuarios)**

- `id` (BIGINT, PK, FK para usuarios)
- `cpf` (VARCHAR, NOT NULL, UNIQUE)
- `rg` (VARCHAR, NOT NULL)
- `endereco` (VARCHAR, NOT NULL)
- `curso` (VARCHAR, NOT NULL)
- `saldo_moedas` (DOUBLE, NOT NULL, DEFAULT 0.0)
- `instituicao_ensino_id` (BIGINT, FK para instituicoes_ensino)

**Tabela: `empresas_parceiras` (herda de usuarios)**

- `id` (BIGINT, PK, FK para usuarios)
- `cnpj` (VARCHAR, NOT NULL, UNIQUE)

**Tabela: `instituicoes_ensino`**

- `id` (BIGINT, PK, AUTO_INCREMENT)
- `nome` (VARCHAR, NOT NULL)

#### Dados Iniciais

O sistema já vem com dados de exemplo carregados automaticamente:

- 3 instituições de ensino pré-cadastradas (UFMG, PUC-MG, ITA)

### Endpoints da API

#### Alunos

- `POST /api/alunos` - Criar novo aluno
- `GET /api/alunos` - Listar todos os alunos
- `GET /api/alunos/{id}` - Buscar aluno por ID
- `PUT /api/alunos/{id}` - Atualizar aluno
- `DELETE /api/alunos/{id}` - Deletar aluno

#### Empresas Parceiras

- `POST /api/empresas` - Criar nova empresa
- `GET /api/empresas` - Listar todas as empresas
- `GET /api/empresas/{id}` - Buscar empresa por ID
- `PUT /api/empresas/{id}` - Atualizar empresa
- `DELETE /api/empresas/{id}` - Deletar empresa

#### Instituições de Ensino

- `POST /api/instituicoes` - Criar nova instituição
- `GET /api/instituicoes` - Listar todas as instituições
- `GET /api/instituicoes/{id}` - Buscar instituição por ID
- `PUT /api/instituicoes/{id}` - Atualizar instituição
- `DELETE /api/instituicoes/{id}` - Deletar instituição

## Frontend

Projeto React + TypeScript + Vite localizado na pasta `frontend/`.

### Executar o Frontend

1. **Navegue para a pasta do frontend**:

```bash
cd frontend
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Execute o servidor de desenvolvimento**:

```bash
npm run dev
```

4. **Acesse a aplicação**:

- Frontend disponível em: `http://localhost:5173`

### Configuração

- O frontend está configurado para se comunicar com o backend em `http://localhost:8080`
- CORS está habilitado no backend para permitir requisições do frontend de desenvolvimento
- Certifique-se de que o backend esteja rodando antes de acessar o frontend

## Características Técnicas

### Backend

- **Framework**: Spring Boot 3.3.3
- **Java**: 17
- **Banco de Dados**: H2 (em memória)
- **ORM**: Spring Data JPA / Hibernate
- **Validação**: Bean Validation
- **Tratamento de Erros**: Global Exception Handler com `@ControllerAdvice`

### Frontend

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS puro

### Observações Importantes

- O banco H2 é em memória, então os dados são perdidos quando a aplicação é reiniciada
- O sistema carrega automaticamente dados iniciais de instituições de ensino
- Todas as validações são feitas tanto no frontend quanto no backend
- O sistema suporta herança de entidades (Aluno e EmpresaParceira herdam de Usuario)
