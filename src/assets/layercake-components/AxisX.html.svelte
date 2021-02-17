<script>
  import { getContext, onMount, createEventDispatcher } from "svelte";
  import { chartStore } from "../../components/Graph/Chart/chart.store";
  import dragChart from "../layercake-actions/drag-chart";
  const { width, height, xScale, yScale, padding } = getContext("LayerCake");

  export let gridlines = true;
  export let formatTick = (d) => d;
  export let baseline = false;
  export let snapTicks = false;
  export let ticks = undefined;
  export let onAxisDrag = () => {};
  export let onAxisDragEnd = () => {};
  export let yTick = 7;
  export let dyTick = 0;

  const dispatch = createEventDispatcher();
  let axisX = null;

  $: isBandwidth = typeof $xScale.bandwidth === "function";

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : isBandwidth
    ? $xScale.domain()
    : $xScale.ticks(ticks);

  onMount(() => {
    dispatch("mount", {
      componentEl: axisX,
    });
  });
</script>

<div class="axis x-axis" class:snapTicks>
  <div bind:this={axisX} class="axis-pointer" use:dragChart />
  {#each tickVals as tick, i}
    {#if gridlines !== false}
      <div
        class="gridline"
        style="left:{$xScale(tick) +
          $padding.left}px;top: -{$padding.top}px;bottom: 0;"
      />
    {/if}
    <div
      class="tick tick-{i}"
      style="left:{$xScale(tick) +
        (isBandwidth ? $xScale.bandwidth() / 2 : 0)}px;top:100%;"
    >
      <div class="text" style="top:{yTick + dyTick}px;">
        {formatTick(tick)}
      </div>
    </div>
  {/each}
  {#if baseline === true}
    <div class="baseline" style="top: 100%;width: 100%;" />
  {/if}
</div>

<style>
  .axis-pointer {
    width: 100%;
    height: 2rem;
    position: absolute;
    top: 100%;
    z-index: 9999;
    cursor: ew-resize;
  }
  .axis,
  .tick,
  .gridline,
  .baseline {
    position: absolute;
    z-index: 99;
  }
  .axis {
    width: 100%;
    height: 100%;
    user-select: none;
  }
  .tick {
    font-size: 0.725em;
    font-weight: 200;
  }

  .gridline {
    border-left: 1px dashed #aaa;
  }

  .baseline {
    border-top: 1px solid #aaa;
  }

  .tick .text {
    color: #666;
    position: relative;
    white-space: nowrap;
    transform: translateX(-50%);
  }
  .axis.snapTicks .tick:last-child {
    transform: translateX(-50%);
  }
  .axis.snapTicks .tick:first-child {
    transform: translateX(50%);
  }
</style>
