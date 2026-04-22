from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CategoriaBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    orden_display: int = Field(default=0, ge=0)
    parent_id: Optional[int] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaRead(CategoriaBase):
    id: int
    nombre: str
    descripcion: Optional[str]
    orden_display: int
    parent_id: Optional[int]
    fecha_creacion: datetime

class CategoriaUpdate(CategoriaBase):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    orden_display: Optional[int] = None
    parent_id: Optional[int] = None

class CategoriaDelete(BaseModel):
    id: int
    borrado_fecha: datetime = Field(default_factory=datetime.now)