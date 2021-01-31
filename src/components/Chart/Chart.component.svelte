<script lang="ts">
  import { LayerCake, Svg, Html } from "layercake";
  import * as d3 from "d3";

  import { sub, add } from "date-fns";
  import AxisX from "./../../assets/layercake-components/AxisX.svelte";
  import AxisY from "./../../assets/layercake-components/AxisY.svelte";
  import Tooltip from "./../../assets/layercake-components/Tooltip.svelte";

  // This example loads csv data as json using @rollup/plugin-dsv
  export let data = [];
  let margin = { top: 0, bottom: 20, left: 30 };
  import Candlestick from "./../../assets/layercake-components/Candlestick.svelte";
  import { textToCSV } from "../../data/data.utils";

  const url =
    "https://static.anychart.com/git-storage/word-press/data/candlestick-chart-tutorial/EUR_USDHistoricalData2year.csv";
  export let name;
  let num: number = 0;
  let stocks = ["PETR4"];

  fetch(url).then(async (response) => {
    if (response.ok) {
      const text = await response.text();
      data = [...(await textToCSV(text))];
    }
  });
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
  let svgEl = null;
  $: console.log(svgEl);
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
    <Svg zIndex={1}>
      <Candlestick
        on:mousemove={(event) => (evt = hideTooltip = event)}
        on:mouseout={() => (hideTooltip = true)}
      />
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
      <AxisX formatTick={(d) => `${d.getDate()} / ${d.getMonth()}`} />
      <AxisY />
    </Svg>
  </LayerCake>
</div>

<style>
  .time-x-axis {
    cursor: n-resize;
  }
  .chart-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
