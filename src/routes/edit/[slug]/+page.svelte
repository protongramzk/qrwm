<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import QrForm from '$lib/components/QrForm.svelte';

  const slug = $page.params.slug;

  let qrData = null;
  let loading = true;
  let saving = false;
  let error = '';

  onMount(async () => {
    if (!$user) { goto('/login'); return; }

    const { data, error: fetchError } = await supabase
      .from('qrs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError || !data) { goto('/'); return; }

    if (data.owner_id !== $user.id) {
      goto(`/qr/${slug}`);
      return;
    }

    qrData = data;
    loading = false;
  });

  async function handleSubmit(e) {
    const formData = e.detail;
    saving = true;
    error = '';

    const { error: updateError } = await supabase
      .from('qrs')
      .update({
        description: formData.description,
        articles: formData.articles,
        social_media: formData.social_media,
        qr_settings: formData.qr_settings,
      })
      .eq('slug', slug)
      .eq('owner_id', $user.id);

    if (updateError) {
      error = updateError.message;
      saving = false;
      return;
    }

    goto(`/qr/${slug}`);
  }
</script>

{#if loading}
  <div class="center"><span class="muted">Memuat data...</span></div>
{:else}
  <div class="page-container" style="padding: 40px 24px 80px; max-width: 900px; margin: 0 auto;">
    <div class="header">
      <button class="btn-ghost" on:click={() => goto(`/qr/${slug}`)}>← Kembali ke Profil</button>
      <h1>Edit QR</h1>
      <p>qrwm.app/qr/<strong>{slug}</strong></p>
    </div>

    {#if error}
      <div class="alert-error">⚠️ {error}</div>
    {/if}

    <QrForm
      mode="edit"
      initialData={{ ...qrData, qr_settings: qrData?.qr_settings || {} }}
      loading={saving}
      on:submit={handleSubmit}
    />
  </div>
{/if}

<style>
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }

  .muted { color: #475569; }

  .header { margin-bottom: 32px; }
  .header button { margin-bottom: 16px; }

  h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    color: #f1f5f9;
    margin: 0 0 6px;
  }

  p { color: #64748b; }
  strong { color: #818cf8; }

  .alert-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    padding: 12px 16px;
    color: #fca5a5;
    margin-bottom: 24px;
    font-size: 0.9rem;
  }
</style>
