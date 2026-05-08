from sqlmodel import Session, select
from app.repository import BaseRepository
from .models import Ingrediente

class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session):
        super().__init__(Ingrediente, session)

    def get_all_active(self, skip: int = 0, limit: int = 20, nombre: str | None = None) -> list[Ingrediente]:
        query = select(Ingrediente).where(Ingrediente.borrado_fecha.is_(None))
        if nombre:
            query = query.where(Ingrediente.nombre.ilike(f"%{nombre}%"))
        return self.session.exec(query.offset(skip).limit(limit)).all()
