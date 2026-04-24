from sqlalchemy import text
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
    producto_data = producto_create.model_dump(exclude={'categoria_id', 'ingredientes_id'})
    producto = Producto(**producto_data)
    db.add(producto)
    db.flush() # obtener el id antes de guardar las relaciones
    if producto_create.categoria_id:
        for cat_id in producto_create.categoria_id:
            db.execute(text("INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (:producto_id, :categoria_id)"), {"producto_id": producto.id, "categoria_id": cat_id})
    if producto_create.ingredientes_id:
        for ing_id in producto_create.ingredientes_id:
            db.execute(text("INSERT INTO producto_ingrediente (producto_id, ingrediente_id) VALUES (:producto_id, :ingrediente_id)"), {"producto_id": producto.id, "ingrediente_id": ing_id})
    db.commit()
    db.refresh(producto)
    return producto

def update(db: Session, producto_id: int,  producto_update: ProductoUpdate) -> Producto:
    producto = get_by_id(db, producto_id)
    update_data = producto_update.model_dump(exclude_unset=True)
    categorias = update_data.pop('categoria_id', None)
    ingredientes = update_data.pop('ingredientes_id', None)
    for key, value in update_data.items():
        setattr(producto, key, value)
    db.add(producto)
    if categorias is not None:
        db.execute(text("DELETE FROM producto_categoria WHERE producto_id = :producto_id"), {"producto_id": producto.id})
        for cat_id in categorias:
            db.execute(text("INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (:producto_id, :categoria_id)"), {"producto_id": producto.id, "categoria_id": cat_id})
    if ingredientes is not None:
        db.execute(text("DELETE FROM producto_ingrediente WHERE producto_id = :producto_id"), {"producto_id": producto.id})
        for ing_id in ingredientes:
            db.execute(text("INSERT INTO producto_ingrediente (producto_id, ingrediente_id) VALUES (:producto_id, :ingrediente_id)"), {"producto_id": producto.id, "ingrediente_id": ing_id})
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