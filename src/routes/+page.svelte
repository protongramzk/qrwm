<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';

  let qrs = [];
  let loadingQrs = false;

  $: if ($user) fetchQrs();

  async function fetchQrs() {
    loadingQrs = true;
    const { data } = await supabase
      .from('qrs')
      .select('*')
      .eq('owner_id', $user.id)
      .order('created_at', { ascending: false });
    qrs = data || [];
    loadingQrs = false;
  }
</script>

<div class="page-container">
  <!-- Hero -->
  <section class="hero">
    <div class="badge">QR Web Maker</div>

    <h1>Satu Link.<br />Semua tentang kamu.</h1>

    <p>
      Buat halaman profil + QR Code kustom yang bisa dibagikan ke siapa saja,
      dalam hitungan detik.
    </p>

    <button class="cta" on:click={() => goto($user ? '/new' : '/login')}>
      {$user ? '➕ Buat QR Baru' : '🚀 Mulai Gratis'}
    </button>
  </section>

  <!-- User QR list -->
  {#if $user}
    <section class="qr-list-section">
      <h2>QR Kamu ({qrs.length})</h2>

      {#if loadingQrs}
        <p class="muted">Memuat...</p>
      {:else if qrs.length === 0}
        <div class="empty">
          <div class="empty-icon">📭</div>
          <p>Belum ada QR. Yuk buat yang pertama!</p>
        </div>
      {:else}
        <div class="qr-list">
          {#each qrs as qr (qr.id)}
            <div class="qr-item">
              <div>
                <div class="qr-slug">/{qr.slug}</div>
                <div class="qr-desc">{qr.description || 'Tidak ada deskripsi'}</div>
              </div>
              <div class="qr-actions">
                <button class="btn-ghost" on:click={() => goto(`/qr/${qr.slug}`)}>Lihat</button>
                <button class="btn-ghost accent" on:click={() => goto(`/edit/${qr.slug}`)}>Edit</button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  .hero {
    text-align: center;
    padding: 80px 24px 60px;
  }

  .badge {
    display: inline-block;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 999px;
    padding: 5px 16px;
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    color: #818cf8;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 20px;
    background: linear-gradient(135deg, #f1f5f9 30%, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: #64748b;
    font-size: 1.1rem;
    max-width: 460px;
    margin: 0 auto 36px;
    line-height: 1.6;
  }

  .cta {
    padding: 14px 36px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    cursor: pointer;
    box-shadow: 0 4px 24px rgba(99,102,241,0.4);
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.5);
  }

  .qr-list-section {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  h2 {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    color: #e2e8f0;
    margin-bottom: 20px;
  }

  .muted { color: #475569; }

  .empty {
    text-align: center;
    padding: 48px;
    background: rgba(255,255,255,0.03);
    border-radius: 16px;
    border: 1px dashed rgba(255,255,255,0.1);
  }

  .empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .empty p { color: #475569; margin: 0; }

  .qr-list { display: flex; flex-direction: column; gap: 12px; }

  .qr-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 16px 20px;
    gap: 12px;
  }

  .qr-slug {
    font-weight: 600;
    color: #e2e8f0;
    font-family: 'Syne', sans-serif;
  }

  .qr-desc {
    font-size: 0.8rem;
    color: #475569;
    margin-top: 2px;
  }

  .qr-actions { display: flex; gap: 8px; flex-shrink: 0; }

  .accent { color: #818cf8 !important; }
</style>
