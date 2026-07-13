"use client";

import { useEffect, useState } from "react";
import type { City } from "@/types";
import { getCities } from "@/lib/services/searchService";

let cachedCities: City[] | null = null;

export function useCities() {
  const [cities, setCities] = useState<City[]>(cachedCities ?? []);
  const [loading, setLoading] = useState(!cachedCities);

  useEffect(() => {
    if (cachedCities) {
      return;
    }

    let mounted = true;
    getCities().then((data) => {
      if (mounted) {
        cachedCities = data;
        setCities(data);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { cities, loading };
}
