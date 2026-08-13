import { useEffect } from 'react';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {

  useEffect(() => {
    document.title = 'Register';
  }, []);

  return (
    <div className="flex w-full items-center justify-center min-h-[80vh]">
      <RegisterForm />
    </div>
  );
}