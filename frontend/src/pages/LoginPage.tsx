import { useEffect } from 'react';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  useEffect(() => {
    document.title = 'Login';
  }, []);

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}