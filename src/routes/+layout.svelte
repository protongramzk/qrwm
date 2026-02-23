<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, authLoading, initAuth, signOut } from '$lib/auth';

  onMount(() => {
    const unsub = initAuth();
    return unsub;
  });

  async function handleSignOut() {
    await signOut();
    goto('/');
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap"
  />
</svelte:head>

<!-- Navbar -->
<nav>
  <a href="/" class="brand">QR<span>WM</span></a>

  <div class="nav-actions">
    {#if $authLoading}
      <!-- placeholder -->
    {:else if $user}
      <a href="/new" class="btn-new">+ Baru</a>
      <button class="btn-ghost" on:click={handleSignOut}>Keluar</button>
    {:else}
      <a href="/login" class="btn-primary">Masuk</a>
    {/if}
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  /* ── Reset & Base ─────────────────────────────────────── */
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(html) { scroll-behavior: smooth; }

  :global(body) {
    background: #090b11;
    color: #cbd5e1;
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
  }

  :global(body::before) {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 20% 10%, rgba(99,102,241,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 80% 90%, rgba(139,92,246,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  :global(#svelte) { position: relative; z-index: 1; }

  /* ── Shared form styles ───────────────────────────────── */
  :global(.form-label) {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 6px;
    font-family: 'DM Mono', monospace;
  }

  :global(.form-input) {
    width: 100%;
    padding: 10px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    transition: border-color 0.15s;
    outline: none;
  }

  :global(.form-input:focus) {
    border-color: rgba(99,102,241,0.5);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  :global(.form-input::placeholder) { color: #334155; }
  :global(textarea.form-input) { resize: vertical; }
  :global(select.form-input) { cursor: pointer; }

  :global(.input-prefix) {
    padding: 10px 10px 10px 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px 0 0 8px;
    color: #475569;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }

  :global(.btn-ghost) {
    padding: 7px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #94a3b8;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  :global(.btn-ghost:hover) {
    background: rgba(255,255,255,0.06);
    color: #e2e8f0;
    border-color: rgba(255,255,255,0.15);
  }

  :global(.page-container) { min-height: calc(100vh - 57px); }

  :global(::-webkit-scrollbar) { width: 6px; }
  :global(::-webkit-scrollbar-track) { background: transparent; }
  :global(::-webkit-scrollbar-thumb) {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  /* ── Navbar ───────────────────────────────────────────── */
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    background: rgba(9,11,17,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #f1f5f9;
    text-decoration: none;
    letter-spacing: -0.5px;
  }

  .brand :global(span) { color: #818cf8; }

  .nav-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .btn-new {
    padding: 7px 16px;
    border-radius: 8px;
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
    text-decoration: none;
    font-size: 0.85rem;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
  }

  .btn-primary {
    padding: 7px 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    text-decoration: none;
    font-size: 0.85rem;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
  }

  main {
    position: relative;
    z-index: 1;
  }
</style>
