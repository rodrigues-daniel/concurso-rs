// concursos-api/src/db.rs

use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;

pub type Db = PgPool;

pub async fn create_pool() -> anyhow::Result<Db> {
    let url = env::var("DATABASE_URL").expect("DATABASE_URL não definida no .env");

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&url)
        .await?;

    tracing::info!("✅ Conectado ao PostgreSQL");
    Ok(pool)
}

pub async fn run_migrations(pool: &Db) -> anyhow::Result<()> {
    sqlx::migrate!("./migrations").run(pool).await?;
    tracing::info!("✅ Migrations executadas com sucesso");
    Ok(())
}
