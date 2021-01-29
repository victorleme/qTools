<script lang="ts">
  import Graph from "./Graph.svelte";
  export let name;
  let num: number = 0;
  let stocks = ["PETR4", "ITUB4", "GGBR4"];
  const addNumber = (i: number) => {
    num = num + i;
  };
  type TodoType = {
    id: number;
    name: string;
    completed: boolean;
  };
</script>

<main>
  <h1>qTools</h1>
  <p>Quantum Finance Analytics App</p>
  <div class="stock-grid">
    {#each stocks as stock}
      <div>
        <div class="graph-title">{stock}</div>
        <div class="graph">
          <Graph />
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  .stock-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 0.5rem;
  }
  .graph-title {
    margin: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .graph {
    cursor: pointer;
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
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
