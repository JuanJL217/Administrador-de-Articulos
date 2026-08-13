import { Button } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';

interface LoginButtonProps {
  onNavigate?: () => void;
}

export function LoginButton({
  onNavigate,
}: LoginButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant="primary"
      className="font-bold"
      onPress={() => {
        onNavigate?.();

        navigate({
          to: '/login',
        });
      }}
    >
      Iniciar Sesión
    </Button>
  );
}