<script>
  import { createEventDispatcher } from 'svelte';
  import Qr from './Qr.svelte';

  export let mode = 'new';       // 'new' | 'edit'
  export let initialData = {};
  export let loading = false;

  const dispatch = createEventDispatcher();

  const SOCIAL_PLATFORMS = ['facebook', 'x', 'youtube', 'discord', 'instagram', 'github'];
  const DOT_TYPES = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];

  // Form state
  let slug        = initialData.slug        || '';
  let description = initialData.description || '';
  let articles    = initialData.articles    || '';
  let social      = { ...(initialData.social_media || {}) };

  // QR style state
  let qrColor  = initialData.qr_settings?.color   || '#6366f1';
  let qrBg     = initialData.qr_settings?.bgColor || '#ffffff';
  let dotType  = initialData.qr_settings?.type    || 'rounded';
  let logo     = initialData.qr_settings?.logo    || '';
  let logoInput = initialData.qr_settings?.logo   || '';
  let logoMode  = 'url';  // 'url' | 'upload'

  // Section open/close
  let openSlug    = true;
  let openBio     = true;
  let openSocial  = false;
  let openQr      = true;

  // File input ref
  let fileInput;

  $: qrContent = typeof window !== 'undefined'
    ? `${window.location.origin}/qr/${slug || 'preview'}`
    : `/qr/${slug || 'preview'}`;

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024) { alert('File terlalu besar. Maks 200KB!'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      logo = ev.target.result;
      logoInput = '(file diunggah)';
    };
    reader.readAsDataURL(file);
  }

  function applyLogoUrl() { logo = logoInput.trim(); }

  function removeLogo() {
    logo = '';
    logoInput = '';
    if (fileInput) fileInput.value = '';
  }

  function handleSubmit() {
    dispatch('submit', {
      slug,
      description,
      articles,
      social_media: social,
      qr_settings: { color: qrColor, bgColor: qrBg, type: dotType, logo },
    });
  }
</script>

