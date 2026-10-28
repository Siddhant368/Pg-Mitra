"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  PlusCircle, 
  Building2, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2, 
  AlertCircle, 
  RefreshCw, 
  BedDouble,
  Search,
  X
} from "lucide-react";

interface Pg {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  totalRooms: number;
  totalBeds: number;
  rentRange?: string;
  status?: string;
}

export default function PgsListPage() {
  const [pgs, setPgs] = useState<Pg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    const fetchPgs = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchApi("/owner/pgs");
        setPgs(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load PGs");
      } finally {
        setLoading(false);
      }
    };

    fetchPgs();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await fetchApi(`/owner/pgs/${id}`, { method: "DELETE" });
      setPgs((prev) => prev.filter((pg) => pg._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete PG");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered properties
  const filteredPgs = useMemo(() => {
    return pgs.filter((pg) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = pg.name?.toLowerCase().includes(query);
        const matchesCity = pg.city?.toLowerCase().includes(query);
        const matchesAddress = pg.address?.toLowerCase().includes(query);
        const matchesState = pg.state?.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesAddress && !matchesState) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== "ALL") {
        if (pg.type?.toUpperCase() !== typeFilter) {
          return false;
        }
      }

      return true;
    });
  }, [pgs, searchQuery, typeFilter]);

  const hasActiveFilters = searchQuery.trim() !== "" || typeFilter !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("ALL");
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-5 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-slate-200 rounded-xl w-48"></div>
          <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
        </div>
        <div className="h-12 bg-slate-200 rounded-2xl w-full mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#102A56] mb-2">Error Loading Properties</h3>
          <p className="text-sm text-[#7186A5] mb-6 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-5 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-semibold text-sm shadow-sm min-h-[44px]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* 1. Header with Title & Add PG button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#102A56] tracking-tight">
              Your PGs / Hostels
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F7F5] text-[#0F8B83] font-bold">
              {pgs.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7186A5] mt-0.5 font-medium">
            Manage your properties, room inventory, and capacities.
          </p>
        </div>

        <Link
          href="/owner/pgs/add"
          className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-all font-semibold text-xs sm:text-sm shadow-sm shadow-[#0F8B83]/20 min-h-[44px] self-start sm:self-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4 stroke-[2.5]" />
          <span>Add PG</span>
        </Link>
      </div>

      {/* 2. Mobile & Desktop Search + Filter Controls */}
      {pgs.length > 0 && (
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#7186A5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PG name, city, address..."
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] placeholder-[#7186A5] focus:outline-none focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] transition-all min-h-[42px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7186A5] hover:text-[#102A56] p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <span className="text-xs font-semibold text-[#7186A5] mr-1 hidden sm:inline">Filter:</span>
            {[
              { label: "All", value: "ALL" },
              { label: "Boys", value: "BOYS" },
              { label: "Girls", value: "GIRLS" },
              { label: "Co-ed", value: "COED" },
            ].map((chip) => {
              const isSelected = typeFilter === chip.value;
              return (
                <button
                  key={chip.value}
                  onClick={() => setTypeFilter(chip.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 min-h-[36px] ${
                    isSelected
                      ? "bg-[#0F8B83] text-white shadow-xs"
                      : "bg-[#F5F8FC] text-[#7186A5] hover:text-[#102A56] hover:bg-slate-100"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-[#0F8B83] hover:underline shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Empty State or Properties Grid/List */}
      {pgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] p-6 sm:p-10 border-2 border-dashed border-[#E1EAF4] rounded-3xl bg-white text-center mt-4">
          <div className="w-16 h-16 bg-[#E8F7F5] rounded-full flex items-center justify-center mb-4 text-[#0F8B83]">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#102A56] mb-1.5">No properties found</h3>
          <p className="text-xs sm:text-sm text-[#7186A5] max-w-md mb-6 leading-relaxed">
            You haven&apos;t added any PGs or hostels to your account yet. Add your first property to start managing rooms, beds, and students.
          </p>
          <Link
            href="/owner/pgs/add"
            className="inline-flex items-center justify-center px-5 py-3 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-bold text-xs sm:text-sm shadow-sm min-h-[44px]"
          >
            <PlusCircle className="mr-2 h-4 w-4 stroke-[2.5]" />
            <span>Add Your First PG</span>
          </Link>
        </div>
      ) : filteredPgs.length === 0 ? (
        <div className="p-8 border border-[#E1EAF4] rounded-2xl bg-white text-center">
          <p className="text-sm font-semibold text-[#102A56] mb-1">
            No properties matched your criteria
          </p>
          <p className="text-xs text-[#7186A5] mb-4">
            Try adjusting your search query or reset the filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#0F8B83] text-white rounded-xl text-xs font-semibold hover:bg-[#08756E] transition-all min-h-[40px]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Responsive Mobile Cards & Desktop Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredPgs.map((pg) => {
            const typeStr = (pg.type || "BOYS").toUpperCase();
            let typeBadgeStyle = "bg-[#E8F7F5] text-[#0F8B83] border-[#0F8B83]/20";
            if (typeStr === "GIRLS") {
              typeBadgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
            } else if (typeStr === "COED") {
              typeBadgeStyle = "bg-purple-50 text-purple-700 border-purple-200";
            }

            return (
              <div
                key={pg._id}
                className="bg-white rounded-2xl border border-[#E1EAF4] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Name + Type Pill */}
                  <div className="flex items-start justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="text-base font-bold text-[#102A56] group-hover:text-[#0F8B83] transition-colors truncate leading-tight"
                          title={pg.name}
                        >
                          {pg.name}
                        </h3>
                        <p className="text-[11px] text-[#7186A5] flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3 shrink-0 text-[#0F8B83]" />
                          <span className="truncate">{pg.city ? `${pg.city}, ${pg.state || ""}` : pg.address}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${typeBadgeStyle}`}
                    >
                      {pg.type || "PG"}
                    </span>
                  </div>

                  {/* Address line */}
                  {pg.address && (
                    <p className="text-xs text-[#7186A5] line-clamp-1 mb-3">
                      {pg.address}
                    </p>
                  )}

                  {/* Summary Metric Grid (Rooms, Capacity, Rent) */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] mb-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#7186A5] block">Total Rooms</span>
                      <span className="text-sm font-bold text-[#102A56]">{pg.totalRooms || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7186A5] block">Bed Capacity</span>
                      <span className="text-sm font-bold text-[#102A56]">{pg.totalBeds || 0} beds</span>
                    </div>
                    {pg.rentRange && (
                      <div className="col-span-2 pt-1.5 border-t border-[#E1EAF4]">
                        <span className="text-[10px] text-[#7186A5] block">Monthly Rent</span>
                        <span className="text-xs font-bold text-[#0F8B83]">₹{pg.rentRange}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Bar (Mobile First Layout) */}
                <div className="pt-3 border-t border-[#E1EAF4] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {/* Primary Action: Manage Rooms */}
                    <Link
                      href={`/owner/rooms?pgId=${pg._id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#0F8B83] hover:bg-[#08756E] rounded-xl transition-all shadow-xs flex-1 min-h-[40px] truncate"
                    >
                      <BedDouble className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">Manage Rooms</span>
                    </Link>

                    {/* Secondary Action: View Details */}
                    <Link
                      href={`/owner/pgs/${pg._id}`}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold text-[#102A56] bg-[#F5F8FC] hover:bg-[#E8F7F5] hover:text-[#0F8B83] border border-[#E1EAF4] rounded-xl transition-all min-h-[40px] shrink-0"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="hidden min-[380px]:inline">Details</span>
                    </Link>
                  </div>

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/owner/pgs/${pg._id}/edit`}
                      className="p-2 text-[#7186A5] hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Edit PG"
                      aria-label={`Edit ${pg.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(pg._id, pg.name)}
                      disabled={deletingId === pg._id}
                      className="p-2 text-[#7186A5] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Delete PG"
                      aria-label={`Delete ${pg.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
