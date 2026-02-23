import { writable } from 'svelte/store';
import { supabase } from './supabase';

// ── Stores ────────────────────────────────────────────────────
export const user = writable(null);
export const authLoading = writable(true);

// ── Init: listen to auth state changes ───────────────────────
export function initAuth() {
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.set(session?.user ?? null);
    authLoading.set(false);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    user.set(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}

// ── Auth actions ──────────────────────────────────────────────
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (data.user && !error) {
    // Buat row di profiles setelah register
    await supabase.from('profiles').insert({
      id: data.user.id,
      username,
    }).select().single();
  }

  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
  user.set(null);
}
