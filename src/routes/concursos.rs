// concursos-api/src/routes/concursos.rs

use crate::{
    db::Db,
    error::{AppError, Result},
    models::Concurso,
};
use axum::{
    extract::{Path, Query, State},
    routing::get,
    Json, Router,
};
use serde::Deserialize;

pub fn router() -> Router<Db> {
    Router::new()
        .route("/api/concursos", get(listar))
        .route("/api/concursos/:id", get(buscar_por_id))
}

#[derive(Deserialize)]
pub struct FiltroQuery {
    banca_id: Option<i64>,
}

async fn listar(
    State(pool): State<Db>,
    Query(filtro): Query<FiltroQuery>,
) -> Result<Json<Vec<Concurso>>> {
    let concursos = match filtro.banca_id {
        Some(banca_id) => {
            sqlx::query_as::<_, Concurso>(
                "SELECT id, nome, orgao, ano, banca_id
             FROM concursos WHERE banca_id = $1 ORDER BY ano DESC",
            )
            .bind(banca_id)
            .fetch_all(&pool)
            .await?
        }

        None => {
            sqlx::query_as::<_, Concurso>(
                "SELECT id, nome, orgao, ano, banca_id
             FROM concursos ORDER BY ano DESC",
            )
            .fetch_all(&pool)
            .await?
        }
    };

    Ok(Json(concursos))
}

async fn buscar_por_id(State(pool): State<Db>, Path(id): Path<i64>) -> Result<Json<Concurso>> {
    let concurso = sqlx::query_as::<_, Concurso>(
        "SELECT id, nome, orgao, ano, banca_id FROM concursos WHERE id = $1",
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or(AppError::NotFound)?;

    Ok(Json(concurso))
}
