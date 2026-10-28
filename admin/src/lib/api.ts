const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  const localToken = localStorage.getItem('token');
  if (localToken) return localToken;

  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);

  return null;
}

export async function setAuthSession(token: string) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('token', token);
  } catch {}

  const isSecure = window.location.protocol === 'https:';
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${isSecure ? '; Secure' : ''}`;

  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.error('Failed to sync session cookie with server route:', err);
  }
}

export async function clearAuthSession() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('token');
    } catch {}
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  }

  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  if (!res.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
      }
    } catch {}
    
    const error = Object.assign(new Error(errorMessage), { status: res.status });
    throw error;
  }
  
  if (res.status === 204) return null;
  
  try {
    return await res.json();
  } catch {
    return null;
  }
}
