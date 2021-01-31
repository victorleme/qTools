import { writable } from "svelte/store";

function createChartStore() {
  const { subscribe, set, update } = writable({ data: [] });

  return {
    subscribe,
    setData: ({ data = [] }) => update((n) => ({ ...n, data })),
    reset: () => set(0),
  };
}

export const chartStore = createChartStore();
