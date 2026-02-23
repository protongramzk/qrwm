<script>
  import { goto } from '$app/navigation';
  import { signIn, signUp } from '$lib/auth';

  let tab = 'login'; // 'login' | 'register'
  let email = '';
  let password = '';
  let username = '';
  let loading = false;
  let error = '';
  let success = '';

  async function handleSubmit() {
    loading = true;
    error = '';
    success = '';

    if (tab === 'login') {
      const { error: e } = await signIn(email, password);
      if (e) error = e.message;
      else goto('/');
    } else {
      const { error: e } = await signUp(email, password, username);
      if (e) error = e.message;
      else success = 'Cek email kamu untuk konfirmasi!';
    }

    loading = false;
  }

  function switchTab(t) {
    tab = t;
    error = '';
    success = '';
  }
</script>

<div class="page">
  <div class="card">
    <h1>QRWM</h1>
    <p class="sub">QR Web Maker</p>

    <!-- Tabs -->
    <div class="tabs">
      <button class:active={tab === 'login'} on:click={() => switchTab('login')}>Masuk</button>
      <button class:active={tab === 'register'} on:click={() => switchTab('register')}>Daftar</button>
    </div>

    <form on:submit|preventDefault={handleSubmit}>
      {#if tab === 'register'}
        <div>
          <label class="form-label">Username</label>
          <input
            class="form-input"
            type="text"
            bind:value={username}
            on:input={() => username = username.toLowerCase()}
            placeholder="username_kamu"
            required
          />
        </div>
      {/if}

      <div>
        <label class="form-label" for="email">Email</label>
        <input id="email" class="form-input" type="email" bind:value={email} placeholder="kamu@email.com" required />
      </div>

      <div>
        <label class="form-label" for="password">Password</label>
        <input id="password" class="form-input" type="password" bind:value={password} placeholder="••••••••" required />
      </div>

      {#if error}
        <div class="alert error">⚠️ {error}</div>
      {/if}
      {#if success}
        <div class="alert success">✅ {success}</div>
      {/if}

      <button type="submit" class="submit" disabled={loading}>
        {loading ? 'Memproses...' : tab === 'login' ? 'Masuk' : 'Buat Akun'}
      </button>
    </form>
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .card {
    width: 100%;
    max-width: 400px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 36px 32px;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.75rem;
    color: #f1f5f9;
    margin-bottom: 6px;
  }

  .sub { color: #64748b; margin-bottom: 28px; font-size: 0.9rem; }

  .tabs {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 24px;
  }

  .tabs button {
    flex: 1;
    padding: 8px;
    border-radius: 7px;
    border: none;
    background: transparent;
    color: #64748b;
    font-family: 'Syne', sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .tabs button.active {
    background: rgba(99,102,241,0.3);
    color: #a5b4fc;
    font-weight: 700;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .alert {
    font-size: 0.85rem;
    padding: 10px 14px;
    border-radius: 8px;
  }

  .error { color: #fca5a5; background: rgba(239,68,68,0.1); }
  .success { color: #4ade80; background: rgba(74,222,128,0.1); }

  .submit {
    margin-top: 4px;
    padding: 13px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .submit:disabled {
    background: #334155;
    cursor: not-allowed;
  }
</style>
