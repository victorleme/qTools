<script lang="ts">
  import Graph from "./Graph.svelte";
  import { textToCSV } from "./data/data.utils";
  const url =
    "https://static.anychart.com/git-storage/word-press/data/candlestick-chart-tutorial/EUR_USDHistoricalData2year.csv";
  export let name;
  let num: number = 0;
  let stocks = ["PETR4"];
  const addNumber = (i: number) => {
    num = num + i;
  };
  let data = [];
  fetch(url).then(async (response) => {
    if (response.ok) {
      const text = await response.text();
      data = [...(await textToCSV(text))];
    }
  });
  type TodoType = {
    id: number;
    name: string;
    completed: boolean;
  };
</script>

<main>
  <div class="stock-grid">
    {#each stocks as stock}
      <div>
        <div class="graph-title">{stock}</div>
        <div class="graph">
          <Graph {data} />
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  .stock-grid {
    padding: 1rem 1rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 0.5rem;
  }
  .graph-title {
    margin: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .graph {
    cursor: crosshair;
    height: 30rem;
    width: 100%;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
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
