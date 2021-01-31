<script>
  const items = Array(10).fill("O");
</script>

<div class="watch-summary">
  <h2>Summary</h2>
</div>

<style lang="scss">
  .watch-summary {
    cursor: default;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    &:hover {
      background-color: #f0f3fa;
    }
  }
  h2 {
    margin: 0;
    transform: translateY(-100%);
  }
</style>
