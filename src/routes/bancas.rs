// concursos-api/src/routes/bancas.rs

use crate::{
    db::Db,
    error::{AppError, Result},
    models::Banca,
};
use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};

pub fn router() -> Router<Db> {
    Router::new()
        .route("/api/bancas", get(listar))
        .route("/api/bancas/:id", get(buscar_por_id))
}

async fn listar(State(pool): State<Db>) -> Result<Json<Vec<Banca>>> {
    let bancas = sqlx::query_as::<_, Banca>("SELECT id, nome, descricao FROM bancas ORDER BY nome")
        .fetch_all(&pool)
        .await?;

    Ok(Json(bancas))
}

async fn buscar_por_id(State(pool): State<Db>, Path(id): Path<i64>) -> Result<Json<Banca>> {
    let banca = sqlx::query_as::<_, Banca>("SELECT id, nome, descricao FROM bancas WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or(AppError::NotFound)?;

    Ok(Json(banca))
}
