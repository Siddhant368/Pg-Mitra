"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { PlusCircle, Building, MapPin, Eye, Edit, Trash2, AlertCircle, RefreshCw } from "lucide-react";

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
}

export default function PgsListPage() {
  const [pgs, setPgs] = useState<Pg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const data = await fetchApi("/owner/pgs");
        setPgs(data);
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

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
          <div className="h-10 bg-slate-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Properties</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Your PGs / Hostels</h1>
          <p className="text-slate-500 mt-1">Manage your properties across all locations.</p>
        </div>
        <Link
          href="/owner/pgs/add"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:ring-offset-2"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add PG
        </Link>
      </div>

      {pgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white text-center mt-8">
          <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mb-6">
            <Building className="h-8 w-8 text-forest-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No properties found</h3>
          <p className="text-slate-500 max-w-md mb-8">
            You haven&apos;t added any PGs or hostels to your account yet. Add your first property to start managing rooms, students, and payments.
          </p>
          <Link
            href="/owner/pgs/add"
            className="inline-flex items-center justify-center px-6 py-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors font-medium shadow-sm"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Your First PG
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {pgs.map((pg) => (
            <div key={pg._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-1" title={pg.name}>{pg.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-50 text-forest-700">
                    {pg.type}
                  </span>
                </div>
                
                <div className="flex items-start text-sm text-slate-500 mb-4">
                  <MapPin className="mr-1.5 h-4 w-4 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{pg.address}, {pg.city}, {pg.state}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Rooms</p>
                    <p className="text-lg font-semibold text-slate-800">{pg.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Capacity</p>
                    <p className="text-lg font-semibold text-slate-800">{pg.totalBeds} beds</p>
                  </div>
                </div>
                
                {pg.rentRange && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Monthly Rent</p>
                    <p className="text-sm font-medium text-slate-800">₹{pg.rentRange}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex space-x-2">
                  <Link 
                    href={`/owner/pgs/${pg._id}`}
                    className="p-2 text-slate-500 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link 
                    href={`/owner/pgs/${pg._id}/edit`}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(pg._id, pg.name)}
                  disabled={deletingId === pg._id}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}