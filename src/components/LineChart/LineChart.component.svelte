<script lang="ts">
  import { LayerCake, Svg } from "layercake";

  import Line from "../../assets/layercake-components/Line.svelte";
  import Area from "../../assets/layercake-components/Area.svelte";
  import AxisX from "../../assets/layercake-components/AxisX.svelte";
  import AxisY from "../../assets/layercake-components/AxisY.svelte";
  import DottedLine from "../../assets/layercake-components/DottedLine.svelte";
  import { chartStore } from "../../store/chart/chart.store";

  // This example loads csv data as json using @rollup/plugin-dsv
  let data = [];
  let width, height;
  const xKey = "date";
  const yKey = "value";
  let evtMouseDotted = {};
  chartStore.subscribe((n) => {
    data = [...n.data];
  });
  data.forEach((d) => {
    d[yKey] = +d[yKey];
  });
  $: console.log(data);
  $: xDomain = data.length > 0 ? [data[0].date, data[1].date] : [];
</script>

<div
  class="chart-container"
  bind:clientWidth={width}
  bind:clientHeight={height}
  on:mousemove={(evt) => (evtMouseDotted = evt)}
>
  <LayerCake x={xKey} y={yKey} yDomain={[0, null]} {xDomain} {data}>
    <Svg>
      <AxisY ticks={4} />
      <!-- <Line stroke={"rgb(33,150,243)"} />
      <Area fill={"rgb(210,233,253)"} /> -->

      <AxisX />
    </Svg>
    <Svg>
      <DottedLine evt={evtMouseDotted} {width} {height} />
    </Svg>
  </LayerCake>
</div>

<style>
  .chart-container {
    cursor: crosshair;
    width: 100%;
    height: 100%;
  }
</style>
