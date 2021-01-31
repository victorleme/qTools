<script>
  import CandlestickChart from "../CandlestickChart/CandlestickChart.component.svelte";
</script>

<div class="graph-grid">
  <div class="graph-toolbar">
    <div class="asset-label">ES12!</div>
  </div>
  <div class="graph-chart">
    <CandlestickChart />
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
