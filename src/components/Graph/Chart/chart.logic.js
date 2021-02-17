import { fromEvent, interval, merge } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  take,
  switchMap,
  takeUntil,
  mapTo,
  tap,
} from "rxjs/operators";
import { chartStore } from "./chart.store";
import {
  changeDomain,
  changeDomainCTRL,
  getDifferenceInMilliseconds,
  handlePanMove,
} from "./chart.utils";
import * as d3 from "d3";
export const registerMouseWheelZoom = (component) => {
  return fromEvent(component, "mousewheel").pipe(
    filter(({ ctrlKey }) => !ctrlKey),
    pluck("deltaY"),
    map((value) => value / Math.abs(value))
  );
};
const getStepForZoom = () => {
  let xDomain = [];
  chartStore.subscribe(($chartStore) => (xDomain = $chartStore.xDomain));
  return (xDomain[1] - xDomain[0]) / 20;
};
export const registerMouseWheelZoomWithCTRL = (component) => {
  return fromEvent(component, "mousewheel").pipe(
    filter(({ ctrlKey }) => ctrlKey),
    pluck("deltaY"),
    map((value) => value / Math.abs(value))
  );
};
export const registerZoomsHandlers = (component, padding) => {
  const mousewheel$ = registerMouseWheelZoom(component);
  mousewheel$.subscribe((value) => {
    const delta = getStepForZoom();
    changeDomain(value, delta);
  });
  const mousewheelCTRL$ = registerMouseWheelZoomWithCTRL(component);
  mousewheelCTRL$.subscribe((value) => {
    const clientWidth = component.clientWidth;
    const delta = getStepForZoom();
    let mousePosX = 0;
    let xDomainToZoom = [];
    chartStore.subscribe(({ mousePOS, xDomain }) => {
      mousePosX = mousePOS.X;
      xDomainToZoom = [...xDomain];
    });
    const xCenter = d3
      .scaleTime()
      .domain(xDomainToZoom)
      .range([0, clientWidth - padding.right])
      .invert(mousePosX);
    changeDomainCTRL({ delta: value, stepInteger: 2, xCenter: xCenter });
    // changeDomainCTRL(value, delta);
  });
};

export const registerMouseMove = (component) => {
  return fromEvent(component, "mousemove").pipe(
    map(({ offsetX, offsetY }) => ({ X: offsetX, Y: offsetY }))
  );
};
export const registerMouseMoveHandlers = (component) => {
  const mousemove$ = registerMouseMove(component);

  mousemove$.subscribe((pos) => {
    chartStore.setMousePOS(pos);
  });
};
export const createDragDropHandle = (component) => {
  const mouseup$ = fromEvent(component, "mouseup");
  const drag$ = fromEvent(component, "mousedown").pipe(
    switchMap(() =>
      interval(20).pipe(
        mapTo(true),
        distinctUntilChanged(),
        takeUntil(mouseup$)
      )
    )
  );
  const drop$ = drag$.pipe(
    switchMap(() => mouseup$.pipe(take(1), mapTo(false)))
  );
  return merge(drag$, drop$);
};
export const registerUiHandlers = (component, xLine, yLine) => {
  const observer = {
    next: (v) => console.log("pressed", v),
    complete: () => console.log("completed"),
  };
  const mouseup$ = fromEvent(xLine, "click");
  console.log(xLine);
  mouseup$.subscribe(console.log);
  const dragdropAxisX$ = createDragDropHandle(xLine);
  const dragdropAxisY$ = createDragDropHandle(yLine);
  dragdropAxisX$.pipe(tap()).subscribe(console.log);
  dragdropAxisY$.subscribe(console.log);
  const dragdropChart$ = createDragDropHandle(component);
  dragdropChart$.subscribe((isDragging) => {
    chartStore.setIsDragging(isDragging);
  });
};
