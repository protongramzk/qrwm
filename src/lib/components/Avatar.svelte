<script>
  export let src = '';
  export let username = '?';
  export let size = 64;
  export let color = '#6366f1';

  $: fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=1e1e2e`;
  $: imgSrc = src || fallback;

  function onError(e) {
    e.currentTarget.src = fallback;
  }
</script>

<div
  style="
    width: {size}px;
    height: {size}px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid {color};
    box-shadow: 0 0 0 2px rgba(0,0,0,0.3), 0 4px 16px {color}44;
    flex-shrink: 0;
    display: inline-block;
  "
>
  <img
    src={imgSrc}
    alt={username}
    style="width: 100%; height: 100%; object-fit: cover; display: block;"
    on:error={onError}
  />
</div>
