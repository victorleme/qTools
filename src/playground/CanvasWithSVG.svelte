<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg, Canvas, Html } from "layercake";
  import * as d3 from "d3";

  import dataAAPL from "../data/AAPL.csv";
  import AxisXHTML from "../assets/layercake-components/AxisX.html.svelte";
  import AxisYHTML from "../assets/layercake-components/AxisY.html.svelte";
  import Paint from "../components/Paint/Paint.svelte";
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
  import { isDrawing } from "../store/paint/paint.store";

  import { GREEN_PALLETE } from "../assets/candlesticks-colors/green.pallete";
  import { RED_PALLETE } from "../assets/candlesticks-colors/red.pallete";

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
  let data = [];
  const getColorHex = (element, index) => {
    const colorIndex = Math.round(index);
    return element.open > element.close
      ? RED_PALLETE[colorIndex]
      : element.close > element.open
      ? GREEN_PALLETE[colorIndex]
      : d3.schemeSet1[8];
  };
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
    if ($isDrawing) return;
    isDragging = true;
    const step =
      getDifferenceInMilliseconds(
        $chartStore.xDomain[$chartStore.xDomain.length - 1],
        $chartStore.xDomain[0]
      ) / 20;
    handlePanMove(e, step);
  };
  const getColor = (data) =>
    d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.volume))
      .range([0, 30]);
  const onPanEnd = () => {
    isDragging = false;
  };
  chartStore.subscribe((chart) => {
    let dataStore = [...chart.data];
    dataStore.forEach((d) => {
      d[yKey] = +d[yKey];
      d["volume"] = +d["volume"];
    });

    dataStore = filterDataByXDomain({
      data: dataStore,
      xKey: "date",
      xDomain: chart.xDomain,
    });
    const getColorFn = getColor(dataStore);
    dataStore = dataStore.map((d) => {
      return { ...d, fill: getColorHex(d, getColorFn(d.volume)) };
    });
    data = [...dataStore];
    if (yDomain.length == 0) {
      yDomain =
        dataStore.length > 0
          ? [d3.min(dataStore, (d) => d.low), d3.max(dataStore, (d) => d.high)]
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
  <Paint {height} {width} />
  <LayerCake
    {data}
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
    <Canvas>
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
    <Canvas />
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
