import { create } from 'zustand'

interface FiltersState {
  reportsVillage: string
  reportsStatus: 'ALL' | 'PENDING' | 'REVIEWED'
  reportsSeverity: 'ALL' | 'CRITICAL' | 'STANDARD'
  animalsVillage: string
  animalsSpecies: 'ALL' | 'COW' | 'GOAT' | 'SHEEP'
  animalsVaccineStatus: 'ALL' | 'UP_TO_DATE' | 'UPCOMING' | 'OVERDUE'
  setReportsVillage: (v: string) => void
  setReportsStatus: (s: FiltersState['reportsStatus']) => void
  setReportsSeverity: (s: FiltersState['reportsSeverity']) => void
  setAnimalsVillage: (v: string) => void
  setAnimalsSpecies: (s: FiltersState['animalsSpecies']) => void
  setAnimalsVaccineStatus: (s: FiltersState['animalsVaccineStatus']) => void
  resetReportFilters: () => void
  resetAnimalFilters: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  reportsVillage: '',
  reportsStatus: 'ALL',
  reportsSeverity: 'ALL',
  animalsVillage: '',
  animalsSpecies: 'ALL',
  animalsVaccineStatus: 'ALL',
  setReportsVillage: (v) => set({ reportsVillage: v }),
  setReportsStatus: (s) => set({ reportsStatus: s }),
  setReportsSeverity: (s) => set({ reportsSeverity: s }),
  setAnimalsVillage: (v) => set({ animalsVillage: v }),
  setAnimalsSpecies: (s) => set({ animalsSpecies: s }),
  setAnimalsVaccineStatus: (s) => set({ animalsVaccineStatus: s }),
  resetReportFilters: () =>
    set({ reportsVillage: '', reportsStatus: 'ALL', reportsSeverity: 'ALL' }),
  resetAnimalFilters: () =>
    set({
      animalsVillage: '',
      animalsSpecies: 'ALL',
      animalsVaccineStatus: 'ALL',
    }),
}))
