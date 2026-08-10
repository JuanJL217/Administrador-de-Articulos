const API_URL = import.meta.env.FRONTED_URL

export async function loginRequest(data: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': API_URL,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Error al iniciar sesión');
  }
  return result;
}

export async function registerRequest(data: { name: string; email: string; password: string }) {
  const response = await fetch(`${API_URL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': API_URL,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  return result;
}