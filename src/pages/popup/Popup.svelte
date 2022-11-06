<script lang="ts">
  import Logo from '@components/Logo.svelte'

  function openOptionsPage() {
    browser.runtime.openOptionsPage()
  }
</script>

<style>
  button :global(.icon) {
    color: deeppink;
  }
</style>


<main class="w-[300px] px-4 py-5 text-center text-gray-700">
  <Logo />
  <h1>Popup</h1>
  <p class="mt-2 opacity-50">
    This is the popup page
  </p>
  <button class="btn mt-2" on:click={openOptionsPage} >
    <Icon icon="humbleicons:rocket" inline={true} class="icon align-middle inline-block" height="1.2em" /> Open Options page
  </button>
  <div class="mt-2">
    <span class="opacity-50">Storage:</span> NOPE
  </div>
</main>
