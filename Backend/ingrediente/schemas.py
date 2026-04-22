from pydantic import BaseModel, Field
from typing import Optional

class IngredienteBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=50)
    descripcion: Optional[str] = None
    es_alergeno: bool = False

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteRead(IngredienteBase):
    id: int
    nombre: str
    descripcion: Optional[str]
    es_alergeno: bool
    model_config = {"from_attributes": True}

class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=3, max_length=50)
    descripcion: Optional[str] = None
    es_alergeno: Optional[bool] = None