<div class="form-wrap">

  <!-- ── QR Preview ──────────────────────────────────── -->
  <div class="preview-box">
    <div class="preview-label">Live Preview</div>
    <Qr content={qrContent} color={qrColor} bgColor={qrBg} {dotType} {logo} size={220} />
    <div class="preview-url">{qrContent}</div>
  </div>
    <div class="section">
      <button type="button" class="section-toggle" on:click={() => openQr = !openQr}>
        <span>🎨 Kustomisasi QR</span>
        <span class="chevron" class:open={openQr}>▼</span>
      </button>
      {#if openQr}
        <div class="section-body">

          <!-- Colors -->
          <div class="color-grid">
            <div>
              <label class="form-label">Warna Titik</label>
              <div class="color-row">
                <input type="color" bind:value={qrColor} class="color-pick" />
                <input class="form-input" type="text" bind:value={qrColor} style="font-family: monospace; font-size: 0.85rem;" />
              </div>
            </div>
            <div>
              <label class="form-label">Warna Latar</label>
              <div class="color-row">
                <input type="color" bind:value={qrBg} class="color-pick" />
                <input class="form-input" type="text" bind:value={qrBg} style="font-family: monospace; font-size: 0.85rem;" />
              </div>
            </div>
          </div>

          <!-- Dot type -->
          <div>
            <label class="form-label">Tipe Titik</label>
            <div class="dot-types">
              {#each DOT_TYPES as t}
                <button
                  type="button"
                  class="dot-btn"
                  class:active={dotType === t}
                  style="--accent: {qrColor}"
                  on:click={() => dotType = t}
                >{t}</button>
              {/each}
            </div>
          </div>

          <!-- Logo -->
          <div>
            <label class="form-label">Logo di Tengah QR</label>
            <div class="mode-tabs">
              <button type="button" class="mode-btn" class:active={logoMode === 'url'} style="--accent: {qrColor}" on:click={() => logoMode = 'url'}>🔗 URL</button>
              <button type="button" class="mode-btn" class:active={logoMode === 'upload'} style="--accent: {qrColor}" on:click={() => logoMode = 'upload'}>📁 Upload</button>
            </div>

            {#if logoMode === 'url'}
              <div class="url-row">
                <input class="form-input" type="text" bind:value={logoInput} placeholder="https://example.com/logo.png" />
                <button type="button" class="apply-btn" style="--accent: {qrColor}" on:click={applyLogoUrl}>Terapkan</button>
              </div>
            {:else}
              <div class="upload-zone" on:click={() => fileInput.click()} on:keypress={() => fileInput.click()} role="button" tabindex="0">
                {logo && logoMode === 'upload' ? '✅ File berhasil diunggah' : '📂 Klik untuk pilih gambar (maks. 200KB)'}
                <input bind:this={fileInput} type="file" accept="image/*" on:change={handleFileUpload} style="display: none;" />
              </div>
            {/if}

            {#if logo}
              <div class="logo-preview">
                <img src={logo} alt="logo" on:error={removeLogo} />
                <span class="logo-active">Logo aktif</span>
                <button type="button" class="remove-btn" on:click={removeLogo}>Hapus</button>
              </div>
            {/if}

            <p class="hint">Gunakan PNG/SVG dengan latar bening. Error correction otomatis H.</p>
          </div>

        </div>
      {/if}
    </div>
  <!-- ── Form ────────────────────────────────────────── -->
  <form on:submit|preventDefault={handleSubmit}>

    <!-- Slug -->
    <div class="section">
      <button type="button" class="section-toggle" on:click={() => openSlug = !openSlug}>
        <span>🔗 URL Slug</span>
        <span class="chevron" class:open={openSlug}>▼</span>
      </button>
      {#if openSlug}
        <div class="section-body">
          <div class="slug-row">
            <span class="input-prefix">/qr/</span>
            <input
              class="form-input"
              type="text"
              bind:value={slug}
              on:input={() => slug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '')}
              placeholder="username-kamu"
              required
              disabled={mode === 'edit'}
              style="border-radius: 0 8px 8px 0; border-left: none;"
            />
          </div>
          {#if mode === 'edit'}
            <p class="hint">Slug tidak bisa diubah setelah dibuat.</p>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Bio & Konten -->
    <div class="section">
      <button type="button" class="section-toggle" on:click={() => openBio = !openBio}>
        <span>✍️ Bio & Konten</span>
        <span class="chevron" class:open={openBio}>▼</span>
      </button>
      {#if openBio}
        <div class="section-body">
          <div>
            <label class="form-label">Deskripsi Singkat</label>
            <input class="form-input" type="text" bind:value={description} placeholder="Satu kalimat tentang kamu..." />
          </div>
          <div>
            <div class="label-row">
              <label class="form-label">Catatan / Artikel</label>
              <span class="counter" class:warn={articles.length > 1900}>{articles.length}/2000</span>
            </div>
            <textarea class="form-input" bind:value={articles} maxlength="2000" rows="4" placeholder="Tulis sesuatu..."></textarea>
          </div>
        </div>
      {/if}
    </div>

    <!-- Social Media -->
    <div class="section">
      <button type="button" class="section-toggle" on:click={() => openSocial = !openSocial}>
        <span>🌐 Social Media</span>
        <span class="chevron" class:open={openSocial}>▼</span>
      </button>
      {#if openSocial}
        <div class="section-body">
          {#each SOCIAL_PLATFORMS as platform}
            <div class="social-row">
              <span class="platform-name">{platform === 'x' ? 'X / Twitter' : platform}</span>
              <input
                class="form-input"
                type="text"
                bind:value={social[platform]}
                placeholder="URL {platform}"
              />
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- QR Kustomisasi -->


    <!-- Submit -->
    <button type="submit" class="submit-btn" disabled={loading}>
      {loading ? 'Menyimpan...' : mode === 'new' ? '🚀 Buat QR Sekarang' : '💾 Simpan Perubahan'}
    </button>

  </form>
</div>

<style>
  .form-wrap { display: flex; flex-direction: column; gap: 24px; }

  /* Preview */
  .preview-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 28px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
  }

  .preview-label {
    font-size: 0.7rem;
    color: #475569;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .preview-url {
    font-size: 0.72rem;
    color: #334155;
    text-align: center;
    word-break: break-all;
    max-width: 280px;
  }

  /* Sections */
  form { display: flex; flex-direction: column; gap: 16px; }

  .section {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    overflow: hidden;
  }

  .section-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: none;
    border: none;
    cursor: pointer;
    color: #e2e8f0;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    text-align: left;
  }

  .chevron { color: #475569; font-size: 0.8rem; transition: transform 0.2s; }
  .chevron.open { transform: rotate(180deg); }

  .section-body {
    padding: 4px 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .slug-row { display: flex; align-items: center; }

  .hint { font-size: 0.75rem; color: #475569; }

  .label-row { display: flex; justify-content: space-between; align-items: baseline; }
  .counter { font-size: 0.72rem; color: #475569; }
  .counter.warn { color: #f87171; }

  .social-row { display: flex; align-items: center; gap: 10px; }
  .platform-name { width: 80px; font-size: 0.78rem; color: #64748b; text-transform: capitalize; flex-shrink: 0; }

  .color-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .color-row { display: flex; gap: 8px; align-items: center; }
  .color-pick { width: 40px; height: 36px; border: none; background: none; cursor: pointer; padding: 0; flex-shrink: 0; border-radius: 6px; }

  .dot-types { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .dot-btn {
    padding: 6px 12px;
    border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.03);
    color: #64748b;
    font-size: 0.78rem;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    transition: all 0.15s;
  }
  .dot-btn.active {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent);
  }

  .mode-tabs { display: flex; gap: 4px; margin-bottom: 10px; margin-top: 6px; }
  .mode-btn {
    padding: 5px 14px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: #64748b;
    font-size: 0.78rem;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    transition: all 0.15s;
  }
  .mode-btn.active {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent);
  }

  .url-row { display: flex; gap: 8px; }
  .apply-btn {
    padding: 0 14px;
    border-radius: 8px;
    border: 1px solid var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent);
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    font-family: 'DM Mono', monospace;
  }

  .upload-zone {
    padding: 18px;
    border-radius: 10px;
    border: 2px dashed rgba(255,255,255,0.12);
    text-align: center;
    cursor: pointer;
    color: #475569;
    font-size: 0.85rem;
  }

  .logo-preview {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.04);
    border-radius: 8px;
    margin-top: 8px;
  }
  .logo-preview img {
    width: 36px; height: 36px;
    object-fit: contain;
    border-radius: 6px;
    background: #fff;
  }
  .logo-active { font-size: 0.8rem; color: #64748b; flex: 1; }
  .remove-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(239,68,68,0.3);
    background: rgba(239,68,68,0.1);
    color: #f87171;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .submit-btn {
    padding: 15px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1rem;
    cursor: pointer;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    transition: opacity 0.2s;
  }
  .submit-btn:disabled {
    background: #1e293b;
    color: #475569;
    box-shadow: none;
    cursor: not-allowed;
  }
</style>
