<script>
  import { LayerCake, Svg } from "layercake";

  import Line from "./components/Line.svelte";
  import Area from "./components/Area.svelte";
  import AxisX from "./components/AxisX.svelte";
  import AxisY from "./components/AxisY.svelte";

  // This example loads csv data as json using @rollup/plugin-dsv
  import data from "./data/points.csv";

  const xKey = "myX";
  const yKey = "myY";

  data.forEach((d) => {
    d[yKey] = +d[yKey];
  });
</script>

<div class="chart-container">
  <LayerCake
    padding={{ right: 10, bottom: 20, left: 25 }}
    x={xKey}
    y={yKey}
    yDomain={[0, null]}
    {data}
  >
    <Svg>
      <AxisX />
      <AxisY ticks={4} />
      <Line stroke={"#ff3e00"} />
      <Area fill={"rgba(255, 62, 0, 0.2)"} />
    </Svg>
  </LayerCake>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 100%;
  }
</style>
