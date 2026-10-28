"use client";

import { useState, useMemo } from "react";
import { 
  DoorClosed, 
  Search, 
  BedDouble, 
  Edit3, 
  Trash2, 
  Plus, 
  X
} from "lucide-react";
import { Room } from "@/types";

interface RoomListProps {
  rooms: Room[];
  onAddRoom: () => void;
  onViewBeds: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom?: (room: Room) => void;
  canDelete?: boolean;
}

function formatFloor(floor?: number | string): string {
  if (floor === undefined || floor === null || floor === "") return "Ground Floor";
  const num = Number(floor);
  if (isNaN(num)) return `Floor ${floor}`;
  if (num === 0) return "Ground Floor";
  if (num === 1) return "First Floor";
  if (num === 2) return "Second Floor";
  if (num === 3) return "Third Floor";
  if (num === 4) return "Fourth Floor";
  return `Floor ${num}`;
}

function formatSharing(capacity: number, roomType?: string): string {
  if (roomType) {
    const norm = roomType.toUpperCase();
    if (norm === "SINGLE") return "Single Sharing";
    if (norm === "DOUBLE") return "Double Sharing";
    if (norm === "TRIPLE") return "Triple Sharing";
    if (norm === "FOUR_SHARING") return "Four Sharing";
  }
  if (capacity === 1) return "Single Sharing";
  if (capacity === 2) return "Double Sharing";
  if (capacity === 3) return "Triple Sharing";
  return `${capacity} Sharing`;
}

