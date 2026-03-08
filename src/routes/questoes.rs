// concursos-api/src/routes/questoes.rs

use crate::{
    db::Db,
    error::{AppError, Result},
    models::{Questao, ValidarRespostaRequest, ValidarRespostaResponse},
};
use axum::{
    extract::{Path, Query, State},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;

pub fn router() -> Router<Db> {
    Router::new()
        .route("/api/questoes", get(listar))
        .route("/api/questoes/:id", get(buscar_por_id))
        .route("/api/questoes/:id/validar", post(validar_resposta))
}

#[derive(Deserialize)]
pub struct FiltroQuery {
    concurso_id: Option<i64>,
    assunto_id: Option<i64>,
}

async fn listar(
    State(pool): State<Db>,
    Query(filtro): Query<FiltroQuery>,
) -> Result<Json<Vec<Questao>>> {
    let questoes = match (filtro.concurso_id, filtro.assunto_id) {
        (Some(c), Some(a)) => {
            sqlx::query_as::<_, Questao>(
                "SELECT * FROM questoes WHERE concurso_id = $1 AND assunto_id = $2 ORDER BY id",
            )
            .bind(c)
            .bind(a)
            .fetch_all(&pool)
            .await?
        }

        (Some(c), None) => {
            sqlx::query_as::<_, Questao>(
                "SELECT * FROM questoes WHERE concurso_id = $1 ORDER BY id",
            )
            .bind(c)
            .fetch_all(&pool)
            .await?
        }

        (None, Some(a)) => {
            sqlx::query_as::<_, Questao>("SELECT * FROM questoes WHERE assunto_id = $1 ORDER BY id")
                .bind(a)
                .fetch_all(&pool)
                .await?
        }

        (None, None) => {
            sqlx::query_as::<_, Questao>("SELECT * FROM questoes ORDER BY id")
                .fetch_all(&pool)
                .await?
        }
    };

    Ok(Json(questoes))
}

async fn buscar_por_id(State(pool): State<Db>, Path(id): Path<i64>) -> Result<Json<Questao>> {
    let questao = sqlx::query_as::<_, Questao>("SELECT * FROM questoes WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or(AppError::NotFound)?;

    Ok(Json(questao))
}

async fn validar_resposta(
    State(pool): State<Db>,
    Path(id): Path<i64>,
    Json(body): Json<ValidarRespostaRequest>,
) -> Result<Json<ValidarRespostaResponse>> {
    let questao = sqlx::query_as::<_, Questao>("SELECT * FROM questoes WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or(AppError::NotFound)?;

    let correta = questao
        .alternativa_correta
        .eq_ignore_ascii_case(&body.resposta);

    Ok(Json(ValidarRespostaResponse {
        correta,
        alternativa_correta: questao.alternativa_correta,
    }))
}
