<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg, Canvas, Html } from "layercake";
  import * as d3 from "d3";

  import dataAAPL from "../data/AAPL.csv";
  import AxisXHTML from "../assets/layercake-components/AxisX.html.svelte";
  import AxisX from "../assets/layercake-components/AxisX.svelte";
  import AxisYHTML from "../assets/layercake-components/AxisY.html.svelte";

  import AxisY from "../assets/layercake-components/AxisY.svelte";
  import CandlestickCanvas from "../assets/layercake-components/Candlestick.canvas.svelte";
  import DottedLine from "../assets/layercake-components/DottedLine.svelte";
  import Tooltip from "../assets/layercake-components/Tooltip.svelte";

  import dragChart from "../assets/layercake-actions/drag-chart";
  import { getFormattedDataAndXDomain } from "../data/data.utils";
  import {
    changeDomain,
    changeDomainCTRL,
    getDifferenceInMilliseconds,
    handlePanMove,
    formatDateInTickX,
    filterDataByXDomain,
  } from "../chart-utils/chart.utils";
  import { chartStore } from "../store/chart/chart.store";
  let padding = { left: 25, bottom: 25, right: 50 };
  let chartContainerEl;
  let width, height;
  let yDomain = [];
  const xKey = "date";
  const yKey = "high";
  let sinceDate = "2004-01";
  let untilDate = "2005-01";
  let isMovingAxis = false;
  let evtMouseDotted = { offsetX: 0 };
  let evt = { offsetX: 0 };
  let hideTooltip = true;
  let isDragging = false;
  onMount(async () => {
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
  const handleWheel = (e) => {
    e.preventDefault();
    const step =
      getDifferenceInMilliseconds(
        $chartStore.xDomain[$chartStore.xDomain.length - 1],
        $chartStore.xDomain[0]
      ) / 10;

    if (e.ctrlKey) {
      const xCenter = d3
        .scaleTime()
        .domain($chartStore.xDomain)
        .range([0, width - 50])
        .invert(evtMouseDotted.offsetX);

      changeDomainCTRL({ delta: e.deltaY, stepInteger: 2, xCenter: xCenter });
    } else {
      changeDomain(e.deltaY, step);
    }
  };
  const onPanMove = (e) => {
    if (isMovingAxis) return;

    isDragging = true;
    const step =
      getDifferenceInMilliseconds(
        $chartStore.xDomain[$chartStore.xDomain.length - 1],
        $chartStore.xDomain[0]
      ) / 20;
    handlePanMove(e, step);
  };
  const onPanEnd = () => {
    isDragging = false;
  };
  chartStore.subscribe((chart) => {
    let data = [...chart.data];
    data.forEach((d) => {
      d[yKey] = +d[yKey];
      d["volume"] = +d["volume"];
    });

    data = filterDataByXDomain({ data, xKey: "date", xDomain: chart.xDomain });
    if (yDomain.length == 0) {
      yDomain =
        data.length > 0
          ? [d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]
          : [];
    } else {
      const yMax = yDomain[1];
      const yMin = yDomain[0];
      const yOriginalMax = d3.max(data, (d) => d.high);
      const yOriginalMin = d3.max(data, (d) => d.low);
      const deltaMax = (yMax - yOriginalMax) / yMax;

      const deltaMin = yMin - yOriginalMin;
      yDomain = data.length > 0 ? [yMin, yMax] : [];
    }
  });

  $: cursorPosX = evtMouseDotted.offsetX;
  const onAxisXDrag = (e) => {
    isMovingAxis = true;
    e.preventDefault();
    e.stopPropagation();

    const step =
      getDifferenceInMilliseconds(
        $chartStore.xDomain[$chartStore.xDomain.length - 1],
        $chartStore.xDomain[0]
      ) / 7;
    const dx = e.detail.dx;

    changeDomain(dx, step);
  };
  const onAxisXEnd = () => {
    isMovingAxis = false;
  };
  const onAxisYDrag = (e) => {
    isMovingAxis = true;
    e.preventDefault();
    e.stopPropagation();

    const dy = e.detail.dy;

    if (dy < 0) {
      const step = (yDomain[1] - yDomain[0]) / 10;

      const newMinY = yDomain[0] + step;
      const newMaxY = yDomain[1] - step;

      yDomain = [...[newMinY, newMaxY]];
    }
    if (dy > 0) {
      const step = (yDomain[1] - yDomain[0]) / 10;

      const newMinY = yDomain[0] - step;
      const newMaxY = yDomain[1] + step;
      yDomain = [...[newMinY, newMaxY]];
    }
    // const step =
    //   getDifferenceInMilliseconds(
    //     $chartStore.xDomain[$chartStore.xDomain.length - 1],
    //     $chartStore.xDomain[0]
    //   ) / 7;
    // const dx = e.detail.dx;
    // console.log(dx);
    // changeDomain(dx, step);
  };
  const onAxisYEnd = () => {
    isMovingAxis = false;
  };
</script>

<div
  class="chart-container"
  use:dragChart
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={chartContainerEl}
  on:wheel={handleWheel}
  on:panmove={onPanMove}
  on:panend={onPanEnd}
  on:mousemove={(evt) => (evtMouseDotted = evt)}
>
  <LayerCake
    data={$chartStore.data}
    {padding}
    x={xKey}
    y={yKey}
    yScale={d3.scaleLinear()}
    xScale={d3.scaleTime()}
    xDomain={$chartStore.xDomain}
    xNice="true"
    {yDomain}
  >
    <Html>
      <AxisXHTML
        formatTick={formatDateInTickX}
        onAxisDrag={onAxisXDrag}
        onAxisDragEnd={onAxisXEnd}
      />
      <AxisYHTML onAxisDrag={onAxisYDrag} onAxisDragEnd={onAxisYEnd} />
    </Html>
    <Canvas on:click={() => console.log("clicked")}>
      <CandlestickCanvas {cursorPosX} />
    </Canvas>
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
      <DottedLine evt={evtMouseDotted} {padding} {width} {height} />
    </Svg>
  </LayerCake>
</div>

<style>
  .chart {
    cursor: pointer;
  }
  .chart-container {
    cursor: crosshair;
    width: 100%;
    height: 100%;
  }
</style>
