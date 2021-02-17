<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet } = getContext("LayerCake");

  export let evt = null;
  export let width = 0;
  export let height = 0;
  export let padding = { top: 0, left: 0, right: 0, bottom: 0 };
  $: centerX = evt ? evt.offsetX : 0;
  $: centerY = evt ? evt.offsetY : 0;

  $: console.log(padding);
</script>

<line
  stroke-dasharray="5,5"
  x1="0"
  y1={centerY - padding.bottom}
  x2={width}
  y2={centerY - padding.bottom}
  stroke="grey"
  stroke-width="1"
/>
<line
  stroke-dasharray="5,5"
  x1={centerX + padding.left}
  y1="0"
  x2={centerX + padding.left}
  y2={height}
  stroke="grey"
  stroke-width="1"
/>

<style>
</style>
