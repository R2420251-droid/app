type AnyObj = Record<string, any>;

// Token management
function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

function clearToken(): void {
  localStorage.removeItem('auth_token');
}

async function request(method: string, path: string, body?: AnyObj, requireAuth: boolean = false) {
  const opts: RequestInit = { method, headers: {} };
  
  // Add authentication token if available or required
  const token = getToken();
  if (token) {
    opts.headers = { ...opts.headers, 'Authorization': `Bearer ${token}` };
  }
  
  if (body) {
    opts.headers = { ...opts.headers, 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(body);
  }
  
  const res = await fetch(`/api/${path}`, opts);
  if (!res.ok) {
    // If unauthorized, clear token
    if (res.status === 401) {
      clearToken();
    }
    // Try to parse error as JSON first, fallback to text
    const contentType = res.headers.get('content-type') || '';
    let errorMessage = res.statusText;
    try {
      const text = await res.text();
      if (contentType.includes('application/json')) {
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || text;
        } catch (e) {
          errorMessage = text || res.statusText;
        }
      } else {
        errorMessage = text || res.statusText;
      }
    } catch (e) {
      errorMessage = res.statusText;
    }
    throw new Error(errorMessage);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  get: (p: string, requireAuth: boolean = false) => request('GET', p, undefined, requireAuth),
  post: (p: string, body?: AnyObj, requireAuth: boolean = false) => request('POST', p, body, requireAuth),
  put: (p: string, body?: AnyObj, requireAuth: boolean = false) => request('PUT', p, body, requireAuth),
  delete: (p: string, requireAuth: boolean = false) => request('DELETE', p, undefined, requireAuth),

  login: async (identifier: string, password: string) => {
    const result = await request('POST', 'auth/login', { identifier, password });
    if (result.token) {
      setToken(result.token);
    }
    return result;
  },
  register: (name: string, email: string, username: string, password: string) => request('POST', 'auth/register', { name, email, username, password }),
  forgotPassword: (email: string) => request('POST', 'auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => request('PUT', `auth/reset-password/${token}`, { password }),
  logout: () => {
    clearToken();
  },

  push: (data: any) => request('POST', 'sync/push', data, true),
  pull: () => request('GET', 'sync/pull', undefined, true),

  // Convenience endpoints
  fetchAllData: async () => {
    const [services, products, courses, bookings, enrollments, gallery, settings, orders, users] = await Promise.all([
      request('GET', 'services'),
      request('GET', 'products'),
      request('GET', 'courses'),
      request('GET', 'bookings'),
      request('GET', 'enrollments'),
      request('GET', 'gallery'),
      request('GET', 'settings'),
      request('GET', 'orders').catch(() => []), // optional - requires auth
      request('GET', 'users').catch(() => []) // optional
    ]);
    return { services, products, courses, bookings, enrollments, gallery, settings, orders, users };
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const headers: HeadersInit = {};
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 401) {
        clearToken();
      }
      throw new Error(text || res.statusText);
    }
    return res.json();
  }
};
