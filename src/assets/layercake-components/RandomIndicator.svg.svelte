<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

  export let r = 5;
  export let fill = "orange";
  export let stroke = "#0cf";
  export let strokeWidth = 0;
  export let dx = 0;
  export let dy = 0;
</script>

<g class="scatter-group">
  {#each $data as d, i}
    {#if i % 5 === 0}
      <circle
        cx={$xGet(d) + (typeof dx === "function" ? dx($xScale) : dx) + 30}
        cy={$yGet(d) + (typeof dy === "function" ? dy($yScale) : dy) - 50}
        {r}
        {fill}
        {stroke}
        stroke-width={strokeWidth}
      />
    {/if}
  {/each}
</g>
