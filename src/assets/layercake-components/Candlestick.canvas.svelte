<script>
  import { getContext, onMount } from "svelte";
  import { scaleCanvas } from "layercake";
  import {
    getDifferenceInMilliseconds,
    getDomainOfDateRange,
  } from "../../chart-utils/chart.utils";
  import * as d3 from "d3";
  export let cursorPosX = null;
  export let projection;
  const { ctx } = getContext("canvas");
  const canva = getContext("canvas");
  const {
    data,
    width,
    height,
    xGet,
    yGet,
    xScale,
    yScale,
    xDomain,
    yDomain,
  } = getContext("LayerCake");

  const getBandwidthCandlestick = () => {
    const [minDate, maxDate] = getDomainOfDateRange({
      data: $data,
      key: "date",
    });
    const xDomainOriginalDelta = getDifferenceInMilliseconds(maxDate, minDate);
    const xDomainDelta = getDifferenceInMilliseconds($xDomain[1], $xDomain[0]);

    return xDomainOriginalDelta / xDomainDelta;
  };

  const getColor = (element) => {
    return element.open > element.close
      ? d3.schemeSet1[0]
      : element.close > element.open
      ? d3.schemeSet1[2]
      : d3.schemeSet1[8];
  };
  const drawLine = ({
    x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0,
    fill = "black",
    lineWidth = 2,
  }) => {
    $ctx.beginPath();
    $ctx.moveTo(x1, y1);
    $ctx.lineTo(x2, y2);
    $ctx.strokeStyle = fill;
    $ctx.lineWidth = lineWidth;
    $ctx.stroke();
  };

  /* --------------------------------------------
   * Add this optional export in case you want to plot only a subset of the features
   * while keeping the zoom on the whole geojson feature set
   */
  export let features = $data;

  $: {
    if ($ctx) {
      scaleCanvas($ctx, $width, $height);
      $ctx.clearRect(0, 0, $width, $height);

      $ctx.beginPath();

      $ctx.strokeStyle = "#FF0000";
      $ctx.stroke();
      $ctx.beginPath();
      $data.forEach((element, i) => {
        if (i < $data.length - 5) {
          drawLine({
            y1: $yScale(element.low),
            y2: $yScale(element.high),
            x1: $xScale(element.date),
            x2: $xScale(element.date),
            fill: getColor(element),
            lineWidth: 0.5,
          });
          drawLine({
            y1: $yScale(element.open),
            y2: $yScale(element.close),
            x1: $xScale(element.date),
            x2: $xScale(element.date),
            fill:
              Math.abs($xScale(element.date) - cursorPosX) < 100
                ? "yellow"
                : getColor(element),
            lineWidth: 5 * getBandwidthCandlestick() * 0.9,
          });
        }
      });
    }
  }
</script>
