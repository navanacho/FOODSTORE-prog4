from sqlmodel import Session, select
from .models import Categoria
from .schemas import CategoriaCreate, CategoriaUpdate
from fastapi import HTTPException, status
from datetime import datetime

def get_all(db: Session, skip: int = 0, limit: int = 20, nombre: str | None = None) -> list[Categoria]:
    query = select(Categoria).where(Categoria.borrado_fecha.is_(None))
    if nombre:
        query = query.where(Categoria.nombre.ilike(f"%{nombre}%"))
    return db.exec(query.offset(skip).limit(limit)).all()

def get_by_id(db: Session, id: int) -> Categoria:
    categoria = db.get(Categoria, id)
    if not categoria or categoria.borrado_fecha is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    return categoria

def create(db: Session, categoria_create: CategoriaCreate) -> Categoria:
    categoria = Categoria.model_validate(categoria_create)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria
    
def update(db: Session, id: int, data: CategoriaUpdate) -> Categoria:
    categoria = get_by_id(db, id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(categoria, key, value)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria

def delete(db: Session, id: int) -> Categoria:
    categoria = get_by_id(db, id)
    categoria.borrado_fecha = datetime.now()
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria