"use client";

import { useEffect, useState } from "react";
import type { City } from "@/types";
import { cities as fixtureCities } from "@/lib/fixtures/cities";
import { getCities } from "@/lib/services/searchService";

let cachedCities: City[] | null = null;

export function useCities() {
  // Fixtures are static: render them on the first paint (no skeleton flash),
  // then quietly revalidate in case the service ever goes remote.
  const [cities, setCities] = useState<City[]>(cachedCities ?? fixtureCities);

  useEffect(() => {
    let mounted = true;
    getCities().then((data) => {
      if (mounted && data.length > 0) {
        cachedCities = data;
        setCities(data);
      }
    });

    return () => { mounted = false; };
  }, []);

  return { cities };
}
