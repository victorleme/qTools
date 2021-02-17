<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg, Canvas, Html } from "layercake";

  import * as d3 from "d3";
  import Grid from "../Grid.svelte";
  import CandlestickCanvas from "../../../assets/layercake-components/Candlestick.canvas.svelte";
  import dragChart from "../../../assets/layercake-actions/drag-chart";
  import dataAAPL from "../../../data/AAPL.csv";
  import { getFormattedDataAndXDomain } from "../../../data/data.utils";
  import { chartStore } from "./chart.store";
  import {
    registerZoomsHandlers,
    registerMouseMoveHandlers,
    registerUiHandlers,
  } from "./chart.logic";

  import {
    getColor,
    getColorHex,
    getDifferenceInMilliseconds,
    handlePanMove,
  } from "./chart.utils";
  let padding = { left: 25, bottom: 25, right: 50, top: 0 };
  let chartContainerEl;
  let width, height;
  let yDomain = [];
  const xKey = "date";
  const yKey = "high";
  let sinceDate = "2004-01";
  let untilDate = "2005-01";
  let xLine = null;
  let yLine = null;
  let data = [];

  onMount(async () => {
    console.log(chartContainerEl.clientWidth);
    registerZoomsHandlers(chartContainerEl, padding);
    registerMouseMoveHandlers(chartContainerEl);
    registerUiHandlers(chartContainerEl);
    const { data, xDomain } = await getFormattedDataAndXDomain({
      data: dataAAPL,
      sinceDate,
      untilDate,
    });

    chartStore.setXDomain(xDomain);
    chartStore.setData([...data]);

    yDomain =
      data.length > 0
        ? [d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]
        : [];
  });

  $: mousePos = $chartStore.mousePOS;
  $: if (mousePos.X && mousePos.Y) {
    xLine.style.top = mousePos.Y + "px";
    yLine.style.left = mousePos.X + "px";
  }
  chartStore.subscribe((chart) => {
    let dataStore = [...chart.data];
    dataStore.forEach((d) => {
      d[yKey] = +d[yKey];
      d["volume"] = +d["volume"];
    });
    const getColorFn = getColor(dataStore);
    dataStore = dataStore.map((d) => {
      return { ...d, fill: getColorHex(d, getColorFn(d.volume)) };
    });
    data = [...dataStore];
  });

  const onPanMove = (e) => {
    if (!$chartStore.isDragging) return;
    const step =
      getDifferenceInMilliseconds(
        $chartStore.xDomain[$chartStore.xDomain.length - 1],
        $chartStore.xDomain[0]
      ) / 20;
    handlePanMove(e, step);
  };
</script>

<div
  class="chart-container"
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={chartContainerEl}
  use:dragChart
  on:panmove={onPanMove}
  on:mousewheel={(e) => e.preventDefault()}
  class:draggable={$chartStore.isDragging}
>
  <div class="mouse-pos">
    X: {$chartStore.mousePOS.X} Y: {$chartStore.mousePOS.Y} isDragging:{$chartStore.isDragging}
  </div>

  <LayerCake
    {data}
    {padding}
    x={xKey}
    y={yKey}
    yScale={d3.scaleLinear()}
    xScale={d3.scaleTime()}
    xDomain={$chartStore.xDomain}
    xRange={[0, width - padding.right]}
    xNice="true"
    {yDomain}
  >
    <Grid />
    <Canvas>
      <CandlestickCanvas />
    </Canvas>
    <Html>
      <div class="x-line" bind:this={xLine} />
      <div class="y-line" bind:this={yLine} />
    </Html>
  </LayerCake>
</div>

<style>
  .y-line {
    height: 100%;
    position: relative;
    width: 0rem;
    border-right: 1px red dotted;
  }
  .x-line {
    width: 100%;
    position: relative;
    height: 0rem;
    border-bottom: 1px red dotted;
  }
  .mouse-pos {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
  }
  .chart {
    cursor: pointer;
  }
  .chart-container {
    position: relative;
    overflow: hidden;
    cursor: crosshair;
    width: 100%;
    height: 100%;
  }
  .draggable {
    cursor: grabbing;
  }
</style>
