<script lang="ts">
  import { LayerCake, Svg, Html } from "layercake";
  import dragChart from "../../assets/layercake-actions/drag-chart";
  import * as d3 from "d3";

  import { sub, add, format, isFirstDayOfMonth } from "date-fns";
  import AxisX from "../../assets/layercake-components/AxisX.svelte";
  import AxisY from "../../assets/layercake-components/AxisY.svelte";
  import Tooltip from "../../assets/layercake-components/Tooltip.svelte";
  import DottedLine from "../../assets/layercake-components/DottedLine.svelte";
  import Scatter from "../../assets/layercake-components/Scatter.svg.svelte";
  // This example loads csv data as json using @rollup/plugin-dsv
  export let data = [];

  import Candlestick from "../../assets/layercake-components/Candlestick.svelte";
  import { textToCSV } from "../../data/data.utils";
  import RandomIndicator from "../../assets/layercake-components/RandomIndicator.svg.svelte";
  let isDragging = false;
  //Layers: Pontos,

  //Indicadores: Volume, MACD

  //Canvas & SVG

  // Detalhar o movimento do índice

  // Raio - x:

  // Desenhar Régua:

  let chartContainerEl;
  let width, height;
  const xKey = "date";
  const yKey = "high";
  data.forEach((d) => {
    d[yKey] = +d[yKey];
  });
  $: [minDate, maxDate] =
    data.length > 0
      ? d3.extent(data, function (d) {
          return d.date;
        })
      : [-1, 1];
  $: _xDomain = d3.timeDay.range(minDate, +maxDate + 1);

  $: yDomain =
    data.length > 0
      ? [d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]
      : [0, 1];
  //[d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]
  $: xDomain =
    data.length > 0
      ? d3.extent(data, function (d) {
          return d.date;
        })
      : [];
  $: yRange = [];
  $: console.log("yDomain", yDomain);
  const resizeDomain = ({ axis = "Y", key = "", min = 0, max = Infinity }) => {
    const _data = [...data].filter((d) => {
      return d[key] > min && d[key] < max;
    });
    if (axis === "Y" && _data.length > 0) {
      yDomain = [
        ...[d3.min(_data, (d) => d.low), d3.max(_data, (d) => d.high)],
      ];
      console.log([d3.min(_data, (d) => d.low), d3.max(_data, (d) => d.high)]);
    }
  };

  let evt;
  let evtMouseDotted = evt;
  let hideTooltip = true;
  const handleWheel = (e) => {
    changeDomain(e.deltaY);
    //e.preventDefault();
  };
  const changeDomain = (delta = 0) => {
    const minDate = xDomain[0];

    const OneMonth = { months: 1 };
    if (delta > 0) {
      const newMinDate = sub(minDate, OneMonth);
      xDomain = [...[newMinDate, xDomain[1]]];
    }
    if (delta < 0) {
      const newMinDate = add(minDate, OneMonth);

      xDomain = [...[newMinDate, xDomain[1]]];
    }

    resizeDomain({ axis: "Y", key: "date", min: xDomain[0], max: xDomain[1] });
    //xDomain = [...[xDomain[0].setMonth(xDomain[0].getMonth() - 1), xDomain[1]]];
  };
  const onPanMove = ({ detail = { dx: 0, dy: 0 } }) => {
    isDragging = true;
    const { dx, dy } = detail;
    const [minDate, maxDate] = [...xDomain];
    const newMinDate =
      dx < 0 ? add(minDate, { days: 3 }) : sub(minDate, { days: 3 });
    const newMaxDate =
      dx < 0 ? add(maxDate, { days: 3 }) : sub(maxDate, { days: 3 });

    xDomain = [...[newMinDate, newMaxDate]];
    resizeDomain({ axis: "Y", key: "date", min: xDomain[0], max: xDomain[1] });
  };
  const onPanEnd = () => {
    isDragging = false;
  };
  const logEvent = (e) => console.log(e.type, e.detail);
  const formatTickX = (d) => {
    const isFirstDay = isFirstDayOfMonth(d);
    if (isFirstDay) return format(d, "MMM");

    return format(d, "dd/MM");
  };
  const check = () => {
    console.log("xDomain", xDomain);
  };
</script>

<div
  class="chart-container"
  class:hand-cursor={isDragging}
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={chartContainerEl}
  on:wheel={handleWheel}
  use:dragChart
  on:panstart={logEvent}
  on:panmove={onPanMove}
  on:panend={onPanEnd}
  on:click={check}
  on:mousemove={(evt) => (evtMouseDotted = evt)}
>
  <LayerCake
    padding={{ right: 50 }}
    x={xKey}
    y={yKey}
    yScale={d3.scaleLinear()}
    xScale={d3.scaleTime()}
    xRange={[0, width - 50]}
    {xDomain}
    {yDomain}
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
        on:mousemove={(event) => (evt = hideTooltip = event)}
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
      <AxisX formatTick={formatTickX} />
      <DottedLine evt={evtMouseDotted} {width} {height} />
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
