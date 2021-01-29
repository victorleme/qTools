<script lang="ts">
  export let name;
  let num: number = 0;

  const addNumber = (i: number) => {
    num = num + i;
  };
  type TodoType = {
    id: number;
    name: string;
    completed: boolean;
  };
</script>

<main>
  <h1>qTools</h1>
  <p>Quantum Finance Analytics App</p>
  <button on:click={() => addNumber(1)}>Add number</button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
