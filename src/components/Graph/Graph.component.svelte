<script>
  import CandlestickChart from "../CandlestickChart/CandlestickChart.component.svelte";
  import VolumeChart from "../VolumeChart/VolumeChart.component.svelte";
  import data from "../../data/AAPL.csv";
  import { formatEntry, textToCSV } from "../../data/data.utils";
  import { chartStore } from "../../store/chart/chart.store";
  import { getDomainOfDateRange } from "../../chart-utils/chart.utils";

  let sinceDate = "2004-01";
  let untilDate = "2005-01";

  let formattedData = [];
  const formatData = async (data) => {
    const dateObjectSince = new Date(sinceDate);
    const dateObjectUntil = new Date(untilDate);

    formattedData = data
      .map((d) => {
        const newEntry = formatEntry(d);

        return newEntry;
      })
      .filter((d) => {
        const isEqualDates =
          d.date.valueOf() === dateObjectUntil.valueOf() ||
          d.date.valueOf() === dateObjectSince.valueOf();
        const isBetweenDates =
          d.date > dateObjectSince && d.date < dateObjectUntil;
        return isEqualDates || isBetweenDates;
      });
    const xDomain = getDomainOfDateRange({ data: formattedData, key: "date" });

    chartStore.setXDomain(xDomain);

    chartStore.setData([...formattedData]);
  };
  $: data.length > 0 && formatData(data);
  //   data = [...(await textToCSV(text))];
</script>

<div class="graph-grid">
  <div class="graph-toolbar">
    <div class="asset-label">ES12!</div>
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
    <div class="main-chart"><CandlestickChart data={formattedData} /></div>
    <div class="aux-chart-1"><VolumeChart data={formattedData} /></div>
  </div>
</div>

<style lang="scss">
  .graph-chart {
    background-color: white;
    display: grid;
    grid-template-rows: 5fr 1fr;
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
