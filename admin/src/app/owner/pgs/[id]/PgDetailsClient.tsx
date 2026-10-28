"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  BedDouble, 
  DoorClosed, 
  Phone, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  AlertCircle,
  Info
} from "lucide-react";

interface Pg {
  _id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPhone: string;
  type: string;
  totalRooms: number;
  totalBeds: number;
  rentRange?: string;
  amenities?: string[];
  createdAt: string;
}

export default function PgDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [pg, setPg] = useState<Pg | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "documents" | "settings">("overview");

  useEffect(() => {
    const fetchPg = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchApi(`/owner/pgs/${resolvedParams.id}`);
        setPg(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load PG details");
      } finally {
        setLoading(false);
      }
    };

    fetchPg();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-5 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3 mb-4"></div>
        <div className="h-44 bg-slate-200 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-48 bg-slate-200 rounded-2xl"></div>
          <div className="h-48 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#102A56] mb-2">Error Loading Property</h3>
          <p className="text-sm text-[#7186A5] mb-6 max-w-md">{error || "Property not found"}</p>
          <Link
            href="/owner/pgs"
            className="flex items-center px-5 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-semibold text-sm shadow-sm min-h-[44px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Properties</span>
          </Link>
        </div>
      </div>
    );
  }

  const typeStr = (pg.type || "BOYS").toUpperCase();
  let typePillStyle = "bg-[#E8F7F5] text-[#0F8B83] border-[#0F8B83]/20";
  if (typeStr === "GIRLS") {
    typePillStyle = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (typeStr === "COED") {
    typePillStyle = "bg-purple-50 text-purple-700 border-purple-200";
  }

  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* 1. Header with Back button and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/owner/pgs"
            className="p-2 sm:p-2.5 bg-white rounded-xl border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors shadow-xs shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Back to Properties"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#102A56] tracking-tight truncate">
                {pg.name}
              </h1>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${typePillStyle}`}>
                {pg.type || "PG"}
              </span>
            </div>
            <p className="text-xs text-[#7186A5] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="h-3 w-3 shrink-0 text-[#0F8B83]" />
              <span className="truncate">{pg.address}, {pg.city}, {pg.state} - {pg.pincode}</span>
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href={`/owner/rooms?pgId=${pg._id}`}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-all font-semibold text-xs sm:text-sm shadow-sm shadow-[#0F8B83]/20 min-h-[42px]"
          >
            <DoorClosed className="mr-1.5 h-4 w-4" />
            <span>Manage Rooms</span>
          </Link>
          <Link
            href={`/owner/pgs/${pg._id}/edit`}
            className="inline-flex items-center justify-center px-3.5 py-2.5 bg-white border border-[#E1EAF4] text-[#102A56] hover:text-[#0F8B83] hover:bg-[#F5F8FC] rounded-xl transition-all font-semibold text-xs sm:text-sm shadow-xs min-h-[42px]"
          >
            <Edit className="mr-1.5 h-3.5 w-3.5 text-[#7186A5]" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Property Banner Card (Screen 4 Visual Direction) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0F8B83] via-[#0B756E] to-[#102A56] p-5 sm:p-7 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Verified PG Property</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {pg.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              {pg.description || "Property configured and operational under PGMitra Owner Suite."}
            </p>
          </div>

          {/* Quick Metrics Badge Strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0">
            <div className="px-2">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Rooms</span>
              <span className="text-lg sm:text-xl font-black text-white">{pg.totalRooms || 0}</span>
            </div>
            <div className="px-2 border-x border-white/15">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Beds</span>
              <span className="text-lg sm:text-xl font-black text-white">{pg.totalBeds || 0}</span>
            </div>
            <div className="px-2">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Rent</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-300 mt-1 block">
                {pg.rentRange ? `₹${pg.rentRange}` : "Flexible"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Responsive Horizontally Scrollable Tab Navigation */}
      <div className="border-b border-[#E1EAF4] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: "overview", label: "Overview", icon: Info },
          { id: "rooms", label: "Rooms & Beds", icon: BedDouble },
          { id: "documents", label: "Contact & Address", icon: MapPin },
          { id: "settings", label: "Settings", icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "rooms") {
                  router.push(`/owner/rooms?pgId=${pg._id}`);
                } else {
                  setActiveTab(tab.id as "overview" | "rooms" | "documents" | "settings");
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0 min-h-[42px] ${
                isActive
                  ? "bg-white text-[#0F8B83] border border-[#E1EAF4] shadow-xs"
                  : "text-[#7186A5] hover:text-[#102A56] hover:bg-white/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === "rooms" && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#E8F7F5] text-[#0F8B83]">
                  {pg.totalRooms || 0}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content: Overview Stacked Cards */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in duration-150">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            {/* About Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-[#102A56] mb-3 pb-2 border-b border-[#E1EAF4]">
                About This Property
              </h3>
              <p className="text-xs sm:text-sm text-[#7186A5] leading-relaxed whitespace-pre-wrap">
                {pg.description || "No description provided for this property yet. You can add more details via the Edit Details page."}
              </p>

              {/* Amenities tags if any */}
              {pg.amenities && pg.amenities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E1EAF4]">
                  <span className="text-xs font-bold text-[#102A56] block mb-2">Amenities & Facilities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pg.amenities.map((am, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] text-xs font-medium text-[#102A56]"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-[#102A56] mb-3 pb-2 border-b border-[#E1EAF4]">
                Contact & Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                  <span className="text-[10px] uppercase font-bold text-[#7186A5] block">
                    Contact Phone
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-[#102A56]">
                      {pg.contactPhone || "Not specified"}
                    </span>
                    {pg.contactPhone && (
                      <a
                        href={`tel:${pg.contactPhone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F7F5] text-[#0F8B83] text-xs font-bold hover:bg-[#0F8B83] hover:text-white transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                  <span className="text-[10px] uppercase font-bold text-[#7186A5] block">
                    Property Location
                  </span>
                  <p className="text-xs font-medium text-[#102A56] mt-1 line-clamp-2">
                    {pg.address}, {pg.city}, {pg.state} - {pg.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Column: Quick Stats & Room Management CTA */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-[#102A56] mb-3 pb-2 border-b border-[#E1EAF4]">
                Inventory Summary
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <DoorClosed className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7186A5] block font-medium">Total Rooms</span>
                      <span className="text-sm font-bold text-[#102A56]">{pg.totalRooms || 0}</span>
                    </div>
                  </div>
                  <Link
                    href={`/owner/rooms?pgId=${pg._id}`}
                    className="text-xs font-bold text-[#0F8B83] hover:underline"
                  >
                    View →
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7186A5] block font-medium">Bed Capacity</span>
                      <span className="text-sm font-bold text-[#102A56]">{pg.totalBeds || 0} Beds</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Active</span>
                </div>

                {pg.rentRange && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <span className="text-[10px] text-amber-800 uppercase font-bold block">
                      Monthly Rent Range
                    </span>
                    <span className="text-base font-extrabold text-amber-900 mt-0.5 block">
                      ₹{pg.rentRange}
                    </span>
                  </div>
                )}
              </div>

              {/* Direct Room CTA */}
              <div className="mt-4 pt-3 border-t border-[#E1EAF4]">
                <Link
                  href={`/owner/rooms?pgId=${pg._id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all min-h-[44px]"
                >
                  <BedDouble className="w-4 h-4" />
                  <span>Configure Rooms & Beds</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Contact & Address Tab */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-[#102A56]">Contact & Location Details</h3>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
              <span className="text-[10px] font-bold text-[#7186A5] uppercase block">Full Address</span>
              <p className="font-semibold text-[#102A56] mt-1">{pg.address}</p>
              <p className="text-[#7186A5] mt-0.5">{pg.city}, {pg.state} - {pg.pincode}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
              <span className="text-[10px] font-bold text-[#7186A5] uppercase block">Contact Phone Number</span>
              <p className="font-semibold text-[#102A56] mt-1">{pg.contactPhone || "Not provided"}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-[#102A56]">Property Settings</h3>
          <p className="text-xs text-[#7186A5]">
            Configure operational settings, edit property details, or manage listings.
          </p>
          <div className="pt-2">
            <Link
              href={`/owner/pgs/${pg._id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F8B83] text-white text-xs font-semibold hover:bg-[#08756E] transition-all min-h-[44px]"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Property Information</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
