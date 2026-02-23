<script>
  import { onMount, afterUpdate } from 'svelte';
  import QRCodeStyling from 'qr-code-styling';

  export let content = '';
  export let color = '#000000';
  export let bgColor = '#ffffff';
  export let dotType = 'rounded';
  export let logo = '';
  export let size = 250;

  let ref;

  // Rebuild instance setiap kali prop berubah
  $: if (ref) buildQr(content, color, bgColor, dotType, logo, size);

  function buildQr(..._deps) {
    if (!ref) return;
    const instance = new QRCodeStyling({
      width: size,
      height: size,
      data: content || ' ',
      image: logo,
      dotsOptions: { color, type: dotType },
      cornersSquareOptions: { type: 'extra-rounded', color },
      cornersDotOptions: { color },
      backgroundOptions: { color: bgColor },
      imageOptions: { crossOrigin: 'anonymous', margin: 8, imageSize: 0.35 },
      qrOptions: { errorCorrectionLevel: 'H' },
    });
    ref.innerHTML = '';
    instance.append(ref);
  }

  onMount(() => buildQr(content, color, bgColor, dotType, logo, size));
</script>

<div
  bind:this={ref}
  style="display: inline-block; border-radius: 16px; overflow: hidden;
         box-shadow: 0 8px 32px rgba(0,0,0,0.3); line-height: 0;"
></div>
