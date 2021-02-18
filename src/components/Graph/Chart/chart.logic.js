import { fromEvent, interval, merge, iif } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  take,
  switchMap,
  takeUntil,
  mapTo,
  concatMap,
  tap,
  last,
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
export const getStepForZoomAxis = (domain = [0, 0]) => {
  return (domain[1] - domain[0]) / 20;
};
export const getStepForZoom = () => {
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
  const mouseup$ = fromEvent(document, "mouseup");
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
export const registerUiHandlers = (component, axisX, axisY) => {
  const observer = {
    next: (v) => console.log("pressed", v),
    complete: () => console.log("completed"),
  };

  const dragdropAxisX$ = createDragDropHandle(axisX);
  const dragdropAxisY$ = createDragDropHandle(axisY);
  dragdropAxisX$.pipe(tap()).subscribe((value) => console.log("axis X", value));
  dragdropAxisY$.subscribe((value) => console.log("axis Y", value));
  const dragdropChart$ = createDragDropHandle(component);
  const dragdropChartGuard$ = dragdropChart$.subscribe((isDragging) => {
    let isDraggingY = false;
    let isDraggingX = false;
    chartStore.subscribe(($chartStore) => {
      isDraggingX = $chartStore.isDraggingAxisX;
      isDraggingY = $chartStore.isDraggingAxisY;
    });
    let isDraggingChart = isDragging && !isDraggingY & !isDraggingX;

    chartStore.setIsDragging(!!isDraggingChart);
  });
  const dragdropAxisXGuard$ = dragdropAxisX$.subscribe((isDragging) => {
    console.log();

    chartStore.setIsDraggingAxisX(isDragging);
  });
  const dragdropAxisYGuard$ = dragdropAxisY$.subscribe((isDragging) => {
    chartStore.setIsDraggingAxisY(isDragging);
  });
};
