from fastapi import APIRouter, Depends, Query, status
from typing import Annotated, Optional, List
from app.database import get_uow
from uow.uow import UnitOfWork
from .schemas import ProductoCreate, ProductoRead, ProductoUpdate
from . import services

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=List[ProductoRead])
def list(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=50)] = 20,
    nombre: Annotated[Optional[str], Query()] = None,
    disponible: Annotated[Optional[bool], Query()] = None,
    uow: UnitOfWork = Depends(get_uow)
):
    with uow as session:
        return services.get_all(session, skip, limit, nombre, disponible)

@router.post("/", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def create(data: ProductoCreate, uow: UnitOfWork = Depends(get_uow)):
    with uow as session:
        return services.create(session, data)

@router.get("/{producto_id}", response_model=ProductoRead)
def read(producto_id: int, uow: UnitOfWork = Depends(get_uow)):
    with uow as session:
        return services.get_by_id(session, producto_id)

@router.put("/{producto_id}", response_model=ProductoRead)
def update(producto_id: int, data: ProductoUpdate, uow: UnitOfWork = Depends(get_uow)):
    with uow as session:
        return services.update(session, producto_id, data)

@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(producto_id: int, uow: UnitOfWork = Depends(get_uow)):
    with uow as session:
        services.delete(session, producto_id)
    return None