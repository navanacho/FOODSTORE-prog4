from fastapi import FastAPI
from app.database import init_db
from categoria.router import router as categoria_router
from producto.router import router as producto_router
from ingrediente.router import router as ingrediente_router

app = FastAPI(
    title="FoodStore API",
    description="Backend del Sistema de Pedidos v3.0 | FastAPI + SQLModel + PostgreSQL",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    """Crea las tablas en PostgreSQL al iniciar el servidor (solo para desarrollo)."""
    init_db()

# Registro de módulos por dominio
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(ingrediente_router)