export default function RoomList({
  rooms,
  onAddRoom,
  onViewBeds,
  onEditRoom,
  onDeleteRoom,
  canDelete = false,
}: RoomListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [floorFilter, setFloorFilter] = useState("ALL");
  const [sharingFilter, setSharingFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Extract distinct floors from rooms
  const availableFloors = useMemo(() => {
    const floors = new Set<string>();
    rooms.forEach((r) => {
      if (r.floor !== undefined && r.floor !== null) {
        floors.add(String(r.floor));
      }
    });
    return Array.from(floors).sort((a, b) => Number(a) - Number(b));
  }, [rooms]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search by room number
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const numMatch = room.roomNumber.toLowerCase().includes(query);
        if (!numMatch) return false;
      }

      // Filter by floor
      if (floorFilter !== "ALL") {
        if (String(room.floor) !== floorFilter) return false;
      }

      // Filter by sharing
      const capacity =
        room.bedCapacity ||
        room.sharing ||
        room.totalBeds ||
        (room.beds ? room.beds.length : 1);

      if (sharingFilter !== "ALL") {
        if (sharingFilter === "4+" && capacity < 4) return false;
        if (sharingFilter !== "4+" && capacity !== parseInt(sharingFilter, 10)) {
          return false;
        }
      }

      // Filter by status
      const occupied =
        room.occupiedBeds ??
        (room.beds ? room.beds.filter((b) => b.isOccupied).length : 0);

      const isVacant = occupied === 0;
      const isFull = occupied >= capacity && capacity > 0;
      const isPartial = occupied > 0 && occupied < capacity;

      if (statusFilter === "VACANT" && !isVacant) return false;
      if (statusFilter === "OCCUPIED" && !isFull) return false;
      if (statusFilter === "PARTIAL" && !isPartial) return false;

      return true;
    });
  }, [rooms, searchQuery, floorFilter, sharingFilter, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    floorFilter !== "ALL" ||
    sharingFilter !== "ALL" ||
    statusFilter !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setFloorFilter("ALL");
    setSharingFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-4">
      {/* 1. Search and Filters Toolbar */}
      {rooms.length > 0 && (
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-[#7186A5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room number..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] placeholder-[#7186A5] focus:outline-none focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] min-h-[40px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7186A5] hover:text-[#102A56] p-1"
                aria-label="Clear room search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Floor filter */}
            {availableFloors.length > 0 && (
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="px-2.5 py-2 text-xs bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] font-semibold outline-none min-h-[40px] cursor-pointer"
                aria-label="Filter by floor"
              >
                <option value="ALL">All Floors</option>
                {availableFloors.map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>
            )}

            {/* Sharing Filter */}
            <select
              value={sharingFilter}
              onChange={(e) => setSharingFilter(e.target.value)}
              className="px-2.5 py-2 text-xs bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] font-semibold outline-none min-h-[40px] cursor-pointer"
              aria-label="Filter by sharing"
            >
              <option value="ALL">All Sharing</option>
              <option value="1">1 Bed (Single)</option>
              <option value="2">2 Beds (Double)</option>
              <option value="3">3 Beds (Triple)</option>
              <option value="4+">4+ Beds</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 text-xs bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] font-semibold outline-none min-h-[40px] cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="ALL">All Status</option>
              <option value="VACANT">Vacant</option>
              <option value="PARTIAL">Partially Occupied</option>
              <option value="OCCUPIED">Fully Occupied</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2 py-2 text-xs text-[#0F8B83] hover:text-[#08756E] hover:underline font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Empty State: No Rooms Added At All */}
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[35vh] p-6 sm:p-10 border-2 border-dashed border-[#E1EAF4] rounded-3xl bg-white text-center">
          <div className="w-16 h-16 bg-[#E8F7F5] rounded-full flex items-center justify-center mb-4">
            <DoorClosed className="h-8 w-8 text-[#0F8B83]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#102A56] mb-1.5">
            No rooms added yet
          </h3>
          <p className="text-slate-500 max-w-md text-xs sm:text-sm mb-6 leading-relaxed">
            Configure rooms for this property to manage bed allocations, set monthly
            rents, and monitor occupancy status.
          </p>
          <button
            onClick={onAddRoom}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-bold shadow-sm text-xs sm:text-sm min-h-[44px]"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            <span>Add First Room</span>
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        /* Empty State: Filter Returned No Match */
        <div className="p-8 border border-[#E1EAF4] rounded-2xl bg-white text-center">
          <p className="text-sm font-semibold text-[#102A56] mb-1">
            No rooms match your search or filter criteria.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-[#0F8B83] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* 3. Room Cards Stack (Matching Screen 5 Reference Hierarchy) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredRooms.map((room) => {
            const roomId = room._id || room.id || room.roomNumber;
            const capacity =
              room.bedCapacity ||
              room.sharing ||
              room.totalBeds ||
              (room.beds ? room.beds.length : 1);

            const occupied =
              room.occupiedBeds ??
              (room.beds ? room.beds.filter((b) => b.isOccupied).length : 0);

            const available = Math.max(0, capacity - occupied);
            const rent = room.monthlyRent || room.rentPerBed || 0;

            const floorText = formatFloor(room.floor);
            const sharingText = formatSharing(capacity, room.roomType);

            // Status Badge logic
            let statusLabel = "Vacant";
            let statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

            if (occupied >= capacity && capacity > 0) {
              statusLabel = "Fully Occupied";
              statusBadge = "bg-rose-50 text-rose-700 border-rose-200";
            } else if (occupied > 0) {
              statusLabel = "Partially Occupied";
              statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
            }

            return (
              <div
                key={roomId}
                className="bg-white rounded-2xl border border-[#E1EAF4] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Row 1: Room Number & Occupancy Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] font-bold text-sm shrink-0">
                        <DoorClosed className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-base text-[#102A56] group-hover:text-[#0F8B83] transition-colors leading-tight truncate">
                        Room {room.roomNumber}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${statusBadge}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {/* Row 2: Floor · Room Type */}
                  <p className="text-xs font-semibold text-[#7186A5] mb-2.5 pl-0.5">
                    {floorText} · {sharingText}
                  </p>

                  {/* Row 3: Bed Statistics Summary */}
                  <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] mb-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-[#102A56]">
                      <span>{capacity} {capacity === 1 ? "Bed" : "Beds"}</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-amber-700">{occupied} Occupied</span>
                        <span className="text-[#7186A5]">·</span>
                        <span className="text-emerald-700">{available} Available</span>
                      </div>
                    </div>

                    {/* Mini Visual Capacity Bar */}
                    <div className="w-full h-1.5 rounded-full bg-emerald-200 overflow-hidden flex">
                      <div
                        className="bg-amber-500 h-full transition-all"
                        style={{ width: `${capacity > 0 ? (occupied / capacity) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Row 4: Monthly Rent */}
                  <div className="flex items-baseline justify-between mb-3 px-0.5">
                    <span className="text-[11px] font-semibold text-[#7186A5]">Monthly Rent</span>
                    <span className="text-base font-extrabold text-[#0F8B83]">
                      {rent > 0 ? `₹${rent.toLocaleString()}/month` : "Price not set"}
                    </span>
                  </div>

                  {room.description && (
                    <p className="text-[11px] text-[#7186A5] line-clamp-1 mb-3 italic">
                      &quot;{room.description}&quot;
                    </p>
                  )}
                </div>

                {/* Bottom Action Buttons: [View Beds] (Teal) + [Edit] */}
                <div className="pt-3 border-t border-[#E1EAF4] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => onViewBeds(room)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F8B83] hover:bg-[#08756E] transition-all shadow-xs flex-1 min-h-[40px]"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>View Beds</span>
                    </button>

                    <button
                      onClick={() => onEditRoom(room)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#102A56] bg-[#F5F8FC] hover:bg-[#E8F7F5] hover:text-[#0F8B83] border border-[#E1EAF4] transition-all min-h-[40px]"
                      title="Edit Room"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {canDelete && onDeleteRoom && (
                    <button
                      onClick={() => onDeleteRoom(room)}
                      className="p-2 rounded-xl text-[#7186A5] hover:text-rose-600 hover:bg-rose-50 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Delete Room"
                      aria-label={`Delete Room ${room.roomNumber}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
