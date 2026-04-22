from sqlmodel import Session, select
from .models import Producto
from .schemas import ProductoCreate, ProductoUpdate
from fastapi import HTTPException, status
from datetime import datetime

def get_all(db: Session, skip: int = 0, limit: int = 20, nombre: str | None = None, disponible: bool | None = None):
    query = select(Producto).where(Producto.borrado_fecha.is_(None))
    if nombre:
        query = query.where(Producto.nombre.ilike(f"%{nombre}%"))
    if disponible is not None:
        query = query.where(Producto.disponible == disponible)
    return db.exec(query.offset(skip).limit(limit)).all()

def get_by_id(db: Session, producto_id: int) -> Producto:
    producto = db.get(Producto, producto_id)
    if not producto or producto.borrado_fecha:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado o eliminado")
    return producto

def create(db: Session,  producto_create: ProductoCreate) -> Producto:
    producto = Producto.model_validate(producto_create)
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto

def update(db: Session, producto_id: int,  producto_update: ProductoUpdate) -> Producto:
    producto = get_by_id(db, producto_id)
    update_data = producto_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(producto, key, value)
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto

def delete(db: Session, producto_id: int) -> Producto:
    producto = get_by_id(db, producto_id)
    producto.borrado_fecha = datetime.utcnow() 
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto