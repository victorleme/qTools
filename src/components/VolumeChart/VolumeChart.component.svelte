<script lang="ts">
  import { LayerCake, Svg, Html } from "layercake";
  import dragChart from "../../assets/layercake-actions/drag-chart";
  import * as d3 from "d3";

  import { sub, add, format, isFirstDayOfMonth } from "date-fns";
  import AxisX from "../../assets/layercake-components/AxisX.svelte";
  import AxisY from "../../assets/layercake-components/AxisY.svelte";
  import Volume from "../../assets/layercake-components/Volume.svelte";
  // This example loads csv data as json using @rollup/plugin-dsv
  import { chartStore } from "../../store/chart/chart.store";
  let width = 0,
    height = 0;
  let ticks = [];
  let xDomainBar = [];
  let xDomain = [];
  chartStore.subscribe((store) => {
    const data = store.data;
    const xDomainStore = store.xDomain;
    console.log(store);
    if (data.length > 0 && xDomainStore.length > 0) {
      ticks = d3.utcMonday.range(xDomainStore[0], +xDomainStore[1] + 1);
      xDomainBar = ticks.map((tick) => {
        return format(tick, "dd/MM/yyyy");
      });
      xDomain = [...[xDomainStore[0], xDomainStore[1]]];
      console.log(xDomain);
    }
  });
  export let data = [];

  let isDragging = false;
  //Layers: Pontos,

  //Indicadores: Volume, MACD

  //Canvas & SVG

  // Detalhar o movimento do índice

  // Raio - x:

  // Desenhar Régua:
  let padding = { left: 25, bottom: 25, right: 50 };
  let chartContainerEl;

  const xKey = "date";
  const yKey = "volume";

  $: {
    data.forEach((d) => {
      d[yKey] = +d[yKey];
    });
  }
  $: [minDate, maxDate] =
    data.length > 0
      ? d3.extent(data, function (d) {
          return d.date;
        })
      : [-1, 1];

  $: yDomain =
    data.length > 0
      ? [d3.min(data, (d) => d.volume), d3.max(data, (d) => d.volume)]
      : [0, 1];

  const resizeDomain = ({ axis = "Y", key = "", min = 0, max = Infinity }) => {
    const _data = [...data].filter((d) => {
      return d[key] > min && d[key] < max;
    });
    if (axis === "Y" && _data.length > 0) {
      yDomain = [
        ...[d3.min(_data, (d) => d.volume), d3.max(_data, (d) => d.volume)],
      ];
    }
  };

  let evt;
  let evtMouseDotted = evt;

  const handleWheel = (e) => {
    changeDomain(e.deltaY);
    //e.preventDefault();
  };
  const changeDomain = (delta = 0) => {
    const minDate = xDomain[0];

    const OneMonth = { months: 1 };
    if (delta > 0) {
      const newMinDate = sub(minDate, OneMonth);
      xDomain = [...[newMinDate, xDomain[1]]];
    }
    if (delta < 0) {
      const newMinDate = add(minDate, OneMonth);

      xDomain = [...[newMinDate, xDomain[1]]];
    }

    resizeDomain({ axis: "Y", key: "date", min: xDomain[0], max: xDomain[1] });
    //xDomain = [...[xDomain[0].setMonth(xDomain[0].getMonth() - 1), xDomain[1]]];
  };
  const onPanMove = ({ detail = { dx: 0, dy: 0 } }) => {
    isDragging = true;
    const { dx, dy } = detail;
    const [minDate, maxDate] = [...xDomain];
    const newMinDate =
      dx < 0 ? add(minDate, { days: 3 }) : sub(minDate, { days: 3 });
    const newMaxDate =
      dx < 0 ? add(maxDate, { days: 3 }) : sub(maxDate, { days: 3 });

    xDomain = [...[newMinDate, newMaxDate]];
    resizeDomain({ axis: "Y", key: "date", min: xDomain[0], max: xDomain[1] });
  };
  const onPanEnd = () => {
    isDragging = false;
  };
  const logEvent = (e) => console.log(e.type, e.detail);
  const formatTickX = (d) => {
    const isFirstDay = isFirstDayOfMonth(d);
    if (isFirstDay) return format(d, "MMM");

    return format(d, "dd/MM");
  };
  const check = () => {
    console.log("xDomain", xDomain, "yDomain", yDomain, "data", data);
  };
  const formatTickY = (d) => {
    return d3.format(".2s")(d);
  };
</script>

<div
  class="chart-container"
  class:hand-cursor={isDragging}
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={chartContainerEl}
  on:wheel={handleWheel}
  use:dragChart
  on:panstart={logEvent}
  on:panmove={onPanMove}
  on:panend={onPanEnd}
  on:click={check}
  on:mousemove={(evt) => (evtMouseDotted = evt)}
>
  <LayerCake
    {padding}
    x={xKey}
    y={yKey}
    yScale={d3.scaleLinear()}
    xScale={d3.scaleTime()}
    xRange={[0, width - 50]}
    {xDomain}
    {yDomain}
    xPadding={[50, 50]}
    {data}
  >
    <Svg>
      <Volume />
      <AxisX formatTick={formatTickX} />
      <AxisY formatTick={formatTickY} />
    </Svg>
  </LayerCake>
</div>

<style>
  .hand-cursor {
    cursor: grabbing !important;
  }
  .time-x-axis {
    cursor: n-resize;
  }
  .chart-container {
    cursor: crosshair;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
