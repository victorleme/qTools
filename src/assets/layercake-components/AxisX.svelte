<script>
  import { getContext } from "svelte";
  import { chartStore } from "../../store/chart/chart.store";
  import { formatDateInAxisDetail } from "../../chart-utils/chart.utils";
  const { width, height, xScale, yScale, yRange, data } = getContext(
    "LayerCake"
  );

  export let gridlines = true;
  export let formatTick = (d) => d;
  export let baseline = false;
  export let snapTicks = false;
  export let ticks = undefined;
  export let setTicksVals = undefined;
  export let xTick = undefined;
  export let yTick = 16;
  export let dxTick = 0;
  export let dyTick = 0;
  export let detailInAxis = false;
  export let padding = { top: 0, left: 0, right: 0, bottom: 0 };
  export let evt = null;
  $: centerX = evt ? evt.offsetX : 0;
  $: centerY = evt ? evt.offsetY : 0;
  $: isBandwidth = typeof $xScale.bandwidth === "function";

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : isBandwidth
    ? $xScale.domain()
    : $xScale.ticks(ticks);
  $: posDetailX = $xScale?.invert(centerX - padding.left);
  $: typeof setTicksVals === "function" && setTicksVals(tickVals);
  function textAnchor(i) {
    if (snapTicks === true) {
      if (i === 0) {
        return "start";
      }
      if (i === tickVals.length - 1) {
        return "end";
      }
    }
    return "middle";
  }
</script>

<g class="axis x-axis">
  {#each tickVals as tick, i}
    <g
      class="tick tick-{tick}"
      transform="translate({$xScale(tick)},{$yRange[0]})"
    >
      {#if gridlines !== false}
        <line y1={$height * -1} y2="0" x1="0" x2="0" />
      {/if}
      <text
        x={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
        y={yTick}
        dx={dxTick}
        dy={dyTick}
        text-anchor={textAnchor(i)}>{formatTick(tick, i)}</text
      >
    </g>
  {/each}

  {#if baseline === true}
    <line
      class="baseline"
      y1={$height + 0.5}
      y2={$height + 0.5}
      x1="0"
      x2={$width}
    />
  {/if}
</g>
{#if detailInAxis}
  <!-- <rect
    class="group-rect"
    x={-50}
    y={0}
    height={20}
    width={100}
    transform="translate({$xScale(posDetailX)},{$yRange[0]})"
    fill="grey"
  /> -->
  <text
    z={99}
    x="30"
    y={16}
    dx={dxTick}
    dy={dyTick}
    text-anchor={"end"}
    transform="translate({$xScale(posDetailX)},{$yRange[0]})"
    fill="grey">{formatDateInAxisDetail(posDetailX)}</text
  >
{/if}

<style>
  .axis {
    cursor: ew-resize;
    user-select: none;
    /* transform: translateY(-5%); */
  }
  .tick {
    font-size: 0.725em;
    font-weight: 200;
  }

  line,
  .tick line {
    stroke: #aaa;
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #666;
  }

  .baseline {
    stroke-dasharray: 0;
  }
</style>
