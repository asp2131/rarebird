<script>
  export let id = '';
  export let shape = 'rounded';
  export let placeholder = 'Drop an image';
  export let src = '';
  export let fit = 'cover';

  let slotRef;

  $: if (slotRef && id) {
    slotRef.id = id;
  }
</script>

<div
  bind:this={slotRef}
  class="image-slot"
  data-shape={shape}
  data-placeholder={placeholder}
  style="object-fit: {fit};"
>
  {#if src}
    <img {src} alt={placeholder} style="width:100%;height:100%;object-fit:{fit};" />
  {:else}
    <div class="slot-placeholder">
      <span>{placeholder}</span>
    </div>
  {/if}
</div>

<style>
  .image-slot {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .slot-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.04);
    color: rgba(44,36,24,0.45);
    font-size: 13px;
    text-align: center;
    padding: 12px;
  }
</style>
