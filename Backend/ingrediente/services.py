from datetime import datetime
from sqlmodel import Session
from .models import Ingrediente
from .schemas import IngredienteCreate, IngredienteUpdate
from fastapi import HTTPException, status
from .repository import IngredienteRepository

def get_all(db: Session, skip: int = 0, limit: int = 20, nombre: str | None = None, es_alergeno: bool | None = None) -> list[Ingrediente]:
    repo = IngredienteRepository(db)
    query = repo.session.query(Ingrediente)
    if nombre:
        query = query.filter(Ingrediente.nombre.ilike(f"%{nombre}%"))
    if es_alergeno is not None:
        query = query.filter(Ingrediente.es_alergeno == es_alergeno)
    return query.offset(skip).limit(limit).all()

def get_by_id(db: Session, id: int) -> Ingrediente:
    repo = IngredienteRepository(db)
    ingrediente = repo.get(id)
    if not ingrediente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingrediente no encontrado")
    return ingrediente

def create(db: Session, ingrediente_create: IngredienteCreate) -> Ingrediente:
    repo = IngredienteRepository(db)
    ingrediente = Ingrediente.model_validate(ingrediente_create)
    repo.add(ingrediente)
    return ingrediente

def update(db: Session, id: int, data: IngredienteUpdate) -> Ingrediente:
    repo = IngredienteRepository(db)
    ingrediente = get_by_id(db, id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ingrediente, key, value)
    repo.add(ingrediente)
    return ingrediente

def delete(db: Session, id: int):
    repo = IngredienteRepository(db)
    ingrediente = get_by_id(db, id)
    repo.delete(ingrediente)
