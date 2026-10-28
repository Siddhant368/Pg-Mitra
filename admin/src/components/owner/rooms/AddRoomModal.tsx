"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle, Loader2, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Pg, Room } from "@/types";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  pgs: Pg[];
  selectedPgId: string;
  onRoomAdded: (newRoom: Room) => void;
}

const ROOM_TYPES = [
  { value: "SINGLE", label: "Single Room (1 Bed)", defaultCapacity: 1 },
  { value: "DOUBLE", label: "Double Sharing (2 Beds)", defaultCapacity: 2 },
  { value: "TRIPLE", label: "Triple Sharing (3 Beds)", defaultCapacity: 3 },
  { value: "FOUR_SHARING", label: "Four Sharing (4 Beds)", defaultCapacity: 4 },
  { value: "CUSTOM", label: "Custom Capacity", defaultCapacity: 1 },
];

export default function AddRoomModal({
  isOpen,
  onClose,
  pgs,
  selectedPgId,
  onRoomAdded,
}: AddRoomModalProps) {
  const defaultPgId =
    selectedPgId || (pgs.length > 0 ? pgs[0]._id || pgs[0].id || "" : "");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const pgId = selectedPropertyId || defaultPgId;

  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState<string>("1");
  const [roomType, setRoomType] = useState("DOUBLE");
  const [bedCapacity, setBedCapacity] = useState<string>("2");
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [securityDeposit, setSecurityDeposit] = useState<string>("");
  const [bathroomType, setBathroomType] = useState("ATTACHED");
  const [furnishing, setFurnishing] = useState("FURNISHED");
  const [description, setDescription] = useState("");

  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleRoomTypeChange = (newType: string) => {
    setRoomType(newType);
    const matched = ROOM_TYPES.find((t) => t.value === newType);
    if (matched && newType !== "CUSTOM") {
      setBedCapacity(matched.defaultCapacity.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setServerError("");

    const trimmedNumber = roomNumber.trim();
    if (!trimmedNumber) {
      setValidationError("Room number or name is required.");
      return;
    }

    if (!pgId) {
      setValidationError("Please select a PG / property.");
      return;
    }

    const capacityNum = parseInt(bedCapacity, 10);
    if (isNaN(capacityNum) || capacityNum < 1) {
      setValidationError("Bed capacity must be at least 1.");
      return;
    }

    const rentNum = parseFloat(monthlyRent);
    if (isNaN(rentNum) || rentNum < 0) {
      setValidationError("Monthly rent is required and must be non-negative.");
      return;
    }

    const floorNum = floor.trim() ? parseInt(floor, 10) : undefined;
    const depositNum = securityDeposit.trim() ? parseFloat(securityDeposit) : undefined;

    setSubmitting(true);

    const payload = {
      pgId,
      roomNumber: trimmedNumber,
      floor: isNaN(floorNum ?? NaN) ? 1 : floorNum,
      roomType,
      sharing: capacityNum,
      bedCapacity: capacityNum,
      rentPerBed: rentNum,
      monthlyRent: rentNum,
      ...(depositNum !== undefined && !isNaN(depositNum) && { securityDeposit: depositNum }),
      bathroomType,
      furnishing,
      ...(description.trim() && { description: description.trim() }),
    };

    try {
      const response = await fetchApi(`/owner/pgs/${pgId}/rooms`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const createdRoom: Room = response || {
        _id: `room-${Date.now()}`,
        ...payload,
      };

      onRoomAdded(createdRoom);

      // Reset form
      setRoomNumber("");
      setMonthlyRent("");
      setSecurityDeposit("");
      setDescription("");
      onClose();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to create room. Please check your inputs.";
      setServerError(
        errMsg.includes("404") || errMsg.includes("Cannot POST")
          ? `Backend API route (POST /owner/pgs/${pgId}/rooms) is not yet implemented on the server: ${errMsg}. Inputs have been preserved.`
          : errMsg
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#102A56]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-xl p-4 sm:p-7 border border-[#E1EAF4] shadow-2xl relative max-h-[92vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-room-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] shrink-0">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 id="add-room-title" className="text-base sm:text-lg font-bold text-[#102A56]">
                Add New Room
              </h3>
              <p className="text-[11px] sm:text-xs text-[#7186A5]">
                Configure room details, capacity, and monthly rent
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation / Server Error Banners */}
        {validationError && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-2 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {serverError && (
          <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-500 mr-2 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body (Single column on mobile, 2-col where fitting on desktop) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1">
          {/* 1. PG Selection */}
          <div>
            <label htmlFor="pg-select" className="block text-xs font-bold text-[#102A56] mb-1">
              Select Property / PG <span className="text-rose-500">*</span>
            </label>
            <select
              id="pg-select"
              value={pgId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              disabled={submitting || (Boolean(selectedPgId) && pgs.length <= 1)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] bg-white disabled:bg-[#F5F8FC] min-h-[44px]"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 2. Room Number */}
            <div>
              <label htmlFor="room-number" className="block text-xs font-bold text-[#102A56] mb-1">
                Room Number / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="room-number"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 101 or A-12"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* 3. Floor */}
            <div>
              <label htmlFor="room-floor" className="block text-xs font-bold text-[#102A56] mb-1">
                Floor (optional)
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="room-floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. 1"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* 4. Room Type */}
            <div>
              <label htmlFor="room-type" className="block text-xs font-bold text-[#102A56] mb-1">
                Room Type / Sharing <span className="text-rose-500">*</span>
              </label>
              <select
                id="room-type"
                value={roomType}
                onChange={(e) => handleRoomTypeChange(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] bg-white min-h-[44px]"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Bed Capacity */}
            <div>
              <label htmlFor="bed-capacity" className="block text-xs font-bold text-[#102A56] mb-1">
                Bed Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="bed-capacity"
                required
                min="1"
                max="20"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* 6. Monthly Rent */}
            <div>
              <label htmlFor="monthly-rent" className="block text-xs font-bold text-[#102A56] mb-1">
                Monthly Rent (₹ per bed) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="monthly-rent"
                required
                min="0"
                step="100"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 6000"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* 7. Security Deposit */}
            <div>
              <label htmlFor="security-deposit" className="block text-xs font-bold text-[#102A56] mb-1">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="security-deposit"
                min="0"
                step="500"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="e.g. 10000"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* 8. Bathroom Type */}
            <div>
              <label htmlFor="bathroom-type" className="block text-xs font-bold text-[#102A56] mb-1">
                Bathroom Type
              </label>
              <select
                id="bathroom-type"
                value={bathroomType}
                onChange={(e) => setBathroomType(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] bg-white min-h-[44px]"
              >
                <option value="ATTACHED">Attached Bathroom</option>
                <option value="SHARED">Shared Bathroom</option>
                <option value="COMMON">Common Hall Bathroom</option>
              </select>
            </div>

            {/* 9. Furnishing */}
            <div>
              <label htmlFor="furnishing" className="block text-xs font-bold text-[#102A56] mb-1">
                Furnishing
              </label>
              <select
                id="furnishing"
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] bg-white min-h-[44px]"
              >
                <option value="FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* 10. Notes / Description */}
          <div>
            <label htmlFor="room-description" className="block text-xs font-bold text-[#102A56] mb-1">
              Description / Notes (optional)
            </label>
            <textarea
              id="room-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Balcony attached, road view, AC fitted..."
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] resize-none min-h-[60px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E1EAF4]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#7186A5] hover:bg-[#F5F8FC] hover:text-[#102A56] transition-colors disabled:opacity-50 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#0F8B83]/20 focus:outline-none focus:ring-2 focus:ring-[#0F8B83] focus:ring-offset-2 disabled:opacity-70 transition-all min-h-[44px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Room...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Room</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
