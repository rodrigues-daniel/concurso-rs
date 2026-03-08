# bun-react-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.3.9. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
# 📚 Concursos — Sistema de Estudos para Concursos Públicos

Sistema fullstack para estudo de concursos públicos composto por dois repositórios independentes:

- **[concursos-api](#-backend--concursos-api)** — Backend em Rust + Axum + PostgreSQL
- **[concursos-web](#️-frontend--concursos-web)** — Frontend em React + TypeScript + Vite + Bun

---

## 🗂 Sumário

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [🦀 Backend — concursos-api](#-backend--concursos-api)
  - [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
  - [Variáveis de Ambiente — API](#-variáveis-de-ambiente--api)
  - [Executar em Desenvolvimento — API](#-executar-em-desenvolvimento--api)
  - [Endpoints da API](#-endpoints-da-api)
- [⚛️ Frontend — concursos-web](#️-frontend--concursos-web)
  - [Inicialização do Projeto do Zero](#-inicialização-do-projeto-do-zero)
  - [Variáveis de Ambiente — Web](#-variáveis-de-ambiente--web)
  - [Executar em Desenvolvimento — Web](#-executar-em-desenvolvimento--web)
  - [Páginas do Frontend](#-páginas-do-frontend)
- [🚀 Produção com Docker](#-produção-com-docker)
- [Dados Iniciais](#-dados-iniciais)
- [Decisões Técnicas](#-decisões-técnicas)

---

## 🌐 Visão Geral

Sistema didático para estudo de concursos públicos que permite ao usuário navegar por bancas, concursos e assuntos, além de responder questões de múltipla escolha com feedback imediato de acerto ou erro e placar ao final do simulado.

```
Browser  ──▶  React SPA (Bun + Vite)  ──▶  Rust/Axum API  ──▶  PostgreSQL
```

---

## 🛠 Stack Tecnológica

### Backend — concursos-api

| Função             | Tecnologia         |
|--------------------|--------------------|
| Linguagem          | Rust 1.78          |
| Framework HTTP     | Axum 0.7           |
| Runtime Assíncrono | Tokio              |
| Query Builder      | SQLx 0.7           |
| Banco de Dados     | PostgreSQL 16      |
| Migrations         | SQLx Migrate       |
| Serialização       | Serde + serde_json |
| Container          | Docker             |

### Frontend — concursos-web

| Função            | Tecnologia              |
|-------------------|-------------------------|
| Linguagem         | TypeScript 5            |
| Framework UI      | React 18                |
| Runtime / Package | Bun 1.1                 |
| Bundler           | Vite 5 (via Bun)        |
| Roteamento        | React Router DOM 6      |
| HTTP Client       | Axios                   |
| Estilização       | CSS Modules             |
| Tipografia        | Syne + Instrument Sans  |
| Servidor (prod)   | NGINX                   |
| Container         | Docker                  |

---

## 🏛 Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                          PRODUÇÃO                               │
│                                                                 │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐  │
│   │    NGINX    │────▶│  React SPA  │     │   Rust / Axum   │  │
│   │  (reverse   │     │  (estático) │     │   (API REST)    │  │
│   │   proxy)    │────▶│   porta 80  │     │   porta 3000    │  │
│   └─────────────┘     └─────────────┘     └─────────────────┘  │
│          │                                        │             │
│          └────────────────────────────────────────┘            │
│                              │                                  │
│                    ┌─────────────────┐                          │
│                    │   PostgreSQL    │                          │
│                    │   porta 5432    │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de requisição

```
Browser
  │
  ▼
NGINX :80
  ├── /         ──▶  serve index.html  (React SPA)
  ├── /assets/* ──▶  JS/CSS com cache de 1 ano
  └── /api/*    ──▶  proxy_pass concursos-api:3000
                            │
                            ▼
                      Rust / Axum
                            │
                            ▼
                        PostgreSQL
```

---

## 📁 Estrutura de Pastas

### concursos-api

```
concursos-api/
├── .env.example
├── .env.prod.example
├── .gitignore
├── Cargo.toml
├── Cargo.lock
├── Dockerfile
├── docker-compose.yml
├── migrations/
│   ├── 001_create_schema.sql
│   └── 002_seed_data.sql
└── src/
    ├── main.rs
    ├── db.rs
    ├── error.rs
    ├── models.rs
    └── routes/
        ├── mod.rs
        ├── bancas.rs
        ├── concursos.rs
        ├── assuntos.rs
        └── questoes.rs
```

### concursos-web

```
concursos-web/
├── .env.example
├── .env.prod.example
├── .gitignore
├── Dockerfile
├── bun.lockb
├── index.html
├── nginx/
│   └── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/
    │   └── index.ts
    ├── api/
    │   ├── client.ts
    │   ├── bancas.ts
    │   ├── concursos.ts
    │   ├── assuntos.ts
    │   └── questoes.ts
    ├── hooks/
    │   └── useFetch.ts
    ├── components/
    │   ├── Layout.tsx
    │   ├── Layout.module.css
    │   ├── Card.tsx
    │   ├── Card.module.css
    │   ├── Loading.tsx
    │   ├── Loading.module.css
    │   ├── Badge.tsx
    │   ├── Badge.module.css
    │   ├── Erro.tsx
    │   └── Erro.module.css
    ├── pages/
    │   ├── InicioPage.tsx
    │   ├── InicioPage.module.css
    │   ├── BancasPage.tsx
    │   ├── ConcursosPage.tsx
    │   ├── AssuntosPage.tsx
    │   ├── QuestoesPage.tsx
    │   ├── QuestoesPage.module.css
    │   └── ListaPage.module.css
    └── styles/
        └── global.css
```

---

## ✅ Pré-requisitos

| Ferramenta     | Versão mínima | Instalação                                      |
|----------------|---------------|-------------------------------------------------|
| Rust           | 1.78          | https://rustup.rs                               |
| Bun            | 1.1           | `curl -fsSL https://bun.sh/install \| bash`     |
| PostgreSQL     | 16            | https://www.postgresql.org/download             |
| Docker         | 24            | https://docs.docker.com/get-docker              |
| Docker Compose | 2.24          | Incluído no Docker Desktop                      |

---

## 🦀 Backend — concursos-api

### 🐘 Configuração do Banco de Dados

#### Com Docker (recomendado)

```bash
docker run --name concursos-db \
  -e POSTGRES_DB=concursos_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Manualmente

```sql
CREATE DATABASE concursos_db;
```

> As tabelas e dados iniciais são criados automaticamente pelas migrations SQLx na primeira execução da API.

---

### 🔑 Variáveis de Ambiente — API

Crie o arquivo `.env` na raiz de `concursos-api/`:

```env
# concursos-api/.env  (desenvolvimento)

DATABASE_URL=postgres://postgres:postgres@localhost:5432/concursos_db
HOST=0.0.0.0
PORT=3000
RUST_LOG=debug
```

Para produção, crie `.env.prod`:

```env
# concursos-api/.env.prod  (produção)

POSTGRES_DB=concursos_db
POSTGRES_USER=concursos_user
POSTGRES_PASSWORD=SenhaForteAqui123!
DATABASE_URL=postgres://concursos_user:SenhaForteAqui123!@postgres:5432/concursos_db
HOST=0.0.0.0
PORT=3000
RUST_LOG=info
```

> ⚠️ Nunca versione `.env` ou `.env.prod` com credenciais reais. Apenas os arquivos `.env.example` devem ir para o repositório.

---

### ▶️ Executar em Desenvolvimento — API

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/concursos-api
cd concursos-api

# 2. Configure o ambiente
cp .env.example .env
# edite o .env com suas credenciais

# 3. Execute a API
cargo run

# A API estará disponível em:
# http://localhost:3000
```

---

### 📡 Endpoints da API

#### Bancas

| Método | Rota              | Descrição             |
|--------|-------------------|-----------------------|
| GET    | `/api/bancas`     | Lista todas as bancas |
| GET    | `/api/bancas/:id` | Busca banca por ID    |

#### Concursos

| Método | Rota                        | Descrição                  |
|--------|-----------------------------|----------------------------|
| GET    | `/api/concursos`            | Lista todos os concursos   |
| GET    | `/api/concursos?banca_id=1` | Filtra concursos por banca |
| GET    | `/api/concursos/:id`        | Busca concurso por ID      |

#### Assuntos

| Método | Rota                | Descrição               |
|--------|---------------------|-------------------------|
| GET    | `/api/assuntos`     | Lista todos os assuntos |
| GET    | `/api/assuntos/:id` | Busca assunto por ID    |

#### Questões

| Método | Rota                                       | Descrição                     |
|--------|--------------------------------------------|-------------------------------|
| GET    | `/api/questoes`                            | Lista todas as questões       |
| GET    | `/api/questoes?concurso_id=1`              | Filtra por concurso           |
| GET    | `/api/questoes?assunto_id=2`               | Filtra por assunto            |
| GET    | `/api/questoes?concurso_id=1&assunto_id=2` | Filtra por concurso e assunto |
| GET    | `/api/questoes/:id`                        | Busca questão por ID          |
| POST   | `/api/questoes/:id/validar`                | Valida resposta do usuário    |

#### Exemplo — POST `/api/questoes/1/validar`

**Request:**
```json
{ "resposta": "A" }
```

**Response:**
```json
{
  "correta": true,
  "alternativa_correta": "A"
}
```

---

## ⚛️ Frontend — concursos-web

### 🚀 Inicialização do Projeto do Zero

Execute os comandos abaixo para criar e configurar o projeto com Bun:

```bash
# 1. Instalar o Bun (caso não tenha)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc   # ou ~/.zshrc se usar Zsh

# Verificar instalação
bun --version

# 2. Criar o projeto com Vite via Bun
bunx create-vite concursos-web --template react-ts
cd concursos-web

# 3. Instalar dependências de produção
bun add react-router-dom axios @fontsource/syne @fontsource/instrument-sans

# 4. Instalar dependências de desenvolvimento
bun add -d @types/react @types/react-dom eslint

# 5. Remover arquivos padrão do Vite que não serão usados
rm -rf src/assets src/App.css src/index.css

# 6. Criar estrutura de pastas
mkdir -p src/api src/types src/components src/pages src/styles src/hooks nginx

# 7. Criar arquivos de ambiente
echo "VITE_API_URL=http://localhost:3000" > .env
cp .env .env.example

# 8. Rodar o projeto em desenvolvimento
bun run dev
# http://localhost:5173
```

---

### 🔑 Variáveis de Ambiente — Web

```env
# concursos-web/.env  (desenvolvimento)
VITE_API_URL=http://localhost:3000
```

```env
# concursos-web/.env.prod  (produção)
# Deixar vazio — o NGINX resolve via proxy reverso
VITE_API_URL=
```

---

### ▶️ Executar em Desenvolvimento — Web

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/concursos-web
cd concursos-web

# 2. Instalar dependências com Bun
bun install

# 3. Configure o ambiente
cp .env.example .env

# 4. Rodar em desenvolvimento
bun run dev
# http://localhost:5173

# Outros comandos disponíveis:
bun run build    # build de produção
bun run preview  # preview do build
bun run lint     # verificar código
```

---

### 🖥 Páginas do Frontend

| Rota         | Página        | Descrição                                            |
|--------------|---------------|------------------------------------------------------|
| `/inicio`    | InicioPage    | Hero, estatísticas e atalhos para as seções          |
| `/bancas`    | BancasPage    | Lista todas as bancas organizadoras                  |
| `/concursos` | ConcursosPage | Lista concursos com filtro por banca                 |
| `/assuntos`  | AssuntosPage  | Lista todos os assuntos disponíveis                  |
| `/questoes`  | QuestoesPage  | Simulado com filtro, feedback, placar e resultado    |

---

## 🚀 Produção com Docker

```bash
# 1. Clone os dois repositórios lado a lado
git clone https://github.com/seu-usuario/concursos-api
git clone https://github.com/seu-usuario/concursos-web

# 2. Configure as credenciais de produção
cd concursos-api
cp .env.prod.example .env.prod
vim .env.prod   # preencha com credenciais reais

# 3. Suba tudo com Docker Compose
docker compose up -d --build
```

| Serviço    | URL                   |
|------------|-----------------------|
| Frontend   | http://localhost      |
| API        | http://localhost:3000 |
| PostgreSQL | localhost:5432        |

### Comandos úteis

```bash
# Acompanhar logs em tempo real
docker compose logs -f concursos-api
docker compose logs -f concursos-web

# Rebuild após alterações no backend
docker compose up -d --build concursos-api

# Rebuild após alterações no frontend
docker compose up -d --build concursos-web

# Acessar o banco diretamente
docker exec -it concursos-db psql -U concursos_user -d concursos_db

# Parar todos os serviços
docker compose down

# Parar e remover volumes (⚠️ apaga todos os dados)
docker compose down -v
```

---

## 🗄 Dados Iniciais

Inseridos automaticamente pela migration `002_seed_data.sql` na primeira execução:

| Tipo     | Dados                                                                                       |
|----------|---------------------------------------------------------------------------------------------|
| Banca    | CEBRASPE                                                                                    |
| Concurso | TCE-RN 2024 (Banca: CEBRASPE)                                                               |
| Assuntos | Direito Constitucional, Direito Administrativo, Controle Externo, Tecnologia da Informação  |
| Questões | 4 questões de múltipla escolha distribuídas entre os assuntos                               |

---

## 💡 Decisões Técnicas

**Rust + Axum no backend**
Rust oferece segurança de memória em tempo de compilação, zero-cost abstractions e performance próxima ao C. Axum é ergonômico, construído sobre o ecossistema Tokio e possui tipagem forte com tratamento de erros explícito via `thiserror`.

**SQLx em vez de ORM completo**
O SQLx valida as queries SQL em tempo de compilação contra o banco real, unindo a segurança do Rust com SQL explícito e legível. Evita a magia e o overhead de ORMs como Diesel em projetos didáticos.

**Bun como runtime e gerenciador de pacotes**
Bun substitui o Node.js e o npm com instalação de dependências até 25x mais rápida, execução nativa de TypeScript e compatibilidade total com o ecossistema npm. O Vite continua sendo usado como bundler para o build de produção, aproveitando o melhor dos dois mundos.

**React + TypeScript no frontend**
TypeScript garante contratos de tipo entre frontend e backend, evitando erros em runtime ao consumir a API. CSS Modules isolam os estilos por componente sem dependência de bibliotecas externas de UI.

**Tipografia com Syne + Instrument Sans**
Syne é uma fonte display geométrica com personalidade forte, usada em títulos e headings. Instrument Sans complementa como fonte de corpo, legível e refinada. Ambas são carregadas via `@fontsource` sem depender de CDN externo, garantindo performance e privacidade.

**Hook `useFetch` customizado**
Abstrai o ciclo de vida de requisições HTTP (loading, error, data, cancelamento via flag) em um único hook reutilizável, evitando repetição de código nas páginas e garantindo que requisições canceladas não atualizem o estado após o componente ser desmontado.

**Repositórios separados**
Backend e frontend possuem ciclos de deploy independentes, stacks completamente diferentes e podem escalar de forma autônoma. O Docker Compose os orquestra localmente e em produção.

**NGINX como proxy reverso**
O NGINX serve os arquivos estáticos do React com cache agressivo e encaminha as chamadas `/api/*` para a API Rust, eliminando problemas de CORS em produção e centralizando o ponto de entrada da aplicação em uma única porta.

**Migrations versionadas com SQLx**
O schema do banco é versionado e reproduzível, garantindo consistência entre os ambientes de desenvolvimento e produção sem a necessidade de `ddl-auto: update`.

---

## 📄 Licença

MIT — sinta-se livre para usar, estudar e modificar.