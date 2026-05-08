from sqlmodel import Session
from .models import Categoria
from .schemas import CategoriaCreate, CategoriaUpdate
from fastapi import HTTPException, status
from datetime import datetime
from .repository import CategoriaRepository

def get_all(db: Session, skip: int = 0, limit: int = 20, nombre: str | None = None) -> list[Categoria]:
    repo = CategoriaRepository(db)
    return repo.get_all_active(skip, limit, nombre)

def get_by_id(db: Session, id: int) -> Categoria:
    repo = CategoriaRepository(db)
    categoria = repo.get(id)
    if not categoria or categoria.borrado_fecha is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    return categoria

def create(db: Session, categoria_create: CategoriaCreate) -> Categoria:
    repo = CategoriaRepository(db)
    categoria = Categoria.model_validate(categoria_create)
    repo.add(categoria)
    return categoria
    
def update(db: Session, id: int, data: CategoriaUpdate) -> Categoria:
    repo = CategoriaRepository(db)
    categoria = get_by_id(db, id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(categoria, key, value)
    repo.add(categoria)
    return categoria

def delete(db: Session, id: int) -> Categoria:
    repo = CategoriaRepository(db)
    categoria = get_by_id(db, id)
    categoria.borrado_fecha = datetime.now()
    repo.add(categoria)
    return categoria