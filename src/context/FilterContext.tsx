import React, {
  useMemo,
  useState,
  ReactNode,
  useContext,
  useCallback,
  createContext,
} from 'react';
import type { FilterParams } from '../types/filter';

type FilterContextValue = {
  filters: FilterParams | null;
  setFilters: (filters: FilterParams | null) => void;
  resetFilters: () => void;
  lastUpdatedAt: number;
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFiltersState] = useState<FilterParams | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const setFilters = useCallback((next: FilterParams | null) => {
    // Clone to ensure reference changes and trigger subscribers
    const normalized = next ? { ...next } : null;
    setFiltersState(normalized);
    setLastUpdatedAt(Date.now());
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(null);
    setLastUpdatedAt(Date.now());
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      lastUpdatedAt,
    }),
    [filters, lastUpdatedAt, resetFilters, setFilters],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextValue => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
