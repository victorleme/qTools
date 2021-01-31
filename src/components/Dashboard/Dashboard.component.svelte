<script>
  import Toolbar from "../Toolbar/Toolbar.component.svelte";
  import Watch from "../Watch/Watch.component.svelte";
  import Graph from "../Graph/Graph.component.svelte";
</script>

<div class="main-grid">
  <div class="toolbar">
    <Toolbar />
  </div>
  <div class="graph">
    <Graph />
  </div>
  <div class="watch">
    <Watch />
  </div>
</div>

<style lang="scss">
  .main-grid {
    display: grid;
    height: 100%;
    width: 100%;
    grid-column-gap: 0.2rem;
    grid-template-columns: min-content 7fr 2fr;
  }
</style>
