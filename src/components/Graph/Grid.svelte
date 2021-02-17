<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg, Canvas, Html } from "layercake";

  import AxisXHTML from "../../assets/layercake-components/AxisX.html.svelte";
  import AxisYHTML from "../../assets/layercake-components/AxisY.html.svelte";
  import { formatDateInTickX } from "../../chart-utils/chart.utils";
</script>

<Html>
  <AxisXHTML formatTick={formatDateInTickX} />
  <AxisYHTML />
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
