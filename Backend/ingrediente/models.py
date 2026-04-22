from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, Optional, List

if TYPE_CHECKING:
    from producto.models import ProductoIngrediente

class IngredienteBase(SQLModel):
    nombre: str = Field(index=True, nullable=False, min_length=3, max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    es_alergeno: bool = Field(default=False)
    

class Ingrediente(IngredienteBase, table=True):
    __tablename__ = "ingredientes"
    id: Optional[int] = Field(default=None, primary_key=True)
    #relacion con productos
    productos_relacionados: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")