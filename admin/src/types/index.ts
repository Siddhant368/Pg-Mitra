export interface Pg {
  id?: string;
  _id?: string;
  name: string;
  address?: string;
  city?: string;
  roomsCount?: number;
  totalBeds?: number;
  occupiedBeds?: number;
  vacantBeds?: number;
  createdAt?: string;
  ownerId?: string;
}

export interface Bed {
  _id: string;
  id?: string;
  bedNumber: string;
  isOccupied: boolean;
}

export interface Room {
  _id: string;
  id?: string;
  pgId: string;
  roomNumber: string;
  floor: number;
  sharing: number;
  rentPerBed: number;
  beds: Bed[];
}
