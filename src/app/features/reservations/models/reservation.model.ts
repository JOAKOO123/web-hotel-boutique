export interface Reserva {
  id: number;
  habitacionNombre: string;
  usuarioEmail: string;
  fechaCheckin: string;
  fechaCheckout: string;
  estado: 'CONFIRMADA' | 'CHECK_IN' | 'CHECK_OUT' | 'CANCELADA';
}

export interface ReservaRequest {
  habitacionId: number;
  fechaCheckin: string;
  fechaCheckout: string;
}