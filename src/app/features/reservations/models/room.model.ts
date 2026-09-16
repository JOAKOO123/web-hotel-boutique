export interface Room {
  number: string;
  type: 'single' | 'double' | 'suite';
  pricePerNight: number;
}