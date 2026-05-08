export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
    orden_display: number;
    parent_id: number | null;
    fecha_creacion: string;
}
