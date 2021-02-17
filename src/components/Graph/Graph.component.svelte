<script>
  import { onMount } from "svelte";
  import CandlestickChart from "../CandlestickChart/CandlestickChart.component.svelte";
  import VolumeChart from "../VolumeChart/VolumeChart.component.svelte";
  import dataAAPL from "../../data/AAPL.csv";
  import { getFormattedDataAndXDomain } from "../../data/data.utils";
  import { chartStore } from "../../store/chart/chart.store";
  import { isDrawing } from "../../store/paint/paint.store";
  import Chart from "./Chart/Chart.svelte";
  let isDraw = false;
  let sinceDate = "2004-01";
  let untilDate = "2005-01";

  let formattedData = [];
  isDrawing.subscribe((n) => {
    console.log(n);
    isDraw = n;
  });
  const fetchData = () => {
    const { data, xDomain } = getFormattedDataAndXDomain(dataAAPL);
    chartStore.setXDomain(xDomain);
    chartStore.setData([...formattedData]);
  };
  onMount(() => {
    fetchData();
  });
</script>

<div class="graph-grid">
  <div class="graph-toolbar">
    <div class="asset-label">ES12!{isDraw}</div>
    <div class="input-year">
      <div class="date-1">
        <label>DE</label>
        <input type="month" bind:value={sinceDate} disabled />
      </div>
      <div class="date-2">
        <label>ATÉ</label>
        <input type="month" bind:value={untilDate} disabled />
      </div>
    </div>
  </div>
  <div class="graph-chart">
    <div class="main-chart"><Chart /></div>
  </div>
</div>

<style lang="scss">
  .graph-chart {
    background-color: white;
    display: grid;
  }
  .asset-label {
    display: inline-block;
    font-size: 1.5rem;
    padding: 1.5rem 1.5rem;
    &:hover {
      background-color: #b0c1e8;
    }
  }
  .graph-toolbar {
    display: grid;
    grid-auto-flow: column;
    background-color: white;
    grid-template-columns: 1fr 1fr;
    cursor: default;
    .input-year {
      display: grid;
      grid-auto-flow: column;
    }
  }
  .graph-grid {
    display: grid;
    height: 100%;
    grid-template-rows: min-content 1fr;
    grid-row-gap: 0.1rem;
  }
</style>
