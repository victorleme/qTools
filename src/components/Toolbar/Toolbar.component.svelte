<script>
  import Pencil from "../Pencil/Pencil.svelte";
  import { isDrawing } from "../../store/paint/paint.store.js";
  const items = Array(140).fill("O");
  const handleClickPencil = () => {
    let isDrawingFlag = $isDrawing;

    isDrawing.set(!isDrawingFlag);
  };
</script>

<div class="toolbar-grid">
  <div class="toolbar-menu item">M</div>
  <div class="toolbar item" on:click={handleClickPencil}>
    <Pencil height={25} width={25} color={$isDrawing ? "orange" : "black"} />
  </div>
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
    cursor: pointer;
    padding: 1.5rem 1.5rem;
    font-size: 1.5rem;
    &:hover {
      background-color: #f0f3fa;
    }
  }
  .toolbar-grid {
    background-color: white;
    height: 100%;
  }
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 7fr 1fr;
  }
</style>
