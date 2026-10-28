import Link from "next/link";
import { Building2, Plus, MapPin, Eye, ArrowRight, BedDouble } from "lucide-react";

interface PgItem {
  _id?: string;
  id?: string;
  name: string;
  address?: string;
  city?: string;
  type?: string;
  totalRooms?: number;
  totalBeds?: number;
  rentRange?: string;
}

interface PropertyOverviewProps {
  pgs: PgItem[];
}

export default function PropertyOverview({ pgs }: PropertyOverviewProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-[#E1EAF4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102A56]">
              Your Managed Properties ({pgs.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#7186A5]">
              Active PGs and hostels currently registered under your account.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/owner/pgs"
            className="text-xs sm:text-sm font-semibold text-[#0F8B83] hover:text-[#08756E] inline-flex items-center gap-1 hover:underline"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/owner/pgs/add"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add PG</span>
          </Link>
        </div>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pgs.slice(0, 3).map((pg) => {
          const pgId = pg._id || pg.id;
          return (
            <div
              key={pgId}
              className="p-5 rounded-2xl border border-[#E1EAF4] bg-[#F5F8FC]/50 hover:bg-white hover:border-[#0F8B83]/30 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base text-[#102A56] group-hover:text-[#0F8B83] transition-colors truncate">
                    {pg.name}
                  </h3>
                  {pg.type && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20 shrink-0">
                      {pg.type}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#7186A5] flex items-center gap-1.5 mb-4 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#0F8B83]" />
                  <span>{pg.address ? `${pg.address}, ${pg.city || ""}` : pg.city || "Location not set"}</span>
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-xl bg-white border border-[#E1EAF4]">
                  <div>
                    <span className="text-[10px] text-[#7186A5] block">Total Rooms</span>
                    <span className="text-sm font-bold text-[#102A56]">{pg.totalRooms || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7186A5] block">Total Beds</span>
                    <span className="text-sm font-bold text-[#102A56]">{pg.totalBeds || 0}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E1EAF4] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F8B83]">
                  {pg.rentRange ? `Rent: ${pg.rentRange}` : "Active Property"}
                </span>
                <Link
                  href={`/owner/pgs/${pgId}`}
                  className="p-1.5 rounded-lg text-[#7186A5] hover:text-[#0F8B83] hover:bg-white transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
