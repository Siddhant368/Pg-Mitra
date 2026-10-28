"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle, Loader2, Edit3 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Room } from "@/types";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onRoomUpdated: (updatedRoom: Room) => void;
}

const ROOM_TYPES = [
  { value: "SINGLE", label: "Single Room (1 Bed)" },
  { value: "DOUBLE", label: "Double Sharing (2 Beds)" },
  { value: "TRIPLE", label: "Triple Sharing (3 Beds)" },
  { value: "FOUR_SHARING", label: "Four Sharing (4 Beds)" },
  { value: "CUSTOM", label: "Custom Capacity" },
];

function EditRoomForm({
  room,
  onClose,
  onRoomUpdated,
}: {
  room: Room;
  onClose: () => void;
  onRoomUpdated: (updatedRoom: Room) => void;
}) {
  const [roomNumber, setRoomNumber] = useState(room.roomNumber || "");
  const [floor, setFloor] = useState<string>(
    room.floor !== undefined && room.floor !== null ? String(room.floor) : "1"
  );
  const [roomType, setRoomType] = useState(room.roomType || "DOUBLE");
  const initialCap =
    room.bedCapacity ||
    room.sharing ||
    room.totalBeds ||
    (room.beds ? room.beds.length : 2);
  const [bedCapacity, setBedCapacity] = useState<string>(String(initialCap));

  const initialRent = room.monthlyRent || room.rentPerBed || 0;
  const [monthlyRent, setMonthlyRent] = useState<string>(
    initialRent > 0 ? String(initialRent) : ""
  );
  const [securityDeposit, setSecurityDeposit] = useState<string>(
    room.securityDeposit !== undefined && room.securityDeposit !== null
      ? String(room.securityDeposit)
      : ""
  );
  const [bathroomType, setBathroomType] = useState(room.bathroomType || "ATTACHED");
  const [furnishing, setFurnishing] = useState(room.furnishing || "FURNISHED");
  const [description, setDescription] = useState(room.description || "");

  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saving, onClose]);

  const currentOccupied =
    room.occupiedBeds ??
    (room.beds ? room.beds.filter((b) => b.isOccupied).length : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setServerError("");

    const trimmedNumber = roomNumber.trim();
    if (!trimmedNumber) {
      setValidationError("Room number or name is required.");
      return;
    }

    const capacityNum = parseInt(bedCapacity, 10);
    if (isNaN(capacityNum) || capacityNum < 1) {
      setValidationError("Bed capacity must be at least 1.");
      return;
    }

    if (currentOccupied > 0 && capacityNum < currentOccupied) {
      setValidationError(
        `Cannot reduce capacity to ${capacityNum}. This room currently has ${currentOccupied} occupied bed(s). Please reassign or vacate beds before reducing capacity.`
      );
      return;
    }

    const rentNum = parseFloat(monthlyRent);
    if (isNaN(rentNum) || rentNum < 0) {
      setValidationError("Monthly rent is required and must be non-negative.");
      return;
    }

    const floorNum = floor.trim() ? parseInt(floor, 10) : undefined;
    const depositNum = securityDeposit.trim() ? parseFloat(securityDeposit) : undefined;

    setSaving(true);

    const roomId = room._id || room.id;
    const payload = {
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
      description: description.trim(),
    };

    try {
      const response = await fetchApi(`/rooms/${roomId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const updated: Room = response || {
        ...room,
        ...payload,
      };

      onRoomUpdated(updated);
      onClose();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to update room. Please check your inputs.";
      setServerError(
        errMsg.includes("404") || errMsg.includes("Cannot PATCH")
          ? `Backend API route (PATCH /rooms/${roomId}) is not yet implemented on the server: ${errMsg}.`
          : errMsg
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#102A56]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-xl p-4 sm:p-7 border border-[#E1EAF4] shadow-2xl relative max-h-[92vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-room-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] shrink-0">
              <Edit3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 id="edit-room-title" className="text-base sm:text-lg font-bold text-[#102A56]">
                Edit Room {room.roomNumber}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#7186A5]">
                Update room configuration, capacity, or rent
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Room Number */}
            <div>
              <label htmlFor="edit-room-number" className="block text-xs font-bold text-[#102A56] mb-1">
                Room Number / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="edit-room-number"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* Floor */}
            <div>
              <label htmlFor="edit-room-floor" className="block text-xs font-bold text-[#102A56] mb-1">
                Floor
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="edit-room-floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* Room Type */}
            <div>
              <label htmlFor="edit-room-type" className="block text-xs font-bold text-[#102A56] mb-1">
                Room Type / Sharing <span className="text-rose-500">*</span>
              </label>
              <select
                id="edit-room-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] bg-white min-h-[44px]"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bed Capacity */}
            <div>
              <label htmlFor="edit-bed-capacity" className="block text-xs font-bold text-[#102A56] mb-1">
                Bed Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="edit-bed-capacity"
                required
                min="1"
                max="20"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* Monthly Rent */}
            <div>
              <label htmlFor="edit-monthly-rent" className="block text-xs font-bold text-[#102A56] mb-1">
                Monthly Rent (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="edit-monthly-rent"
                required
                min="0"
                step="100"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* Security Deposit */}
            <div>
              <label htmlFor="edit-security-deposit" className="block text-xs font-bold text-[#102A56] mb-1">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="edit-security-deposit"
                min="0"
                step="500"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] min-h-[44px]"
              />
            </div>

            {/* Bathroom Type */}
            <div>
              <label htmlFor="edit-bathroom-type" className="block text-xs font-bold text-[#102A56] mb-1">
                Bathroom Type
              </label>
              <select
                id="edit-bathroom-type"
                value={bathroomType}
                onChange={(e) => setBathroomType(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] bg-white min-h-[44px]"
              >
                <option value="ATTACHED">Attached Bathroom</option>
                <option value="SHARED">Shared Bathroom</option>
                <option value="COMMON">Common Hall Bathroom</option>
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label htmlFor="edit-furnishing" className="block text-xs font-bold text-[#102A56] mb-1">
                Furnishing
              </label>
              <select
                id="edit-furnishing"
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                disabled={saving}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] bg-white min-h-[44px]"
              >
                <option value="FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-description" className="block text-xs font-bold text-[#102A56] mb-1">
              Description / Notes
            </label>
            <textarea
              id="edit-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={saving}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none text-xs sm:text-sm text-[#102A56] resize-none min-h-[60px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E1EAF4]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#7186A5] hover:bg-[#F5F8FC] hover:text-[#102A56] transition-colors disabled:opacity-50 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#0F8B83]/20 focus:outline-none focus:ring-2 focus:ring-[#0F8B83] focus:ring-offset-2 disabled:opacity-70 transition-all min-h-[44px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Room...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Room</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditRoomModal({
  isOpen,
  onClose,
  room,
  onRoomUpdated,
}: EditRoomModalProps) {
  if (!isOpen || !room) return null;

  return (
    <EditRoomForm
      key={room._id || room.id || room.roomNumber}
      room={room}
      onClose={onClose}
      onRoomUpdated={onRoomUpdated}
    />
  );
}
