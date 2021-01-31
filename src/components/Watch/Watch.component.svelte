<script>
  import WatchList from "../WatchList/WatchList.component.svelte";
  import WatchSummary from "../WatchSummary/WatchSummary.component.svelte";
  const items = Array(10).fill("O");
</script>

<div class="watch-grid">
  <div class="watch-list">
    <WatchList />
  </div>
  <div class="watch-summary">
    <WatchSummary />
  </div>
</div>

<style lang="scss">
  .watch-list {
  }
  .watch-grid {
    display: grid;
    height: 100%;
    grid-row-gap: 0.1rem;
  }
</style>
