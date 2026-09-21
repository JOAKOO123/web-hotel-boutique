export interface Habitacion {
  id: number;
  nombre: string;
  tipo: 'INDIVIDUAL' | 'DOBLE' | 'SUITE' | 'FAMILIAR';
  capacidad: number;
  precioPorNoche: number;
  disponible: boolean;
  descripcion: string;
  imagenUrl: string | null;
}