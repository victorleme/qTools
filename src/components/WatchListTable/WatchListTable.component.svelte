<script>
</script>

<div>
  <table>
    <thead>
      <th class="th-symbol">Symbol</th>
      <th class="th-last">Last</th>
      <th class="th-change">Change</th>
      <th class="th-change-percent">Change%</th>
    </thead>

    <tbody>
      <tr>
        <td class="td-symbol">SPX</td>
        <td class="td-last">3714.2</td>
        <td class="td-change red">-73.13</td>
        <td class="td-change-percent red">-1.93%</td>
      </tr>
      <tr>
        <td class="td-symbol">NDX</td>
        <td class="td-last">12925.4</td>
        <td class="td-change green">290.2</td>
        <td class="td-change-percent green">3.93%</td>
      </tr>
    </tbody>
  </table>
</div>

<style lang="scss">
  .red {
    color: #f65e53;
  }
  .green {
    color: #56b9b0;
  }
  .th-symbol {
    text-align: left;
  }
  .th-last,
  .th-change,
  .th-change-percent {
    text-align: right;
  }
  .td-last,
  .td-change,
  .td-change-percent {
    text-align: right;
  }
  thead {
    padding: 1rem 1rem;
  }
  tr {
    border-bottom: 1px solid #f0f3fa;
    &:hover {
      background-color: #f0f3fa;
    }
  }
  table {
    padding: 1rem 1rem;
    width: 100%;
    cursor: default;
  }
  th {
    color: #787b86;
    font-weight: lighter;
    border-bottom: 1px solid #e0e3eb;
    &:hover {
      color: black;
    }
  }
  .watch-list-grid {
    background-color: white;
    height: 100%;
  }
  .watch-list-menu {
    padding: 1rem 1rem;
    font-weight: bold;
    &:hover {
      background-color: #f0f3fa;
    }
  }
</style>
