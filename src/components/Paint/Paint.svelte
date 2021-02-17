<script>
  import { onMount } from "svelte";
  import { isDrawing } from "../../store/paint/paint.store";
  export let height = 0;
  export let width = 0;
  // Brush colour and size
  const colour = "orange";
  const strokeWidth = 12;

  // Drawing state
  let latestPoint;
  let drawing = false;
  let canvasEl;
  // Set up our drawing context

  $: context = canvasEl?.getContext("2d");

  // Drawing functions

  const continueStroke = (newPoint) => {
    context.beginPath();
    context.moveTo(latestPoint[0], latestPoint[1]);
    context.strokeStyle = colour;
    context.lineWidth = strokeWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(newPoint[0], newPoint[1]);
    context.stroke();

    latestPoint = newPoint;
  };

  // Event helpers

  const startStroke = (point) => {
    if ($isDrawing) {
      drawing = true;
      latestPoint = point;
    }
  };

  const BUTTON = 0b01;
  const mouseButtonIsDown = (buttons) => (BUTTON & buttons) === BUTTON;

  // Event handlers

  const mouseMove = (evt) => {
    if (!drawing) {
      return;
    }
    continueStroke([evt.offsetX, evt.offsetY]);
  };

  const mouseDown = (evt) => {
    if (drawing) {
      return;
    }
    evt.preventDefault();
    canvasEl.addEventListener("mousemove", mouseMove, false);
    startStroke([evt.offsetX, evt.offsetY]);
  };

  const mouseEnter = (evt) => {
    if (!mouseButtonIsDown(evt.buttons) || drawing) {
      return;
    }
    mouseDown(evt);
  };

  const endStroke = (evt) => {
    if (!drawing) {
      return;
    }
    drawing = false;

    evt.currentTarget.removeEventListener("mousemove", mouseMove, false);
  };

  // Register event handlers
  onMount(() => {
    canvasEl.addEventListener("mousedown", mouseDown, false);
    canvasEl.addEventListener("mouseup", endStroke, false);
    canvasEl.addEventListener("mouseout", endStroke, false);
    canvasEl.addEventListener("mouseenter", mouseEnter, false);
  });
  $: console.log($isDrawing);
</script>

<canvas id="paint" {height} {width} bind:this={canvasEl} />

<style>
  #paint {
    z-index: 50;
    position: absolute;
    bottom: 5%;
    left: 5%;
  }
</style>
