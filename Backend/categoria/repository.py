from sqlmodel import Session, select
from app.repository import BaseRepository
from .models import Categoria

class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(Categoria, session)

    def get_all_active(self, skip: int = 0, limit: int = 20, nombre: str | None = None) -> list[Categoria]:
        query = select(Categoria).where(Categoria.borrado_fecha.is_(None))
        if nombre:
            query = query.where(Categoria.nombre.ilike(f"%{nombre}%"))
        return self.session.exec(query.offset(skip).limit(limit)).all()
