from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List

class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=150)
    descripcion: Optional[str] = None
    precio_base: float = Field(ge=0)
    imagenes_url: Optional[List[str]] = Field(default_factory=list)
    tiempo_prep_min: Optional[int] = Field(ge=0, default=None)
    disponible: bool = True

class ProductoCreate(ProductoBase):
    pass

class ProductoRead(ProductoBase):
    id: int
    nombre: str
    descripcion: Optional[str]
    precio_base: float
    imagenes_url: Optional[List[str]]
    tiempo_prep_min: Optional[int]
    disponible: bool
    fecha_creacion: datetime
    model_config = {"from_attributes": True}

class ProductoUpdate(ProductoBase):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = None
    imagenes_url: Optional[List[str]] = None
    tiempo_prep_min: Optional[int] = None
    disponible: Optional[bool] = None

class ProductoDelete(BaseModel):
    id: int
    borrado_fecha: datetime = Field(default_factory=datetime.now)
