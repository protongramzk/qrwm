<script>
  import { marked } from 'marked';
  import { Facebook, Youtube, Github, Instagram, MessageCircle, Twitter, Link, ExternalLink, FileText } from 'lucide-svelte';

  export let profile = {};
  export let accentColor = '#6366f1';

  const SOCIAL_ICONS = { facebook: Facebook, x: Twitter, youtube: Youtube, discord: MessageCircle, instagram: Instagram, github: Github };
  const SOCIAL_LABELS = { facebook: 'Facebook', x: 'X (Twitter)', youtube: 'YouTube', discord: 'Discord', instagram: 'Instagram', github: 'GitHub' };

  marked.setOptions({ breaks: true, gfm: true });

  $: socialEntries = Object.entries(profile.social_media || {}).filter(([, v]) => v);
  $: mdHtml = profile.articles ? marked.parse(profile.articles) : '';
</script>

<div class="bio-card">
  {#if profile.description}
    <p class="description">{profile.description}</p>
  {/if}

  {#if socialEntries.length > 0}
    <div class="social-list">
      {#each socialEntries as [platform, url]}
        {@const IconComp = SOCIAL_ICONS[platform] || Link}
        {@const href = url.startsWith('http') ? url : `https://${url}`}
        {@const label = SOCIAL_LABELS[platform] || platform}
        <a
          {href}
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          style="--accent: {accentColor}"
        >
          <span class="icon" style="color: {accentColor}">
            <svelte:component this={IconComp} size={17} strokeWidth={1.75} />
          </span>
          <span class="label">{label}</span>
          <span class="url">{url}</span>
          <ExternalLink size={13} class="ext" />
        </a>
      {/each}
    </div>
  {/if}

  {#if profile.articles}
    <div class="articles" style="border-left-color: {accentColor}">
      <div class="articles-header" style="color: {accentColor}">
        <FileText size={12} />
        <span>Catatan</span>
      </div>
      <div class="md-body" style="--accent: {accentColor}">
        {@html mdHtml}
      </div>
    </div>
  {/if}
</div>

<style>
  .bio-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px 20px;
    width: 100%;
  }

  .description {
    color: #94a3b8;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 0 20px;
  }

  .social-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: #cbd5e1;
    text-decoration: none;
    font-size: 0.88rem;
    transition: background 0.15s, border-color 0.15s;
  }

  .social-link:hover {
    background: rgba(255,255,255,0.08);
    border-color: color-mix(in srgb, var(--accent) 27%, transparent);
  }

  .icon { display: flex; align-items: center; flex-shrink: 0; }

  .label { font-weight: 500; }

  .url {
    margin-left: auto;
    font-size: 0.75rem;
    color: #475569;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 130px;
  }

  :global(.ext) { color: #334155; flex-shrink: 0; }

  .articles {
    border-radius: 12px;
    padding: 16px 18px;
    background: rgba(0,0,0,0.2);
    border-left: 3px solid;
  }

  .articles-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.68rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
    font-family: 'DM Mono', monospace;
  }

  /* Markdown styles */
  :global(.md-body) { color: #94a3b8; font-size: 0.9rem; line-height: 1.75; }
  :global(.md-body h1), :global(.md-body h2), :global(.md-body h3) {
    font-family: 'Syne', sans-serif; font-weight: 700;
    color: #e2e8f0; margin: 1em 0 0.4em;
  }
  :global(.md-body h1) { font-size: 1.2rem; }
  :global(.md-body h2) { font-size: 1.05rem; }
  :global(.md-body h3) { font-size: 0.95rem; }
  :global(.md-body p) { margin: 0 0 0.75em; }
  :global(.md-body p:last-child) { margin-bottom: 0; }
  :global(.md-body a) { color: var(--accent, #6366f1); text-decoration: underline; word-break: break-all; }
  :global(.md-body ul), :global(.md-body ol) { padding-left: 1.25em; margin: 0 0 0.75em; }
  :global(.md-body li) { margin-bottom: 0.25em; }
  :global(.md-body code) {
    background: rgba(255,255,255,0.08); border-radius: 4px;
    padding: 1px 6px; font-size: 0.85em; font-family: 'DM Mono', monospace; color: #e2e8f0;
  }
  :global(.md-body pre) {
    background: rgba(0,0,0,0.3); border-radius: 8px;
    padding: 12px; overflow-x: auto; margin: 0 0 0.75em;
  }
  :global(.md-body pre code) { background: none; padding: 0; }
  :global(.md-body blockquote) {
    border-left: 3px solid var(--accent, #6366f1);
    margin: 0 0 0.75em; padding: 4px 12px;
    color: #64748b; font-style: italic;
  }
  :global(.md-body strong) { color: #e2e8f0; font-weight: 600; }
  :global(.md-body hr) { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 1em 0; }
  :global(.md-body img) { max-width: 100%; border-radius: 8px; }
</style>
