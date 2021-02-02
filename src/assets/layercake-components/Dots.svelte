<script>
  import { getContext } from "svelte";
  import { scaleOrdinal } from "d3-scale";

  const { data, xGet, yGet, yScale, zScale, config } = getContext("LayerCake");

  export let r = 5;

  $: midHeight = $yScale ? $yScale.bandwidth() / 2 : 0;
</script>

<g class="dot-plot">
  {#each $data as d}
    <circle
      cx={$xGet(d)}
      cy={$yGet(d) + midHeight}
      {r}
      fill={$zScale($config.x[i])}
    />
  {/each}
</g>

<style>
  line {
    stroke-width: 1px;
    stroke: #000;
  }
  circle {
    stroke: #000;
    stroke-width: 1px;
  }
</style>
