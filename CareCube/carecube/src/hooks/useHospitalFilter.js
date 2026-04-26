import { useState, useMemo } from "react";
import { HOSPITALS, STATES, CITIES, DISTRICTS } from "../data/mockData";

/**
 * useHospitalFilter
 *
 * Encapsulates all state and derived results for filtering hospitals by:
 *   - State, City, District (location)
 *   - Hospital status (critical / moderate / stable)
 *   - Resource availability ranges:
 *       beds, vents, oxygen (%), blood
 *
 * Returns:
 *   filters       — current filter values
 *   setFilter     — setter for any individual filter key
 *   resetFilters  — resets everything to defaults
 *   filtered      — derived array of matching hospitals
 *   activeCount   — number of non-default filters applied
 *   availableStates / availableCities / availableDistricts — dynamic option lists
 */
export function useHospitalFilter() {
  const DEFAULT_FILTERS = {
    state:     "all",
    city:      "all",
    district:  "all",
    status:    "all",
    // Resource range filters — [min, max] as absolute values
    beds:    [0, 500],
    vents:   [0, 150],
    oxygen:  [0, 100],
    blood:   [0, 300],
  };

  const [filters, setFiltersRaw] = useState(DEFAULT_FILTERS);

  const setFilter = (key, value) =>
    setFiltersRaw((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFiltersRaw(DEFAULT_FILTERS);

  // ── Dynamic city/district lists depend on what state/city is selected ────────
  const availableStates = ["all", ...STATES];

  const availableCities = useMemo(() => {
    const base =
      filters.state === "all"
        ? CITIES
        : [...new Set(HOSPITALS.filter((h) => h.state === filters.state).map((h) => h.city))].sort();
    return ["all", ...base];
  }, [filters.state]);

  const availableDistricts = useMemo(() => {
    const base = HOSPITALS.filter((h) => {
      if (filters.state !== "all" && h.state !== filters.state) return false;
      if (filters.city  !== "all" && h.city  !== filters.city)  return false;
      return true;
    });
    return ["all", ...[...new Set(base.map((h) => h.district))].sort()];
  }, [filters.state, filters.city]);

  // ── Apply all filters ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return HOSPITALS.filter((h) => {
      if (filters.state    !== "all" && h.state    !== filters.state)    return false;
      if (filters.city     !== "all" && h.city     !== filters.city)     return false;
      if (filters.district !== "all" && h.district !== filters.district) return false;
      if (filters.status   !== "all" && h.status   !== filters.status)   return false;
      if (h.beds   < filters.beds[0]   || h.beds   > filters.beds[1])   return false;
      if (h.vents  < filters.vents[0]  || h.vents  > filters.vents[1])  return false;
      if (h.oxygen < filters.oxygen[0] || h.oxygen > filters.oxygen[1]) return false;
      if (h.blood  < filters.blood[0]  || h.blood  > filters.blood[1])  return false;
      return true;
    });
  }, [filters]);

  // ── Count how many filters differ from their default ────────────────────────
  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.state    !== "all") n++;
    if (filters.city     !== "all") n++;
    if (filters.district !== "all") n++;
    if (filters.status   !== "all") n++;
    const isDefaultRange = (key) =>
      filters[key][0] === DEFAULT_FILTERS[key][0] &&
      filters[key][1] === DEFAULT_FILTERS[key][1];
    ["beds", "vents", "oxygen", "blood"].forEach((k) => {
      if (!isDefaultRange(k)) n++;
    });
    return n;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    filters,
    setFilter,
    resetFilters,
    filtered,
    activeCount,
    availableStates,
    availableCities,
    availableDistricts,
  };
}
