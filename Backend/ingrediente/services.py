from datetime import datetime
from sqlmodel import Session, select
from .models import Ingrediente
from .schemas import IngredienteCreate, IngredienteUpdate
from fastapi import HTTPException, status


def get_all(db: Session, skip: int = 0, limit: int = 20, nombre: str | None = None, es_alergeno: bool | None = None) -> list[Ingrediente]:
    query = select(Ingrediente)
    if nombre:
        query = query.where(Ingrediente.nombre.ilike(f"%{nombre}%"))
    if es_alergeno is not None:
        query = query.where(Ingrediente.es_alergeno == es_alergeno)
    return db.exec(query.offset(skip).limit(limit)).all()

def get_by_id(db: Session, id: int) -> Ingrediente:
    ingrediente = db.get(Ingrediente, id)
    if not ingrediente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingrediente no encontrado")
    return ingrediente

def create(db: Session, ingrediente_create: IngredienteCreate) -> Ingrediente:
    ingrediente = Ingrediente.model_validate(ingrediente_create)
    db.add(ingrediente)
    db.commit()
    db.refresh(ingrediente)
    return ingrediente

def update(db: Session, id: int, data: IngredienteUpdate) -> Ingrediente:
    ingrediente = get_by_id(db, id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ingrediente, key, value)
    db.add(ingrediente)
    db.commit()
    db.refresh(ingrediente)
    return ingrediente

def delete(db: Session, id: int):
    ingrediente = get_by_id(db, id)
    db.delete(ingrediente)
    db.commit()
