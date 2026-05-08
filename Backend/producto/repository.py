from sqlmodel import Session, select
from sqlalchemy import text
from app.repository import BaseRepository
from .models import Producto

class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(Producto, session)

    def get_all_active(self, skip: int = 0, limit: int = 20, nombre: str | None = None, disponible: bool | None = None) -> list[Producto]:
        query = select(Producto).where(Producto.borrado_fecha.is_(None))
        if nombre:
            query = query.where(Producto.nombre.ilike(f"%{nombre}%"))
        if disponible is not None:
            query = query.where(Producto.disponible == disponible)
        return self.session.exec(query.offset(skip).limit(limit)).all()
        
    def add_categoria_to_producto(self, producto_id: int, categoria_id: int):
        self.session.execute(text("INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (:producto_id, :categoria_id)"), {"producto_id": producto_id, "categoria_id": categoria_id})

    def add_ingrediente_to_producto(self, producto_id: int, ingrediente_id: int):
        self.session.execute(text("INSERT INTO producto_ingrediente (producto_id, ingrediente_id) VALUES (:producto_id, :ingrediente_id)"), {"producto_id": producto_id, "ingrediente_id": ingrediente_id})

    def delete_categorias_from_producto(self, producto_id: int):
        self.session.execute(text("DELETE FROM producto_categoria WHERE producto_id = :producto_id"), {"producto_id": producto_id})

    def delete_ingredientes_from_producto(self, producto_id: int):
        self.session.execute(text("DELETE FROM producto_ingrediente WHERE producto_id = :producto_id"), {"producto_id": producto_id})
