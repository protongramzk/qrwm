<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import BioCard from '$lib/components/BioCard.svelte';
  import Qr from '$lib/components/Qr.svelte';
  import ImpAds from '$lib/components/ImpAds.svelte';
  import Avatar from '$lib/components/Avatar.svelte';

  const slug = $page.params.slug;

  let qrData = null;
  let profile = null;
  let ads = [];
  let loading = true;
  let notFound = false;

  onMount(async () => {
    const { data: qr, error } = await supabase
      .from('qrs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !qr) { notFound = true; loading = false; return; }

    qrData = qr;

    const [{ data: prof }, { data: adsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', qr.owner_id).single(),
      supabase.from('ads').select('*').eq('is_active', true),
    ]);

    profile = prof;
    ads = adsData || [];
    loading = false;
  });

  $: isOwner = $user?.id === qrData?.owner_id;
  $: accentColor = qrData?.qr_settings?.color || '#6366f1';
  $: qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/qr/${slug}` : `/qr/${slug}`;
  $: mergedProfile = {
    username: profile?.username || slug,
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url,
    description: qrData?.description,
    social_media: qrData?.social_media || {},
    articles: qrData?.articles,
  };
</script>

{#if loading}
  <div class="center">
    <span class="muted">Memuat profil...</span>
  </div>

{:else if notFound}
  <div class="not-found">
    <div class="not-found-icon">🔍</div>
    <h2>Profil tidak ditemukan</h2>
    <p>Slug /qr/{slug} belum ada.</p>
    <button class="btn-ghost" on:click={() => goto('/')}>← Kembali</button>
  </div>

{:else}
  <div class="view-page">
    <!-- Top banner ad -->
    {#if ads[0]}
      <div class="ad-top">
        <ImpAds image={ads[0].image_url} href={ads[0].href} size={ads[0].size || 'lg'} />
      </div>
    {/if}

    <div class="content">
      <!-- Profile header -->
      <div class="profile-header">
        <Avatar
          src={profile?.avatar_url}
          username={profile?.username || slug}
          size={88}
          color={accentColor}
        />
        <h1>{profile?.full_name || profile?.username || slug}</h1>
        <div class="username">@{profile?.username || slug}</div>
      </div>

      <!-- BioCard -->
      <BioCard profile={mergedProfile} {accentColor} />

      <!-- QR Code -->
      <div class="qr-section">
        <div class="qr-label">Scan QR Code</div>
        <Qr
          content={qrUrl}
          color={qrData.qr_settings?.color || '#6366f1'}
          bgColor={qrData.qr_settings?.bgColor || '#ffffff'}
          dotType={qrData.qr_settings?.type || 'rounded'}
          logo={qrData.qr_settings?.logo || ''}
          size={220}
        />
        <div class="qr-url">{qrUrl}</div>
      </div>

      <!-- Mid ad -->
      {#if ads[1]}
        <div class="ad-mid">
          <ImpAds image={ads[1].image_url} href={ads[1].href} size={ads[1].size || 'md'} />
        </div>
      {/if}
    </div>

    <!-- Floating edit button (owner only) -->
    {#if isOwner}
      <button class="fab" on:click={() => goto(`/edit/${slug}`)}>
        ✏️ Edit Profil
      </button>
    {/if}
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

  .not-found {
    text-align: center;
    padding: 80px 24px;
  }

  .not-found-icon { font-size: 4rem; margin-bottom: 16px; }

  .not-found h2 {
    font-family: 'Syne', sans-serif;
    color: #e2e8f0;
    margin-bottom: 8px;
  }

  .not-found p { color: #64748b; margin-bottom: 16px; }

  .view-page {
    min-height: 100vh;
    padding-bottom: 100px;
  }

  .ad-top { padding-top: 16px; }
  .ad-mid { margin-top: 24px; }

  .content {
    max-width: 520px;
    margin: 0 auto;
    padding: 32px 24px 0;
  }

  .profile-header {
    text-align: center;
    margin-bottom: 28px;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.6rem;
    color: #f1f5f9;
    margin: 16px 0 4px;
  }

  .username {
    color: #64748b;
    font-size: 0.85rem;
  }

  .qr-section {
    text-align: center;
    margin-top: 32px;
    padding: 28px 24px;
    background: rgba(255,255,255,0.03);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .qr-label {
    font-size: 0.7rem;
    color: #64748b;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .qr-url {
    margin-top: 14px;
    font-size: 0.75rem;
    color: #475569;
    word-break: break-all;
  }

  .fab {
    position: fixed;
    bottom: 28px;
    right: 28px;
    padding: 13px 22px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(99,102,241,0.5);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 999;
    transition: transform 0.15s;
  }

  .fab:hover { transform: scale(1.05); }
</style>
