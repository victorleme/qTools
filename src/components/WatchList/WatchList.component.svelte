<script>
  import WatchListTable from "../WatchListTable/WatchListTable.component.svelte";
  const items = Array(10).fill("O");
</script>

<div class="watch-list-grid">
  <div class="watch-list-menu">Watchlist</div>
  <div class="watch-list-table">
    <WatchListTable />
  </div>
</div>

<style lang="scss">
  .watch-list-grid {
    cursor: default;
    background-color: white;
    height: 100%;
  }
  .watch-list-menu {
    font-size: 1.5rem;
    padding: 1rem 1rem;
    font-weight: bold;
    &:hover {
      background-color: #f0f3fa;
    }
  }
</style>
