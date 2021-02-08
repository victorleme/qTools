<script>
  import { getContext, createEventDispatcher } from "svelte";
  import * as d3 from "d3";
  import { raise } from "layercake";
  import {
    getDifferenceInMilliseconds,
    getDomainOfDateRange,
  } from "../../chart-utils/chart.utils";

  export let trim = 0;
  const { data, xGet, yGet, xScale, yScale, xDomain } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  let candleWitdh = 200;
  const getBandwidthCandlestick = () => {
    const [minDate, maxDate] = getDomainOfDateRange({
      data: $data,
      key: "date",
    });
    const xDomainOriginalDelta = getDifferenceInMilliseconds(maxDate, minDate);
    const xDomainDelta = getDifferenceInMilliseconds($xDomain[1], $xDomain[0]);

    return xDomainOriginalDelta / xDomainDelta;
  };
  const getWidth = () => {
    if (data.length === 0) return 0;
    return candleWitdh / data.length;
  };
  function handleMousemove(d) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch("mousemove", {
          e,
          props: { ...d, centerX: $xScale.invert(e.offsetX - 25) },
        });
      }
      // paddingLeft
    };
  }
  const handleMouseListener = (evt) => {
    console.log(evt.offsetX);
  };
</script>

<g
  class="bar-group"
  on:mouseout={(e) =>
    dispatch("mouseout", {
      e,
      props: { centerX: $xScale.invert(e.offsetX - 25) },
    })}
>
  {#each $data as d, i}
    {#if $xScale(d.date) && i > $data.length - trim}
      <g
        on:mouseover={(e) =>
          dispatch("mousemove", {
            e,
            props: { ...d, centerX: $xScale.invert(e.offsetX - 25) },
          })}
        on:mousemove={handleMousemove(d)}
      >
        <line
          y1={$yScale(d.low)}
          stroke={d.open > d.close
            ? d3.schemeSet1[0]
            : d.close > d.open
            ? d3.schemeSet1[2]
            : d3.schemeSet1[8]}
          y2={$yScale(d.high)}
          stroke-width={1 * getBandwidthCandlestick() * 0.9}
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
          stroke-width={Math.round(5 * getBandwidthCandlestick(d) * 0.9)}
          transform={`translate(${$xScale(d.date)},0)`}
        />
      </g>
    {/if}
  {/each}
</g>

<style>
</style>
