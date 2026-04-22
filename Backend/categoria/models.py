from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from producto.models import Producto


class CategoriaBase(SQLModel):
    nombre: str = Field(index=True, nullable=False, min_length=3, max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    orden_display: int = Field(default=0, ge=0)
    fecha_creacion: datetime = Field(default_factory=datetime.now)
    fecha_actualizacion: datetime = Field(default_factory=datetime.now)
    borrado_fecha: Optional[datetime] = Field(default=None)

class Categoria(CategoriaBase, table=True):
    __tablename__ = "categorias"
    id: Optional[int] = Field(default=None, primary_key=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="categorias.id", ondelete="SET NULL") # P05 Self-Ref

    # Self-referencing - hijos (one-to-many) y padre (many-to-one)
    hijos: List["Categoria"] = Relationship(
        back_populates="padre",
        sa_relationship_kwargs={
            "primaryjoin": "Categoria.id == foreign(Categoria.parent_id)",
            "uselist": True,
        }
    )
    padre: Optional["Categoria"] = Relationship(
        back_populates="hijos",
        sa_relationship_kwargs={
            "primaryjoin": "Categoria.parent_id == remote(Categoria.id)",
            "foreign_keys": "[Categoria.parent_id]",
            "uselist": False,
        }
    )
    #relacion con productos
    productos_relacionados: List["ProductoCategoria"] = Relationship(back_populates="categoria")

class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categorias"
    producto_id: int = Field(foreign_key="productos.id", primary_key=True, ondelete="CASCADE")
    categoria_id: int = Field(foreign_key="categorias.id", primary_key=True, ondelete="RESTRICT")
    es_principal: bool = Field(default=True)
    fecha_creacion: datetime = Field(default_factory=datetime.now)
    
    producto: Optional["Producto"] = Relationship(back_populates="categorias_relacionadas")
    categoria: Optional["Categoria"] = Relationship(back_populates="productos_relacionados")