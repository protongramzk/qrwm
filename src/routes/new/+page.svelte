<script>
  import { goto } from '$app/navigation';
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import { ArrowLeft, AlertCircle } from 'lucide-svelte';
  import QrForm from '$lib/components/QrForm.svelte';

  let loading = false;
  let error = '';

  // Guard: redirect if not logged in
  $: if ($user === null) goto('/login');

  async function handleSubmit(e) {
    const formData = e.detail;
    loading = true;
    error = '';

    const { data: existing } = await supabase
      .from('qrs')
      .select('id')
      .eq('slug', formData.slug)
      .single();

    if (existing) {
      error = 'Slug sudah dipakai. Pilih yang lain ya!';
      loading = false;
      return;
    }

    const { error: insertError } = await supabase.from('qrs').insert({
      owner_id: $user.id,
      slug: formData.slug,
      description: formData.description,
      articles: formData.articles,
      social_media: formData.social_media,
      qr_settings: formData.qr_settings,
    });

    if (insertError) {
      error = insertError.message;
      loading = false;
      return;
    }

    goto(`/qr/${formData.slug}`);
  }
</script>

<div class="page-container" style="padding: 40px 24px 80px; max-width: 900px; margin: 0 auto;">
  <div class="header">
    <button class="btn-ghost" on:click={() => goto('/')}><ArrowLeft size={16} style="vertical-align: middle; margin-right: 4px;" /> Kembali</button>
    <h1>Buat QR Baru</h1>
    <p>Isi info kamu, lalu klik simpan.</p>
  </div>

  {#if error}
    <div class="alert-error"><AlertCircle size={16} style="vertical-align: middle; margin-right: 4px;" /> {error}</div>
  {/if}

  <QrForm mode="new" {loading} on:submit={handleSubmit} />
</div>

<style>
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
