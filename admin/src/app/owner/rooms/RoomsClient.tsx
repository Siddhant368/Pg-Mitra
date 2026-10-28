"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlusCircle, 
  ArrowLeft, 
  Building2, 
  AlertCircle, 
  RefreshCw, 
  Info,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Pg, Room } from "@/types";

// Subcomponents
import RoomSummaryCards from "@/components/owner/rooms/RoomSummaryCards";
import RoomList from "@/components/owner/rooms/RoomList";
import AddRoomModal from "@/components/owner/rooms/AddRoomModal";
import EditRoomModal from "@/components/owner/rooms/EditRoomModal";
import ViewBedsModal from "@/components/owner/rooms/ViewBedsModal";

interface RoomsClientProps {
  initialPgId?: string;
}

export default function RoomsClient({ initialPgId }: RoomsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlPgId = searchParams.get("pgId") || initialPgId || "";
  const actionParam = searchParams.get("action");

  // State
  const [pgs, setPgs] = useState<Pg[]>([]);
  const [selectedPgId, setSelectedPgId] = useState<string>(urlPgId);
  const [selectedPg, setSelectedPg] = useState<Pg | null>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(actionParam === "add");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewBedsModalOpen, setIsViewBedsModalOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // 1. Initial Load: Fetch all PGs
  useEffect(() => {
    let ignore = false;
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const pgsData: Pg[] = await fetchApi("/owner/pgs");
        if (ignore) return;
        setPgs(pgsData || []);

        if (pgsData && pgsData.length > 0) {
          const targetId =
            urlPgId && pgsData.some((p) => (p._id || p.id) === urlPgId)
              ? urlPgId
              : pgsData[0]._id || pgsData[0].id || "";

          setSelectedPgId(targetId);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load properties.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProperties();
    return () => {
      ignore = true;
    };
  }, [urlPgId, refreshIndex]);

  // 2. Fetch Selected PG Details and Rooms whenever selectedPgId changes
  const loadRoomsForPg = async (pgId: string) => {
    if (!pgId) return;

    setRoomsLoading(true);
    setApiNotice(null);

    // Fetch PG details
    try {
      const pgDetail: Pg = await fetchApi(`/owner/pgs/${pgId}`);
      setSelectedPg(pgDetail);
    } catch (err: unknown) {
      console.warn("Could not load PG details:", err);
    }

    // Attempt to fetch rooms from backend API
    try {
      const roomsData = await fetchApi(`/owner/pgs/${pgId}/rooms`);
      if (Array.isArray(roomsData)) {
        setRooms(roomsData);
      } else {
        setRooms([]);
      }
    } catch {
      // Graceful error handling for missing backend endpoint
      setRooms([]);
      setApiNotice(
        `Backend Room API endpoint (GET /owner/pgs/${pgId}/rooms) is not yet available on the backend server. Summary values below reflect verified property details registered in your account.`
      );
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedPgId) return;
    let ignore = false;

    const run = async () => {
      setRoomsLoading(true);
      setApiNotice(null);

      try {
        const pgDetail: Pg = await fetchApi(`/owner/pgs/${selectedPgId}`);
        if (!ignore) setSelectedPg(pgDetail);
      } catch (err: unknown) {
        console.warn("Could not load PG details:", err);
      }

      try {
        const roomsData = await fetchApi(`/owner/pgs/${selectedPgId}/rooms`);
        if (!ignore) {
          if (Array.isArray(roomsData)) {
            setRooms(roomsData);
          } else {
            setRooms([]);
          }
        }
      } catch {
        if (!ignore) {
          setRooms([]);
          setApiNotice(
            `Backend Room API endpoint (GET /owner/pgs/${selectedPgId}/rooms) is not yet available on the backend server. Summary values below reflect verified property details registered in your account.`
          );
        }
      } finally {
        if (!ignore) setRoomsLoading(false);
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, [selectedPgId]);

  // Handle switching PG
  const handlePgChange = (newPgId: string) => {
    setSelectedPgId(newPgId);
    router.push(`/owner/rooms?pgId=${newPgId}`);
  };

  // Modals callbacks
  const handleRoomAdded = (newRoom: Room) => {
    setRooms((prev) => [newRoom, ...prev]);
    setSuccessMessage(`Room ${newRoom.roomNumber} added successfully.`);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handleRoomUpdated = (updatedRoom: Room) => {
    setRooms((prev) =>
      prev.map((r) =>
        (r._id && r._id === updatedRoom._id) ||
        (r.id && r.id === updatedRoom.id) ||
        r.roomNumber === updatedRoom.roomNumber
          ? updatedRoom
          : r
      )
    );
    setSuccessMessage(`Room ${updatedRoom.roomNumber} updated successfully.`);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handleViewBeds = (room: Room) => {
    setActiveRoom(room);
    setIsViewBedsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setActiveRoom(room);
    setIsEditModalOpen(true);
  };

  // Summary statistics calculated strictly from verified API data
  const summary = useMemo(() => {
    const totalRooms =
      rooms.length > 0 ? rooms.length : (selectedPg?.totalRooms || 0);

    const totalBeds =
      rooms.length > 0
        ? rooms.reduce(
            (acc, r) =>
              acc +
              (r.bedCapacity ||
                r.sharing ||
                r.totalBeds ||
                (r.beds ? r.beds.length : 0)),
            0
          )
        : (selectedPg?.totalBeds || 0);

    const occupiedBeds = rooms.reduce(
      (acc, r) =>
        acc +
        (r.occupiedBeds ??
          (r.beds ? r.beds.filter((b) => b.isOccupied).length : 0)),
      0
    );

    const availableBeds = Math.max(0, totalBeds - occupiedBeds);

    return { totalRooms, totalBeds, occupiedBeds, availableBeds };
  }, [rooms, selectedPg]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-slate-200 rounded-xl w-48"></div>
          <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 sm:h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl mt-6"></div>
      </div>
    );
  }

  // Error loading initial properties
  if (error) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#102A56] mb-2">
            Error Loading Properties
          </h3>
          <p className="text-sm text-[#7186A5] mb-6 max-w-md">{error}</p>
          <button
            onClick={() => setRefreshIndex((k) => k + 1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-semibold text-sm shadow-sm min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty state if owner has 0 PGs
  if (pgs.length === 0) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[45vh] p-6 sm:p-12 border-2 border-dashed border-[#E1EAF4] rounded-3xl bg-white text-center">
          <div className="w-16 h-16 bg-[#E8F7F5] rounded-full flex items-center justify-center mb-4 text-[#0F8B83]">
            <Building2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#102A56] mb-2">
            No Properties Found
          </h2>
          <p className="text-slate-500 max-w-md text-xs sm:text-sm mb-6 leading-relaxed">
            Before configuring rooms, please add at least one PG or hostel to your
            account.
          </p>
          <Link
            href="/owner/pgs/add"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-bold text-xs sm:text-sm shadow-sm min-h-[44px]"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>Add Your First PG</span>
          </Link>
        </div>
      </div>
    );
  }

  const effectivePgName = selectedPg?.name || "Selected Property";

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* 1. Top Header: Back navigation, Title, Breadcrumbs, PG Selector, Add Room Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <Link
            href={selectedPgId ? `/owner/pgs/${selectedPgId}` : "/owner/pgs"}
            className="p-2 sm:p-2.5 bg-white rounded-xl border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors shadow-xs shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Back to Property"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#102A56] tracking-tight">
              Room Management
            </h1>
            {/* Breadcrumb / PG indicator */}
            <div className="flex items-center gap-1.5 text-xs text-[#7186A5] mt-0.5 truncate font-medium">
              <Link href="/owner/pgs" className="hover:text-[#0F8B83] transition-colors">
                My PGs
              </Link>
              <ChevronRight className="w-3 h-3 text-[#7186A5]/60 shrink-0" />
              {selectedPgId ? (
                <Link
                  href={`/owner/pgs/${selectedPgId}`}
                  className="hover:text-[#0F8B83] transition-colors font-semibold text-[#102A56] truncate"
                >
                  {effectivePgName}
                </Link>
              ) : (
                <span>All Rooms</span>
              )}
              <ChevronRight className="w-3 h-3 text-[#7186A5]/60 shrink-0" />
              <span className="text-[#0F8B83] font-semibold">Rooms</span>
            </div>
          </div>
        </div>

        {/* Right side controls: Property selector + Add Room button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 self-start sm:self-auto">
          {pgs.length > 1 && (
            <div className="flex items-center bg-white border border-[#E1EAF4] rounded-xl px-3 py-1.5 shadow-xs min-h-[42px]">
              <Building2 className="w-4 h-4 text-[#7186A5] mr-2 shrink-0" />
              <select
                value={selectedPgId}
                onChange={(e) => handlePgChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-[#102A56] outline-none cursor-pointer pr-1"
                aria-label="Select property"
              >
                {pgs.map((p) => {
                  const id = p._id || p.id || "";
                  return (
                    <option key={id} value={id}>
                      {p.name} {p.city ? `(${p.city})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-[#0F8B83] hover:bg-[#08756E] text-white rounded-xl transition-all font-bold text-xs sm:text-sm shadow-sm shadow-[#0F8B83]/20 min-h-[42px]"
          >
            <PlusCircle className="mr-1.5 h-4 w-4 stroke-[2.5]" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* 2. Success Feedback Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between text-xs sm:text-sm text-emerald-800 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Missing Backend API Information Banner */}
      {apiNotice && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Backend API Status Notice</span>
              <span className="text-[11px] leading-relaxed text-amber-800">
                {apiNotice}
              </span>
            </div>
          </div>
          <button
            onClick={() => loadRoomsForPg(selectedPgId)}
            disabled={roomsLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold text-xs transition-colors shrink-0 disabled:opacity-50 min-h-[36px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${roomsLoading ? "animate-spin" : ""}`} />
            <span>Retry Endpoint</span>
          </button>
        </div>
      )}

      {/* 4. Verified Summary Cards (2x2 on Mobile, 4x1 on Desktop) */}
      <RoomSummaryCards
        totalRooms={summary.totalRooms}
        totalBeds={summary.totalBeds}
        occupiedBeds={summary.occupiedBeds}
        availableBeds={summary.availableBeds}
      />

      {/* 5. Room List (Cards, Filters, Empty State) */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-bold text-[#102A56] flex items-center gap-2">
            <span>Rooms in {effectivePgName}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F7F5] text-[#0F8B83] font-bold">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </span>
          </h2>
        </div>

        {roomsLoading ? (
          <div className="p-8 bg-white rounded-3xl border border-[#E1EAF4] flex flex-col items-center justify-center min-h-[220px]">
            <RefreshCw className="w-8 h-8 text-[#0F8B83] animate-spin mb-3" />
            <p className="text-xs font-semibold text-[#7186A5]">Loading rooms...</p>
          </div>
        ) : (
          <RoomList
            rooms={rooms}
            onAddRoom={() => setIsAddModalOpen(true)}
            onViewBeds={handleViewBeds}
            onEditRoom={handleEditRoom}
            canDelete={false}
          />
        )}
      </div>

      {/* Modals */}
      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        pgs={pgs}
        selectedPgId={selectedPgId}
        onRoomAdded={handleRoomAdded}
      />

      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setActiveRoom(null);
        }}
        room={activeRoom}
        onRoomUpdated={handleRoomUpdated}
      />

      <ViewBedsModal
        isOpen={isViewBedsModalOpen}
        onClose={() => {
          setIsViewBedsModalOpen(false);
          setActiveRoom(null);
        }}
        room={activeRoom}
        pgName={effectivePgName}
        onEditRoom={handleEditRoom}
      />
    </div>
  );
}
