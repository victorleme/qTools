import { writable } from "svelte/store";
const INITIAL_CHART_STORE_STATE = {
  data: [],
  xDomain: [],
  yDomain: [],
  mousePOS: { X: 0, Y: 0 },
  isDragging: false,
  containerRef: null,
  isDraggingAxisX: false,
  isDraggingAxisY: false,
};
function createChartStore() {
  const { subscribe, set, update } = writable(INITIAL_CHART_STORE_STATE);

  return {
    subscribe,
    setXDomain: (xDomain = []) =>
      update((n) => ({ ...n, xDomain: [...xDomain] })),
    setData: (data = []) => update((n) => ({ ...n, data })),
    setContainerRef: (containerRef) => update((n) => ({ ...n, containerRef })),
    setIsDraggingAxisX: (isDraggingAxisX) =>
      update((n) => ({ ...n, isDraggingAxisX })),
    setIsDraggingAxisY: (isDraggingAxisY) =>
      update((n) => ({ ...n, isDraggingAxisY })),
    setIsDragging: (isDragging) => update((n) => ({ ...n, isDragging })),
    setMousePOS: (mousePOS) =>
      update((n) => ({ ...n, mousePOS: { ...mousePOS } })),
    reset: () => set(INITIAL_CHART_STORE_STATE),
  };
}

export const chartStore = createChartStore();
