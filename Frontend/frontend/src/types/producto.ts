export interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio_base: number;
    imagenes_url: string[];
    tiempo_prep_min: number | null;
    disponible: boolean;
    fecha_creacion: string;
}
