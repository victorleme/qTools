<script lang="ts">
  import { LayerCake, Svg, Html } from "layercake";
  import dragChart from "../../assets/layercake-actions/drag-chart";
  import * as d3 from "d3";

  import { sub, add, format, isFirstDayOfMonth } from "date-fns";
  import AxisX from "../../assets/layercake-components/AxisX.svelte";
  import AxisY from "../../assets/layercake-components/AxisY.svelte";
  import Volume from "../../assets/layercake-components/Volume.svelte";
  // This example loads csv data as json using @rollup/plugin-dsv
  import { chartStore } from "../../store/chart/chart.store";
  import {
    changeDomain,
    formatDateInTickX,
    formatValueInTickY,
    handlePanMove,
    getDifferenceInMilliseconds,
  } from "../../chart-utils/chart.utils";
  let width = 0,
    height = 0;
  let ticks = [];
  let yDomain = [];
  let xDomain = [];

  export let data = [];

  let isDragging = false;
  //Layers: Pontos,

  //Indicadores: Volume, MACD

  //Canvas & SVG

  // Detalhar o movimento do índice

  // Raio - x:

  // Desenhar Régua:
  let padding = { left: 25, bottom: 25, right: 50 };
  let chartContainerEl;
  let xTicksVals = [];
  const xKey = "date";
  const yKey = "volume";

  let evt;
  let evtMouseDotted = evt;

  const handleWheel = (e) => {
    const step =
      xTicksVals.length > 0
        ? getDifferenceInMilliseconds(xTicksVals[3], xTicksVals[0])
        : 0;
    changeDomain(e.deltaY, step);
    //e.preventDefault();
  };
  const onPanMove = (e) => {
    isDragging = true;
    const step =
      xTicksVals.length > 0
        ? getDifferenceInMilliseconds(xTicksVals[1], xTicksVals[0]) / 3
        : 0;
    handlePanMove(e, step);
  };
  const onPanEnd = () => {
    isDragging = false;
  };

  const check = () => {
    console.log("xDomain", xDomain, "yDomain", yDomain, "data", data);
  };
  const setXticksVals = (ticks) => {
    xTicksVals = [...ticks];
  };
  chartStore.subscribe((store) => {
    const data = store.data;

    xDomain = [...store.xDomain];
    data.forEach((d) => {
      d[yKey] = +d[yKey];
    });
    yDomain =
      data.length > 0
        ? [d3.min(data, (d) => d.volume), d3.max(data, (d) => d.volume)]
        : [0, 1];
  });
</script>

<div
  class="chart-container"
  class:hand-cursor={isDragging}
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={chartContainerEl}
  on:wheel={handleWheel}
  use:dragChart
  on:panmove={onPanMove}
  on:panend={onPanEnd}
  on:click={check}
  on:mousemove={(evt) => (evtMouseDotted = evt)}
>
  <LayerCake
    {padding}
    x={xKey}
    y={yKey}
    yScale={d3.scaleLinear()}
    xScale={d3.scaleTime()}
    xRange={[0, width - 50]}
    xDomain={$chartStore.xDomain}
    {yDomain}
    xPadding={[50, 50]}
    {data}
  >
    <Svg>
      <Volume />
      <AxisX formatTick={formatDateInTickX} setTicksVals={setXticksVals} />
      <AxisY formatTick={formatValueInTickY} />
    </Svg>
  </LayerCake>
</div>

<style>
  .hand-cursor {
    cursor: grabbing !important;
  }
  .time-x-axis {
    cursor: n-resize;
  }
  .chart-container {
    cursor: crosshair;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
