// concursos-api/src/routes/assuntos.rs

use crate::{
    db::Db,
    error::{AppError, Result},
    models::Assunto,
};
use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};

pub fn router() -> Router<Db> {
    Router::new()
        .route("/api/assuntos", get(listar))
        .route("/api/assuntos/:id", get(buscar_por_id))
}

async fn listar(State(pool): State<Db>) -> Result<Json<Vec<Assunto>>> {
    let assuntos =
        sqlx::query_as::<_, Assunto>("SELECT id, nome, descricao FROM assuntos ORDER BY nome")
            .fetch_all(&pool)
            .await?;

    Ok(Json(assuntos))
}

async fn buscar_por_id(State(pool): State<Db>, Path(id): Path<i64>) -> Result<Json<Assunto>> {
    let assunto =
        sqlx::query_as::<_, Assunto>("SELECT id, nome, descricao FROM assuntos WHERE id = $1")
            .bind(id)
            .fetch_optional(&pool)
            .await?
            .ok_or(AppError::NotFound)?;

    Ok(Json(assunto))
}
