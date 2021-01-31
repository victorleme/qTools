<script lang="ts">
  import { textToCSV } from "./data/data.utils";
  import Dashboard from "./components/Dashboard/Dashboard.component.svelte";
  // const url =
  //   "https://static.anychart.com/git-storage/word-press/data/candlestick-chart-tutorial/EUR_USDHistoricalData2year.csv";
  // export let name;
  // let num: number = 0;
  // let stocks = ["PETR4"];
  // const addNumber = (i: number) => {
  //   num = num + i;
  // };
  // let data = [];
  // fetch(url).then(async (response) => {
  //   if (response.ok) {
  //     const text = await response.text();
  //     data = [...(await textToCSV(text))];
  //   }
  // });
</script>

<main>
  <Dashboard />
</main>

<style>
  main {
    overflow: hidden;
    height: 100%;
    width: 100%;
    background-color: #e0e3eb;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    margin: 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
