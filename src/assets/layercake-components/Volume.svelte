<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet, yRange, xScale, yScale } = getContext("LayerCake");

  const columnWidth = (d) => {
    const vals = $xGet(d);
    return 5; //Math.max(0, vals[1] - vals[0]);
  };

  const columnHeight = (d) => {
    return $yRange[0] - $yGet(d);
  };
  data.subscribe((d) => {
    d.map((element) => {
      console.log(
        element,
        $yRange,
        columnHeight(element),

        $xGet(d)
      );
    });
  });

  /* --------------------------------------------
   * Default styles
   */
  export let fill = "#00e047";
  export let stroke = "";
  export let strokeWidth = 0;
</script>

<g class="column-group">
  {#each $data as d, i}
    <rect
      class="group-rect"
      data-id={i}
      x={$xGet(d)}
      y={$yGet(d)}
      width={columnWidth(d)}
      height={columnHeight(d)}
      {fill}
      {stroke}
      stroke-width={strokeWidth}
    />
  {/each}
</g>
