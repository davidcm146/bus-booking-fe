"use client";

import { createContext, useState, useCallback, useMemo } from "react";
import type { Trip } from "@/types";
import type { SelectedSeat } from "@/types/booking";

interface BookingContextValue {
  selectedTrip: Trip | null;
  selectedSeats: SelectedSeat[];
  setTrip: (trip: Trip) => void;
  addSeat: (seat: SelectedSeat) => void;
  removeSeat: (label: string) => void;
  clearAll: () => void;
  getTotal: () => number;
}

export const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  const setTrip = useCallback((trip: Trip) => {
    setSelectedTrip(trip);
  }, []);

  const addSeat = useCallback((seat: SelectedSeat) => {
    setSelectedSeats((prev) => {
      if (prev.some((s) => s.label === seat.label)) return prev;
      return [...prev, seat];
    });
  }, []);

  const removeSeat = useCallback((label: string) => {
    setSelectedSeats((prev) => prev.filter((s) => s.label !== label));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedTrip(null);
    setSelectedSeats([]);
  }, []);

  const getTotal = useCallback(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const value = useMemo(
    () => ({ selectedTrip, selectedSeats, setTrip, addSeat, removeSeat, clearAll, getTotal }),
    [addSeat, clearAll, getTotal, removeSeat, selectedSeats, selectedTrip, setTrip]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
