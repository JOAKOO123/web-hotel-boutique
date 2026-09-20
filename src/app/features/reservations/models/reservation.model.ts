export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
}