// concursos-api/src/models.rs
// ALTERAÇÃO: Questao sem alternativas, gabarito boolean, justificativa adicionada

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Banca {
    pub id: i64,
    pub nome: String,
    pub descricao: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Concurso {
    pub id: i64,
    pub nome: String,
    pub orgao: Option<String>,
    pub ano: Option<i32>,
    pub banca_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Assunto {
    pub id: i64,
    pub nome: String,
    pub descricao: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Questao {
    pub id: i64,
    pub enunciado: String,
    pub gabarito: bool,                // true = Certo, false = Errado
    pub justificativa: Option<String>, // explicação exibida após responder
    pub assunto_id: Option<i64>,
    pub concurso_id: Option<i64>,
}

// ── DTOs ────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
pub struct ValidarRespostaRequest {
    pub resposta: bool, // true = Certo, false = Errado
}

#[derive(Debug, Serialize)]
pub struct ValidarRespostaResponse {
    pub correta: bool,
    pub gabarito: bool,
    pub justificativa: Option<String>,
}
