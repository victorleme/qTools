<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg, Canvas, Html } from "layercake";
  import { isWithinInterval } from "date-fns";
  import * as d3 from "d3";

  import CandlestickCanvas from "../../../assets/layercake-components/Candlestick.canvas.svelte";
  import dragChart from "../../../assets/layercake-actions/drag-chart";
  import dataAAPL from "../../../data/AAPL.csv";
  import {
    getFormattedDataAndXDomain,
    getXDomainFromData,
  } from "../../../data/data.utils";
  import { chartStore } from "./chart.store";
  import AxisXHTML from "../../../assets/layercake-components/AxisX.html.svelte";
  import AxisYHTML from "../../../assets/layercake-components/AxisY.html.svelte";
  import {
    getStepForZoomAxis,
    getStepForZoom,
    registerZoomsHandlers,
    registerMouseMoveHandlers,
    registerUiHandlers,
  } from "./chart.logic";

  import {
    changeDomain,
    getColor,
    getColorHex,
    getDifferenceInMilliseconds,
    handlePanMove,
    formatDateInTickX,
  } from "./chart.utils";
  let axisX = null;
  let axisY = null;
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
  const rescaleDomainY = () => {
    let filteredData = data.filter((d) =>
      isWithinInterval(d[xKey], {
        start: $chartStore.xDomain[0],
        end: $chartStore.xDomain[1],
      })
    );
    yDomain = [
      ...[
        d3.min(filteredData, (d) => d.low),
        d3.max(filteredData, (d) => d.high),
      ],
    ];
  };
  onMount(async () => {
    console.log(chartContainerEl.clientWidth);
    registerZoomsHandlers(chartContainerEl, padding);
    registerMouseMoveHandlers(chartContainerEl);
    registerUiHandlers(chartContainerEl, axisX, axisY);
    const { data, xDomain } = await getFormattedDataAndXDomain({
      data: dataAAPL,
      sinceDate,
      untilDate,
    });
    chartStore.setContainerRef(chartContainerEl);
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
    const { detail } = e;
    if (e.target == yLine) return;
    if (e.target == xLine) return;

    if ($chartStore.isDragging) {
      const step =
        getDifferenceInMilliseconds(
          $chartStore.xDomain[$chartStore.xDomain.length - 1],
          $chartStore.xDomain[0]
        ) / 20;
      handlePanMove(e, step);
      rescaleDomainY();
      return;
    }
    if ($chartStore.isDraggingAxisX) {
      const dx = detail.dx;

      const step = getStepForZoom();
      changeDomain(dx, step * 5);
      return;
    }
    if ($chartStore.isDraggingAxisY) {
      const dy = detail.dy;
      const step = getStepForZoomAxis(yDomain) * 2.5;
      if (dy > 0) {
        yDomain = [...[yDomain[0] - step, yDomain[1] + step]];
      }
      if (dy < 0) {
        yDomain = [...[yDomain[0] + step, yDomain[1] - step]];
      }

      return;
    }
  };

  const resetZoom = () => {
    let $data = [...$chartStore.data];
    yDomain = [...[d3.min($data, (d) => d.low), d3.max($data, (d) => d.high)]];

    let xDomain = getXDomainFromData($data);
    chartStore.setXDomain(xDomain);
  };
</script>

<div
  class="chart-container"
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={chartContainerEl}
  use:dragChart
  on:panmove={onPanMove}
  on:dblclick={resetZoom}
  on:mousewheel={(e) => e.preventDefault()}
  class:draggable={$chartStore.isDragging}
>
  <div class="mouse-pos">
    X: {$chartStore.mousePOS.X} Y: {$chartStore.mousePOS.Y} isDragging:{$chartStore.isDragging}
    isDraggingAxisX:{$chartStore.isDraggingAxisX} isDraggingAxisY:{$chartStore.isDraggingAxisY}
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
    <Canvas>
      <CandlestickCanvas />
    </Canvas>
    <Html>
      <AxisXHTML
        formatTick={formatDateInTickX}
        on:mount={({ detail: { componentEl } }) => (axisX = componentEl)}
      />
      <AxisYHTML
        on:mount={({ detail: { componentEl } }) => (axisY = componentEl)}
      />
    </Html>
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
