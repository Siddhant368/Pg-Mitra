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
      const isFull = occupied >= capacity;
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
      {/* Search and Filters Toolbar */}
      {rooms.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#7186A5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room number..."
              className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] placeholder-[#7186A5] focus:outline-none focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7186A5] hover:text-[#102A56]"
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
                className="px-3 py-2 text-xs bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] font-medium outline-none"
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
              className="px-3 py-2 text-xs bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] font-medium outline-none"
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
              className="px-3 py-2 text-xs bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] font-medium outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="VACANT">Vacant</option>
              <option value="PARTIAL">Partially Occupied</option>
              <option value="OCCUPIED">Fully Occupied</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-xs text-[#0F8B83] hover:text-[#08756E] hover:underline font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty State: No Rooms Added At All */}
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[35vh] p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white text-center">
          <div className="w-16 h-16 bg-[#E8F7F5] rounded-full flex items-center justify-center mb-4">
            <DoorClosed className="h-8 w-8 text-[#0F8B83]" />
          </div>
          <h3 className="text-xl font-bold text-[#102A56] mb-2">
            No rooms added yet
          </h3>
          <p className="text-slate-500 max-w-md text-xs sm:text-sm mb-6">
            Configure rooms for this property to manage bed allocations, set monthly
            rents, and monitor occupancy status.
          </p>
          <button
            onClick={onAddRoom}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors font-medium shadow-sm text-xs sm:text-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Room
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        /* Empty State: Filter Returned No Match */
        <div className="p-8 border border-[#E1EAF4] rounded-2xl bg-white text-center">
          <p className="text-sm text-[#7186A5] mb-3">
            No rooms match your search or filter criteria.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-[#0F8B83] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Room Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            let statusLabel = "Vacant";
            let statusPillStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";

            if (occupied >= capacity && capacity > 0) {
              statusLabel = "Full";
              statusPillStyle = "bg-slate-100 text-slate-700 border-slate-200";
            } else if (occupied > 0) {
              statusLabel = `${occupied}/${capacity} Occupied`;
              statusPillStyle = "bg-amber-50 text-amber-700 border-amber-200";
            }

            return (
              <div
                key={roomId}
                className="bg-white rounded-2xl border border-[#E1EAF4] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Room Number & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] font-bold text-sm shrink-0">
                        <DoorClosed className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#102A56] group-hover:text-[#0F8B83] transition-colors leading-tight">
                          Room {room.roomNumber}
                        </h4>
                        {room.floor !== undefined && room.floor !== null && (
                          <span className="text-[11px] text-[#7186A5]">
                            Floor {room.floor}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${statusPillStyle}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {/* Room Configuration Grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] my-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#7186A5] block">
                        Bed Capacity
                      </span>
                      <span className="font-bold text-[#102A56]">
                        {capacity} {capacity === 1 ? "Bed" : "Beds"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7186A5] block">
                        Availability
                      </span>
                      <span className="font-bold text-emerald-600">
                        {available} Available
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7186A5] block">
                        Monthly Rent
                      </span>
                      <span className="font-bold text-[#102A56]">
                        {rent > 0 ? `₹${rent.toLocaleString()}` : "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7186A5] block">
                        Bathroom
                      </span>
                      <span className="font-semibold text-slate-700 capitalize">
                        {room.bathroomType
                          ? room.bathroomType.toLowerCase()
                          : "Attached"}
                      </span>
                    </div>
                  </div>

                  {room.description && (
                    <p className="text-[11px] text-[#7186A5] line-clamp-2 mb-3 italic">
                      &quot;{room.description}&quot;
                    </p>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-[#E1EAF4] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewBeds(room)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100 transition-colors"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>View Beds</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditRoom(room)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Room"
                      aria-label={`Edit Room ${room.roomNumber}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {canDelete && onDeleteRoom && (
                      <button
                        onClick={() => onDeleteRoom(room)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Room"
                        aria-label={`Delete Room ${room.roomNumber}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
