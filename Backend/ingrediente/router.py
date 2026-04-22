from fastapi import APIRouter, Depends, Query, status
from typing import Annotated, Optional, List
from sqlmodel import Session
from app.database import get_session
from .schemas import IngredienteCreate, IngredienteRead, IngredienteUpdate
from . import services

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

@router.get("/", response_model=List[IngredienteRead])
def list(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=50)] = 20,
    nombre: Annotated[Optional[str], Query()] = None,
    es_alergeno: Annotated[Optional[bool], Query()] = None,
    session: Session = Depends(get_session)
):
    return services.get_all(session, skip, limit, nombre, es_alergeno)

@router.post("/", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def create(data: IngredienteCreate, session: Session = Depends(get_session)):
    return services.create(session, data)

@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def read(ingrediente_id: int, session: Session = Depends(get_session)):
    return services.get_by_id(session, ingrediente_id)

@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def update(ingrediente_id: int, data: IngredienteUpdate, session: Session = Depends(get_session)):
    return services.update(session, ingrediente_id, data)

@router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(ingrediente_id: int, session: Session = Depends(get_session)):
    services.delete(session, ingrediente_id)
    return None