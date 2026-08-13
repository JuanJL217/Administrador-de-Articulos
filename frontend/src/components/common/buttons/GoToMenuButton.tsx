import { Button } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';

interface GoToMenuButtonProps {
  className?: string;
  onNavigate?: () => void;
}

export function GoToMenuButton({
  className = 'font-bold',
  onNavigate,
}: GoToMenuButtonProps) {
  const navigate = useNavigate();

  const handlePress = () => {
    onNavigate?.();

    navigate({
      to: '/',
    });
  };

  return (
    <Button
      variant="primary"
      className={className}
      onPress={handlePress}
    >
      Ir al Menú
    </Button>
  );
}