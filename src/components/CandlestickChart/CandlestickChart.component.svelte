<script lang="ts">
  import { LayerCake, Svg, Html } from "layercake";
  import dragChart from "../../assets/layercake-actions/drag-chart";
  import * as d3 from "d3";

  import { format, isFirstDayOfMonth, set } from "date-fns";
  import AxisX from "../../assets/layercake-components/AxisX.svelte";
  import AxisY from "../../assets/layercake-components/AxisY.svelte";
  import Tooltip from "../../assets/layercake-components/Tooltip.svelte";
  import DottedLine from "../../assets/layercake-components/DottedLine.svelte";

  import { chartStore } from "../../store/chart/chart.store";
  // This example loads csv data as json using @rollup/plugin-dsv
  export let data = [];

  import Candlestick from "../../assets/layercake-components/Candlestick.svelte";

  import RandomIndicator from "../../assets/layercake-components/RandomIndicator.svg.svelte";
  import {
    changeDomain,
    formatDateInTickX,
    handlePanMove,
    getDifferenceInMilliseconds,
    filterDataByXDomain,
    changeDomainCTRL,
  } from "../../chart-utils/chart.utils";
  let evtMouseListener;
  let yDomain = [];
  let xDomain = [];
  let xTicksVals = [];
  let isDragging = false;
  //Layers: Pontos,

  //Indicadores: Volume, MACD

  //Canvas & SVG

  // Detalhar o movimento do índice

  // Raio - x:

  // Desenhar Régua:
  let padding = { left: 25, bottom: 25, right: 50 };
  let chartContainerEl;
  let width, height;
  const xKey = "date";
  const yKey = "high";

  //[d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]

  let evt;
  let evtMouseDotted = evt;
  let hideTooltip = true;
  const handleWheel = (e) => {
    const step =
      xTicksVals.length > 0
        ? getDifferenceInMilliseconds(xTicksVals[3], xTicksVals[0])
        : 0;

    if (e.ctrlKey) {
      const xCenter = d3
        .scaleTime()
        .domain($chartStore.xDomain)
        .range([0, width - 50])
        .invert(evtMouseDotted.offsetX);
      e.preventDefault();
      console.log(evtMouseDotted, xCenter);
      changeDomainCTRL({ delta: e.deltaY, stepInteger: 2, xCenter: xCenter });
    } else {
      console.log(step);
      changeDomain(e.deltaY, step);
    }
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
  const setXticksVals = (ticks) => {
    xTicksVals = [...ticks];
  };
  const check = () => {
    console.log("xDomain", xDomain, "yDomain");
  };
  chartStore.subscribe((store) => {
    let data = [...store.data];
    data.forEach((d) => {
      d[yKey] = +d[yKey];
    });
    xDomain = [...store.xDomain];
    data = filterDataByXDomain({ data, xKey: "date", xDomain });

    yDomain =
      data.length > 0
        ? [d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]
        : [];
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
    {xDomain}
    {yDomain}
    xPadding={[50, 50]}
    yPadding={[50, 50]}
    {data}
  >
    <!-- <Svg>
        <AxisX />
        <AxisY ticks={4} />
        <Line stroke={"#ff3e00"} />
        <Area fill={"rgba(255, 62, 0, 0.2)"} />
      </Svg> -->
    <Svg zIndex={1}>
      <Candlestick
        on:mousemove={(event) => {
          evt = hideTooltip = event;
        }}
        on:mouseout={() => (hideTooltip = true)}
      />
    </Svg>

    <Svg>
      <RandomIndicator />
    </Svg>
    <Html pointerEvents={false}>
      {#if hideTooltip !== true}
        <Tooltip {evt} let:detail>
          {#each Object.entries(detail.props) as [key, value]}
            <div class="row"><span>{key}:</span> {value}</div>
          {/each}
        </Tooltip>
      {/if}
    </Html>

    <Svg>
      <AxisX formatTick={formatDateInTickX} setTicksVals={setXticksVals} />
      <DottedLine evt={evtMouseDotted} {padding} {width} {height} />
      <AxisY />
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
