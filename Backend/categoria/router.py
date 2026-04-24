from starlette import status
from fastapi import APIRouter, Depends, Query
from typing import Annotated, Optional, List
from sqlmodel import Session
from app.database import get_session
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from . import services

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.get("/", response_model=List[CategoriaRead])
def list(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=50)] = 20,
    nombre: Annotated[Optional[str], Query(description="Filtrar por nombre")] = None,
    session: Session = Depends(get_session)
):
    return services.get_all(session, skip, limit, nombre)

@router.post("/", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def create(
    data: CategoriaCreate,
    session: Session = Depends(get_session)
):
    return services.create(session, data)

@router.get("/{categoria_id}", response_model=CategoriaRead)
def read(
    categoria_id: int,
    session: Session = Depends(get_session)
):
    return services.get_by_id(session, categoria_id)

@router.put("/{categoria_id}", response_model=CategoriaRead)
def update(
    categoria_id: int,
    data: CategoriaUpdate,
    session: Session = Depends(get_session)
):
    return services.update(session, categoria_id, data)

@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    categoria_id: int,
    session: Session = Depends(get_session)
):
    services.delete(session, categoria_id)
    return None