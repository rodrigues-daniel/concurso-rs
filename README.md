# 📚 Concursos — Sistema de Estudos para Concursos Públicos

Sistema fullstack para estudo de concursos públicos composto por dois repositórios independentes:

- **concursos-api** — Backend em Rust + Axum + PostgreSQL
- **concursos-web** — Frontend em React + TypeScript + Vite

---

## 🗂 Sumário

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Como Executar em Desenvolvimento](#-como-executar-em-desenvolvimento)
- [Como Executar em Produção](#-como-executar-em-produção)
- [Endpoints da API](#-endpoints-da-api)
- [Páginas do Frontend](#-páginas-do-frontend)
- [Dados Iniciais](#-dados-iniciais)
- [Decisões Técnicas](#-decisões-técnicas)

---

## 🌐 Visão Geral

Sistema didático para estudo de concursos públicos que permite ao usuário navegar por bancas, concursos e assuntos, além de responder questões de múltipla escolha com feedback imediato de acerto ou erro e placar ao final do simulado.

```
Browser  ──▶  React SPA  ──▶  Rust/Axum API  ──▶  PostgreSQL
```

---

## 🛠 Stack Tecnológica

### Backend — concursos-api

| Função | Tecnologia |
|---|---|
| Linguagem | Rust 1.78 |
| Framework HTTP | Axum 0.7 |
| Runtime Assíncrono | Tokio |
| ORM / Query | SQLx 0.7 |
| Banco de Dados | PostgreSQL 16 |
| Migrations | SQLx Migrate |
| Serialização | Serde + serde_json |
| Container | Docker |

### Frontend — concursos-web

| Função | Tecnologia |
|---|---|
| Linguagem | TypeScript 5 |
| Framework UI | React 18 |
| Bundler | Vite 5 |
| Roteamento | React Router DOM 6 |
| HTTP Client | Axios |
| Estilização | CSS Modules |
| Servidor (prod) | NGINX |
| Container | Docker |

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
    ├── components/
    │   ├── Layout.tsx
    │   ├── Layout.module.css
    │   ├── Card.tsx
    │   ├── Card.module.css
    │   ├── Loading.tsx
    │   ├── Loading.module.css
    │   └── Erro.tsx
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

| Ferramenta | Versão mínima |
|---|---|
| Rust | 1.78 |
| Node.js | 20 |
| npm | 10 |
| PostgreSQL | 16 |
| Docker | 24 |
| Docker Compose | 2.24 |

---

## 🐘 Configuração do Banco de Dados

### Com Docker (recomendado)

```bash
docker run --name concursos-db \
  -e POSTGRES_DB=concursos_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### Manualmente

```sql
CREATE DATABASE concursos_db;
```

> As tabelas e dados iniciais são criados automaticamente pelas migrations SQLx na primeira execução da API.

---

## 🔑 Variáveis de Ambiente

### concursos-api — `.env`

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/concursos_db
HOST=0.0.0.0
PORT=3000
RUST_LOG=debug
```

### concursos-api — `.env.prod`

```env
POSTGRES_DB=concursos_db
POSTGRES_USER=concursos_user
POSTGRES_PASSWORD=SenhaForteAqui123!
DATABASE_URL=postgres://concursos_user:SenhaForteAqui123!@postgres:5432/concursos_db
HOST=0.0.0.0
PORT=3000
RUST_LOG=info
```

### concursos-web — `.env`

```env
VITE_API_URL=http://localhost:3000
```

### concursos-web — `.env.prod`

```env
# Vazio em produção — o NGINX resolve via proxy reverso
VITE_API_URL=
```

> ⚠️ Nunca versione os arquivos `.env` e `.env.prod` com credenciais reais. Apenas os arquivos `.env.example` devem ir para o repositório.

---

## ▶️ Como Executar em Desenvolvimento

### 1. Backend

```bash
git clone https://github.com/seu-usuario/concursos-api
cd concursos-api

cp .env.example .env
# edite o .env com suas credenciais do banco

cargo run
# API disponível em http://localhost:3000
```

### 2. Frontend

```bash
git clone https://github.com/seu-usuario/concursos-web
cd concursos-web

cp .env.example .env
# VITE_API_URL=http://localhost:3000

npm install
npm run dev
# App disponível em http://localhost:5173
```

---

## 🚀 Como Executar em Produção

```bash
# Clone os dois repositórios lado a lado
git clone https://github.com/seu-usuario/concursos-api
git clone https://github.com/seu-usuario/concursos-web

# Configure as credenciais de produção
cd concursos-api
cp .env.prod.example .env.prod
vim .env.prod   # preencha com credenciais reais

# Suba tudo com Docker Compose
docker compose up -d --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost |
| API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### Comandos úteis

```bash
# Acompanhar logs em tempo real
docker compose logs -f concursos-api
docker compose logs -f concursos-web

# Rebuild apenas da API após alterações
docker compose up -d --build concursos-api

# Rebuild apenas do frontend após alterações
docker compose up -d --build concursos-web

# Acessar o banco diretamente
docker exec -it concursos-db psql -U concursos_user -d concursos_db

# Parar todos os serviços
docker compose down

# Parar e remover volumes (⚠️ apaga todos os dados)
docker compose down -v
```

---

## 📡 Endpoints da API

### Bancas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/bancas` | Lista todas as bancas |
| GET | `/api/bancas/:id` | Busca banca por ID |

### Concursos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/concursos` | Lista todos os concursos |
| GET | `/api/concursos?banca_id=1` | Filtra concursos por banca |
| GET | `/api/concursos/:id` | Busca concurso por ID |

### Assuntos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/assuntos` | Lista todos os assuntos |
| GET | `/api/assuntos/:id` | Busca assunto por ID |

### Questões

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/questoes` | Lista todas as questões |
| GET | `/api/questoes?concurso_id=1` | Filtra por concurso |
| GET | `/api/questoes?assunto_id=2` | Filtra por assunto |
| GET | `/api/questoes?concurso_id=1&assunto_id=2` | Filtra por concurso e assunto |
| GET | `/api/questoes/:id` | Busca questão por ID |
| POST | `/api/questoes/:id/validar` | Valida resposta do usuário |

#### Exemplo — POST `/api/questoes/1/validar`

Request:
```json
{ "resposta": "A" }
```

Response:
```json
{
  "correta": true,
  "alternativa_correta": "A"
}
```

---

## 🖥 Páginas do Frontend

| Rota | Página | Descrição |
|---|---|---|
| `/inicio` | InicioPage | Boas-vindas e atalhos para as seções |
| `/bancas` | BancasPage | Lista todas as bancas organizadoras |
| `/concursos` | ConcursosPage | Lista concursos com filtro por banca |
| `/assuntos` | AssuntosPage | Lista todos os assuntos disponíveis |
| `/questoes` | QuestoesPage | Simulado com filtro, feedback e placar |

---

## 🗄 Dados Iniciais

Inseridos automaticamente pela migration `002_seed_data.sql`:

**Banca**
- CEBRASPE

**Concurso**
- TCE-RN 2024 (Banca: CEBRASPE)

**Assuntos**
- Direito Constitucional
- Direito Administrativo
- Controle Externo
- Tecnologia da Informação

**Questões**
- 4 questões de múltipla escolha distribuídas entre os assuntos acima

---

## 💡 Decisões Técnicas

**Rust + Axum no backend**
Rust oferece segurança de memória em tempo de compilação, zero-cost abstractions e performance próxima ao C. Axum é um framework web ergonômico construído sobre o ecossistema Tokio, com tipagem forte e tratamento de erros explícito.

**SQLx em vez de ORM completo**
O SQLx valida as queries SQL em tempo de compilação contra o banco real, unindo a segurança do Rust com SQL explícito e legível. Evita a magia e o overhead de ORMs como Diesel em projetos didáticos.

**React + TypeScript no frontend**
TypeScript garante contratos de tipo entre frontend e backend, evitando erros em runtime ao consumir a API. CSS Modules isolam os estilos por componente sem dependência de bibliotecas externas.

**Repositórios separados**
Backend e frontend possuem ciclos de deploy independentes, stacks completamente diferentes e podem escalar de forma autônoma. O Docker Compose os orquestra localmente e em produção.

**NGINX como proxy reverso**
O NGINX serve os arquivos estáticos do React com cache agressivo e encaminha as chamadas `/api/*` para a API Rust, eliminando problemas de CORS em produção e centralizando o ponto de entrada da aplicação.

**Migrations versionadas**
O schema do banco é versionado e reproduzível via SQLx Migrate, garantindo consistência entre os ambientes de desenvolvimento, staging e produção.

---

## 📄 Licença

MIT — sinta-se livre para usar, estudar e modificar.
