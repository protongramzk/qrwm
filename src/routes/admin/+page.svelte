<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import ImpAds from '$lib/components/ImpAds.svelte';

  const ADMIN_USERNAMES = ['gunturhidayat', 'admin'];

  let authorized = false;
  let checking = true;
  let ads = [];
  let loadingAds = true;
  let saving = false;
  let msg = '';

  let form = { image_url: '', href: '', size: 'md', is_active: true };

  onMount(async () => {
    if (!$user) { goto('/login'); return; }

    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', $user.id)
      .single();

    if (data && ADMIN_USERNAMES.includes(data.username)) {
      authorized = true;
      fetchAds();
    } else {
      goto('/');
    }
    checking = false;
  });

  async function fetchAds() {
    const { data } = await supabase
      .from('ads')
      .select('*')
      .order('is_active', { ascending: false });
    ads = data || [];
    loadingAds = false;
  }

  async function handleAddAd() {
    saving = true;
    const { data, error } = await supabase.from('ads').insert(form).select().single();
    if (!error) {
      ads = [data, ...ads];
      form = { image_url: '', href: '', size: 'md', is_active: true };
      msg = '✅ Iklan ditambahkan!';
    } else {
      msg = '❌ ' + error.message;
    }
    saving = false;
    setTimeout(() => msg = '', 3000);
  }

  async function toggleAd(ad) {
    const { data } = await supabase
      .from('ads')
      .update({ is_active: !ad.is_active })
      .eq('id', ad.id)
      .select()
      .single();
    if (data) ads = ads.map(a => a.id === ad.id ? data : a);
  }

  async function deleteAd(id) {
    if (!confirm('Hapus iklan ini?')) return;
    await supabase.from('ads').delete().eq('id', id);
    ads = ads.filter(a => a.id !== id);
  }
</script>

{#if checking}
  <div class="center"><span class="muted">Memeriksa akses...</span></div>

{:else if authorized}
  <div class="page-container" style="padding: 40px 24px 80px; max-width: 800px; margin: 0 auto;">

    <div class="page-header">
      <span class="admin-badge">Admin Panel</span>
      <h1>Manajemen Iklan</h1>
      <p>Atur iklan yang tampil di halaman publik.</p>
    </div>

    <!-- Add new ad -->
    <div class="card">
      <h2>➕ Tambah Iklan Baru</h2>
      <form on:submit|preventDefault={handleAddAd}>
        <div>
          <label class="form-label">URL Gambar</label>
          <input class="form-input" type="url" bind:value={form.image_url} placeholder="https://..." required />
        </div>
        <div>
          <label class="form-label">Link Tujuan (href)</label>
          <input class="form-input" type="url" bind:value={form.href} placeholder="https://..." required />
        </div>
        <div class="row-2">
          <div>
            <label class="form-label">Ukuran</label>
            <select class="form-input" bind:value={form.size}>
              <option value="sm">Small (320×80)</option>
              <option value="md">Medium (480×120)</option>
              <option value="lg">Large (728×90)</option>
            </select>
          </div>
          <div>
            <label class="form-label">Status</label>
            <select class="form-input" bind:value={form.is_active}>
              <option value={true}>Aktif</option>
              <option value={false}>Nonaktif</option>
            </select>
          </div>
        </div>

        {#if form.image_url}
          <div>
            <div class="form-label" style="margin-bottom: 8px">Preview</div>
            <ImpAds image={form.image_url} href={form.href || '#'} size={form.size} />
          </div>
        {/if}

        <button type="submit" class="btn-save" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Iklan'}
        </button>

        {#if msg}
          <div class:msg-ok={msg.startsWith('✅')} class:msg-err={!msg.startsWith('✅')} class="msg">
            {msg}
          </div>
        {/if}
      </form>
    </div>

    <!-- Ads list -->
    <h2 class="list-title">Daftar Iklan ({ads.length})</h2>

    {#if loadingAds}
      <p class="muted">Memuat iklan...</p>
    {/if}

    <div class="ads-list">
      {#each ads as ad (ad.id)}
        <div class="ad-item" class:inactive={!ad.is_active}>
          <div class="ad-row">
            <div class="ad-info">
              <div class="ad-meta">
                <span class="status-badge" class:active={ad.is_active}>
                  {ad.is_active ? '● Aktif' : '○ Nonaktif'}
                </span>
                <span class="size-tag">{ad.size}</span>
              </div>
              <div class="ad-href">{ad.href}</div>
            </div>
            <div class="ad-btns">
              <button class="btn-ghost" on:click={() => toggleAd(ad)}>
                {ad.is_active ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button class="btn-ghost danger" on:click={() => deleteAd(ad.id)}>Hapus</button>
            </div>
          </div>
          <div style="margin-top: 12px">
            <ImpAds image={ad.image_url} href={ad.href} size={ad.size} />
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  .muted { color: #475569; }

  .page-header { margin-bottom: 36px; }

  .admin-badge {
    display: inline-block;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 999px;
    padding: 4px 14px;
    font-size: 0.7rem;
    letter-spacing: 1.5px;
    color: #fca5a5;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    color: #f1f5f9;
    margin: 0 0 6px;
  }

  p { color: #64748b; }

  .card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
  }

  h2 {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #e2e8f0;
    margin: 0 0 20px;
  }

  form { display: flex; flex-direction: column; gap: 14px; }

  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .btn-save {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    cursor: pointer;
    align-self: flex-start;
    transition: opacity 0.2s;
  }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

  .msg { font-size: 0.9rem; }
  .msg-ok { color: #4ade80; }
  .msg-err { color: #fca5a5; }

  .list-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #e2e8f0;
    margin-bottom: 16px;
  }

  .ads-list { display: flex; flex-direction: column; gap: 12px; }

  .ad-item {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(74,222,128,0.2);
    border-radius: 12px;
    padding: 16px;
    transition: opacity 0.2s;
  }
  .ad-item.inactive {
    opacity: 0.5;
    border-color: rgba(255,255,255,0.06);
  }

  .ad-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .ad-info { flex: 1; min-width: 0; }

  .ad-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }

  .status-badge {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    color: #64748b;
  }
  .status-badge.active { background: rgba(74,222,128,0.15); color: #4ade80; }

  .size-tag { font-size: 0.75rem; color: #64748b; text-transform: uppercase; }

  .ad-href {
    font-size: 0.8rem;
    color: #94a3b8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ad-btns { display: flex; gap: 8px; flex-shrink: 0; }

  .danger { color: #f87171 !important; }
</style>
