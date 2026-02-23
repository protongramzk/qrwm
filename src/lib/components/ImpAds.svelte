<script>
  export let image = '';
  export let href = '#';
  export let size = 'md';

  const sizeMap = {
    sm: { maxWidth: '320px', height: '80px' },
    md: { maxWidth: '480px', height: '120px' },
    lg: { maxWidth: '728px', height: '90px' },
  };

  $: dim = sizeMap[size] || sizeMap.md;
</script>

<div style="display: flex; justify-content: center; margin: 12px 0;">
  <a
    {href}
    target="_blank"
    rel="noopener noreferrer"
    style="
      width: 100%;
      max-width: {dim.maxWidth};
      height: {dim.height};
      display: block;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 2px 12px rgba(0,0,0,0.18);
    "
  >
    <img
      src={image}
      alt="Advertisement"
      style="width: 100%; height: 100%; object-fit: cover; display: block;"
    />
    <span style="
      position: absolute; top: 4px; right: 6px;
      font-size: 9px; background: rgba(0,0,0,0.55);
      color: #aaa; padding: 1px 5px; border-radius: 4px;
      letter-spacing: 0.5px; font-family: monospace;
    ">Iklan</span>
  </a>
</div>
