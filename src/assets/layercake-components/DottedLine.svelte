<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet } = getContext("LayerCake");

  export let stroke = "#ab00d6";
  export let evt = null;
  export let width = 0;
  export let height = 0;
  $: evt && console.log(evt.offsetX, evt.offsetY, width);
  $: centerX = evt ? evt.offsetX : 0;
  $: centerY = evt ? evt.offsetY : 0;
</script>

<line
  stroke-dasharray="5,5"
  x1="0"
  y1={centerY}
  x2={width}
  y2={centerY}
  stroke="grey"
  stroke-width="1"
/>
<line
  stroke-dasharray="5,5"
  x1={centerX}
  y1="0"
  x2={centerX}
  y2={height}
  stroke="grey"
  stroke-width="1"
/>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }
</style>
