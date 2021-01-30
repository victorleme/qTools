<script>
  import { LayerCake, Svg, Html } from "layercake";
  import * as d3 from "d3";

  import { sub, add } from "date-fns";
  import AxisX from "./components/AxisX.svelte";
  import AxisY from "./components/AxisY.svelte";
  import Tooltip from "./components/Tooltip.svelte";
  import Bar from "./components/Bar.svelte";

  // This example loads csv data as json using @rollup/plugin-dsv
  export let data = [];
  let margin = { top: 0, bottom: 20, left: 30 };
  import Candlestick from "./components/Candlestick.svelte";
  import DottedLine from "./components/DottedLine.svelte";

  let chartContainerEl;
  let width, height;
  data.forEach((d) => {
    d[yKey] = +d[yKey];
  });
  $: console.log(data);
  $: xScale =
    data.length > 0
      ? d3
          .scaleBand()
          .domain(
            d3.utcDay
              .range(data[0].date, +data[data.length - 1].date + 1)
              .filter((d) => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
          )
          .range([margin.left, -margin.right])
          .padding(0.2)
      : () => {};

  $: yDomain =
    data.length > 0
      ? [d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]
      : [];
  //[d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]
  $: xDomain =
    data.length > 0
      ? d3.extent(data, function (d) {
          return d.date;
        })
      : [];
  $: teste = data.length > 0 ? d3.scaleLinear().domain(yDomain).ticks() : [];
  const xKey = "date";
  const yKey = "high";
  $: data.length > 0 && console.log(teste);
  $: console.log(teste, width, xDomain);
  let evt;
  let evtMouseDotted = evt;
  let hideTooltip = true;
  const handleWheel = (e) => {
    console.log(e.deltaY);
    changeDomain(e.deltaY);
    //e.preventDefault();
  };
  const changeDomain = (delta = 0) => {
    const minDate = xDomain[0];
    const maxDate = xDomain[1];
    const OneMonth = { months: 1 };
    if (delta < 0) {
      const newMinDate = sub(minDate, OneMonth);
      const newMaxDate = sub(maxDate, OneMonth);
      xDomain = [...[newMinDate, newMaxDate]];
    }
    if (delta > 0) {
      const newMinDate = add(minDate, OneMonth);
      const newMaxDate = add(maxDate, OneMonth);
      xDomain = [...[newMinDate, newMaxDate]];
    }

    console.log(xDomain);
    //xDomain = [...[xDomain[0].setMonth(xDomain[0].getMonth() - 1), xDomain[1]]];
  };
</script>

<div
  class="chart-container"
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={chartContainerEl}
  on:wheel={handleWheel}
  on:mousemove={(evt) => (evtMouseDotted = evt)}
>
  <LayerCake
    x={xKey}
    y={yKey}
    xScale={d3.scaleTime()}
    xRange={[0, width]}
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
    <Svg>
      <Candlestick
        on:mousemove={(event) => (evt = hideTooltip = event)}
        on:mouseout={() => (hideTooltip = true)}
      />
      <AxisX
        formatTick={(d) => `${d.getDate()} / ${d.getMonth()}`}
        class="time-x-axis"
      />
      <AxisY />
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
  </LayerCake>
</div>

<style>
  .time-x-axis {
    cursor: n-resize;
  }
  .chart-container {
    width: 100%;
    height: 100%;
    border-color: black;
    border: 1px solid;
  }
</style>
