export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
    orden_display: number;
    parent_id: number | null;
    fecha_creacion: string;
}

export interface Ingrediente {
    id: number;
    nombre: string;
    es_alergeno: boolean;
}

export interface Producto{
    id: number;
    nombre: string;
    descripcion: string | null;
    precio_base: number;
    imagenes_url: string[];
    tiempo_prep_min: number | null;
    disponible: boolean;
    fecha_creacion: string;
}