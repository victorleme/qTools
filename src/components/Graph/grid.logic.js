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
export const registerUiAxisHandlers = (axisX, axisY) => {
  const observer = {
    next: (v) => console.log("pressed", v),
    complete: () => console.log("completed"),
  };

  const dragdropAxisX$ = createDragDropHandle(axisX);
  dragdropAxisX$.subscribe(console.log);
  const dragdropAxisY$ = createDragDropHandle(axisY);
};
