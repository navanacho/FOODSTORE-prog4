from sqlmodel import Session
from .models import Producto
from .schemas import ProductoCreate, ProductoUpdate
from fastapi import HTTPException, status
from datetime import datetime
from .repository import ProductoRepository

def get_all(db: Session, skip: int = 0, limit: int = 20, nombre: str | None = None, disponible: bool | None = None):
    repo = ProductoRepository(db)
    return repo.get_all_active(skip, limit, nombre, disponible)

def get_by_id(db: Session, producto_id: int) -> Producto:
    repo = ProductoRepository(db)
    producto = repo.get(producto_id)
    if not producto or producto.borrado_fecha:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado o eliminado")
    return producto

def create(db: Session,  producto_create: ProductoCreate) -> Producto:
    repo = ProductoRepository(db)
    producto_data = producto_create.model_dump(exclude={'categoria_id', 'ingredientes_id'})
    producto = Producto(**producto_data)
    repo.add(producto)
    db.flush() # obtener el id antes de guardar las relaciones
    if producto_create.categoria_id:
        for cat_id in producto_create.categoria_id:
            repo.add_categoria_to_producto(producto.id, cat_id)
    if producto_create.ingredientes_id:
        for ing_id in producto_create.ingredientes_id:
            repo.add_ingrediente_to_producto(producto.id, ing_id)
    return producto

def update(db: Session, producto_id: int,  producto_update: ProductoUpdate) -> Producto:
    repo = ProductoRepository(db)
    producto = get_by_id(db, producto_id)
    update_data = producto_update.model_dump(exclude_unset=True)
    categorias = update_data.pop('categoria_id', None)
    ingredientes = update_data.pop('ingredientes_id', None)
    for key, value in update_data.items():
        setattr(producto, key, value)
    repo.add(producto)
    if categorias is not None:
        repo.delete_categorias_from_producto(producto.id)
        for cat_id in categorias:
            repo.add_categoria_to_producto(producto.id, cat_id)
    if ingredientes is not None:
        repo.delete_ingredientes_from_producto(producto.id)
        for ing_id in ingredientes:
            repo.add_ingrediente_to_producto(producto.id, ing_id)
    return producto

def delete(db: Session, producto_id: int) -> Producto:
    repo = ProductoRepository(db)
    producto = get_by_id(db, producto_id)
    producto.borrado_fecha = datetime.utcnow() 
    repo.add(producto)
    return producto