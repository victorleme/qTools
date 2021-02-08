<script lang="ts">
  import Dashboard from "./components/Dashboard/Dashboard.component.svelte";
  import CanvasWithSVG from "./playground/CanvasWithSVG.svelte";
  import { textToCSV } from "./data/data.utils";
</script>

<main>
  <Dashboard />
  <CanvasWithSVG />
</main>

<style>
  main {
    overflow: hidden;
    height: 100%;
    width: 100%;
    background-color: #e0e3eb;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
