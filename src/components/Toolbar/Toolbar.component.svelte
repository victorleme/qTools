<script>
  const items = Array(10).fill("O");
</script>

<div class="toolbar-grid">
  <div class="toolbar-menu item">M</div>
  {#each items as item, i}
    <div class="toolbar item">{`${item}`}</div>
  {/each}
</div>

<style lang="scss">
  .toolbar {
  }
  .toolbar-menu {
    margin-bottom: 0.1rem;
    background-color: white;
    border-bottom: 1px solid #e0e3eb;
  }
  .item {
    cursor: default;
    padding: 1rem 1rem;
    font-size: 1.5rem;
    &:hover {
      background-color: #f0f3fa;
    }
  }
  .toolbar-grid {
    background-color: white;
  }
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 7fr 1fr;
  }
</style>
