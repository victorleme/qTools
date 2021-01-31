<script>
  import { getContext, createEventDispatcher } from "svelte";
  import * as d3 from "d3";
  import { raise } from "layercake";
  const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  data.subscribe((data) => {});
  function handleMousemove(d) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch("mousemove", { e, props: d });
      }
    };
  }
</script>

<g class="bar-group" on:mouseout={(e) => dispatch("mouseout")}>
  {#each $data as d, i}
    <g
      on:mouseover={(e) => dispatch("mousemove", { e, props: d })}
      on:mousemove={handleMousemove(d)}
    >
      <line
        y1={$yScale(d.low)}
        stroke={"black"}
        y2={$yScale(d.high)}
        style="stroke-width:1"
        transform={`translate(${$xScale(d.date)},0)`}
      />
      <line
        y1={$yScale(d.open)}
        y2={$yScale(d.close)}
        stroke={d.open > d.close
          ? d3.schemeSet1[0]
          : d.close > d.open
          ? d3.schemeSet1[2]
          : d3.schemeSet1[8]}
        style="stroke-width:5"
        transform={`translate(${$xScale(d.date)},0)`}
      />
    </g>
  {/each}
</g>

<style>
</style>
