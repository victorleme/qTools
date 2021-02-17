<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg, Canvas, Html } from "layercake";

  import AxisXHTML from "../../assets/layercake-components/AxisX.html.svelte";
  import AxisYHTML from "../../assets/layercake-components/AxisY.html.svelte";
  import { formatDateInTickX } from "../../chart-utils/chart.utils";
  import { registerUiAxisHandlers } from "./grid.logic.js";
  let axisX = null;
  let axisY = null;
  onMount(() => {
    registerUiAxisHandlers(axisX, axisY);
  });
</script>

<Html>
  <AxisXHTML
    formatTick={formatDateInTickX}
    on:mount={({ detail: { componentEl } }) => (axisX = componentEl)}
  />
  <AxisYHTML
    on:mount={({ detail: { componentEl } }) => (axisY = componentEl)}
  />
</Html>

<style>
  .chart {
    cursor: pointer;
  }
  .chart-container {
    overflow: hidden;
    cursor: crosshair;
    width: 100%;
    height: 100%;
  }
</style>
