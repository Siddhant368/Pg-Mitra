export interface Pg {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactPhone?: string;
  type?: string;
  roomsCount?: number;
  totalRooms?: number;
  totalBeds?: number;
  occupiedBeds?: number;
  vacantBeds?: number;
  rentRange?: string;
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
}

export interface Bed {
  _id?: string;
  id?: string;
  bedNumber: string;
  isOccupied?: boolean;
  status?: "VACANT" | "OCCUPIED" | "MAINTENANCE" | string;
  tenantName?: string;
  tenantPhone?: string;
}

export interface Room {
  _id?: string;
  id?: string;
  pgId: string;
  roomNumber: string;
  floor?: number | string;
  roomType?: string; // SINGLE, DOUBLE, TRIPLE, FOUR_SHARING, etc.
  sharing?: number;
  bedCapacity?: number;
  totalBeds?: number;
  occupiedBeds?: number;
  availableBeds?: number;
  rentPerBed?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  bathroomType?: "ATTACHED" | "SHARED" | "COMMON" | string;
  furnishing?: "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED" | string;
  description?: string;
  status?: "VACANT" | "OCCUPIED" | "PARTIALLY_OCCUPIED" | string;
  beds?: Bed[];
  createdAt?: string;
  updatedAt?: string;
}
