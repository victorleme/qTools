<script>
  import CandlestickChart from "../CandlestickChart/CandlestickChart.component.svelte";
  import data from "../../data/AAPL.csv";
  import { formatEntry, textToCSV } from "../../data/data.utils";
  let sinceDate = "2004-01";
  let untilDate = "2005-01";
  $: console.log(sinceDate, untilDate);
  console.log(sinceDate, untilDate);
  let formattedData = [];
  const formatData = async (data) => {
    const dateObjectSince = new Date(sinceDate);
    const dateObjectUntil = new Date(untilDate);
    console.log(dateObjectSince.getDay(), dateObjectUntil);
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
    if (formattedData.length > 0) {
      console.log(
        formattedData[0].date,
        formattedData[formattedData.length - 1].date,
        dateObjectSince,
        formattedData
      );
      console.log(formattedData[0]);
    }
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
    <CandlestickChart data={formattedData} />
  </div>
</div>

<style lang="scss">
  .graph-chart {
    height: 30rem;
    background-color: white;
  }
  .asset-label {
    display: inline-block;
    font-size: 1.5rem;
    padding: 1rem 1rem;
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

    grid-template-rows: 1fr max-content;
    grid-row-gap: 0.1rem;
  }
</style>
