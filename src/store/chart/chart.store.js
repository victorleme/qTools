import { writable } from "svelte/store";
const INITIAL_CHART_STORE_STATE = {
  data: [],
  xDomain: [],
  yDomain: [],
};
function createChartStore() {
  const { subscribe, set, update } = writable(INITIAL_CHART_STORE_STATE);

  return {
    subscribe,
    setXDomain: (xDomain = []) =>
      update((n) => ({ ...n, xDomain: [...xDomain] })),
    setData: (data = []) => update((n) => ({ ...n, data })),
    reset: () => set(INITIAL_CHART_STORE_STATE),
  };
}

export const chartStore = createChartStore();
