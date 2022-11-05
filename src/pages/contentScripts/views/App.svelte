<script lang="ts">

  export let show = false

  function toggle(){
    show = !show
  }
</script>

<main>
  <div class="fixed right-10 bottom-0 mb-10 mr-0 z-300 flex font-sans select-none leading-1em">
    <p
      class="bg-white text-gray-800 rounded-full w-max h-min {show ? 'opacity-100' : 'opacity-0'} px-4 py-2  my-auto mr-2 transition-opacity duration-300"
    >
      Sveltesse WebExt
    </p>
    <p
      class="flex w-10 h-10 rounded-full cursor-pointer bg-sky-400 hover-bg-sky-600"
      on:click={toggle}
    >
      <Icon icon="gridicons:bug" inline={true} class="align-middle inline-block" height="2.2em" />
    </p>
  </div>
</main>
