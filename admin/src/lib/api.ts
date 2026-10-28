const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });
  
  if (!res.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await res.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (e) {}
    
    throw new Error(errorMessage);
  }
  
  if (res.status === 204) return null;
  
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}
