from sqlalchemy import ARRAY, Column, String 
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ingrediente.models import Ingrediente
    from categoria.models import ProductoCategoria


class ProductoBase(SQLModel):
    nombre: str = Field(index=True, max_length=50, nullable=False)
    descripcion: Optional[str] = Field(max_length=255)
    precio_base: float = Field(ge=0)
    tiempo_prep_min: Optional[int] = Field(default=None, ge=0)
    disponible: bool = Field(default=True)
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)
    fecha_actualizacion: datetime = Field(default_factory=datetime.utcnow)
    borrado_fecha: Optional[datetime] = Field(default=None)

class Producto(ProductoBase, table=True):
    __tablename__ = "productos"
    id: Optional[int] = Field(default=None, primary_key=True)
    imagenes_url: Optional[List[str]] = Field(
        default=None,
        sa_column=Column(ARRAY(String), nullable=True)
    )
    categorias_relacionadas: List["ProductoCategoria"] = Relationship(
        back_populates="producto"
    )
    ingredientes_relacionados: List["ProductoIngrediente"] = Relationship(  
        back_populates="producto"
    )
    
class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "producto_ingredientes"
    producto_id: int = Field(foreign_key="productos.id", primary_key=True, ondelete="CASCADE")
    ingrediente_id: int = Field(foreign_key="ingredientes.id", primary_key=True, ondelete="RESTRICT")
    removible: bool = Field(default=False)
    opcional: bool = Field(default=False)
    producto: Optional["Producto"] = Relationship(back_populates="ingredientes_relacionados")
    ingrediente: Optional["Ingrediente"] = Relationship(back_populates="productos_relacionados")
