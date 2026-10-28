"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { ArrowLeft, Edit, MapPin, Building, BedDouble, Users, AlertCircle, RefreshCw } from "lucide-react";

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
  createdAt: string;
}

export default function PgDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [pg, setPg] = useState<Pg | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPg = async () => {
      try {
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
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/3 mb-8"></div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Property</h3>
          <p className="text-red-600 mb-6">{error || "Property not found"}</p>
          <Link
            href="/owner/pgs"
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/owner/pgs" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{pg.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-50 text-forest-700">
                {pg.type}
              </span>
            </div>
            <div className="flex items-center text-sm text-slate-500 mt-1">
              <MapPin className="mr-1 h-4 w-4" />
              {pg.address}, {pg.city}, {pg.state} - {pg.pincode}
            </div>
          </div>
        </div>
        
        <Link
          href={`/owner/pgs/${pg._id}/edit`}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
        >
          <Edit className="mr-2 h-5 w-5 text-slate-500" />
          Edit Details
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">About this Property</h2>
            <p className="text-slate-600 whitespace-pre-wrap">
              {pg.description || "No description provided."}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 font-medium">Contact Phone</p>
                <p className="text-slate-800">{pg.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center mr-3">
                  <Building className="h-5 w-5 text-forest-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Rooms</p>
                  <p className="font-semibold text-slate-800">{pg.totalRooms}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <BedDouble className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Bed Capacity</p>
                  <p className="font-semibold text-slate-800">{pg.totalBeds}</p>
                </div>
              </div>

              {pg.rentRange && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                    <span className="font-bold text-amber-600 text-lg">₹</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Monthly Rent</p>
                    <p className="font-semibold text-slate-800">{pg.rentRange}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
