<script>
  import Chart from "../Chart/Chart.component.svelte";
</script>

<div class="graph-grid">
  <div class="graph-toolbar">
    <div class="asset-label">ES12!</div>
  </div>
  <div class="graph-chart">
    <Chart />
  </div>
</div>

<style lang="scss">
  .graph-chart {
    height: 30rem;
    background-color: white;
  }
  .asset-label {
    font-size: 1.5rem;
    padding: 1rem 1rem;
    &:hover {
      background-color: #f0f3fa;
    }
  }
  .graph-toolbar {
    background-color: white;
    cursor: default;
  }
  .graph-grid {
    display: grid;

    grid-template-rows: 1fr max-content;
    grid-row-gap: 0.1rem;
  }
</style>
