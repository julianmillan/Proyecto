// API base URL
export const API_URL = (import.meta as any).env.PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper para manejar requests autenticados
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge custom headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

// Guardar token
export function saveToken(token: string) {
  localStorage.setItem('token', token);
}

// Obtener token
export function getToken() {
  return localStorage.getItem('token');
}

// Eliminar token
export function removeToken() {
  localStorage.removeItem('token');
}

// Verificar si está autenticado
export function isAuthenticated() {
  return !!getToken();
}
