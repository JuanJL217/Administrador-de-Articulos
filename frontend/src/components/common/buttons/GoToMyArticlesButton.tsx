import { Button } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';

interface MyArticlesButtonProps {
  onNavigate?: () => void;
  className?: string;
}

export function GoToMyArticlesButton({
  onNavigate,
  className = '',
}: MyArticlesButtonProps) {
  const navigate = useNavigate();

  const handlePress = () => {
    onNavigate?.();

    navigate({
      to: '/my-articles',
    });
  };

  return (
    <Button
      variant="primary"
      className={`font-bold ${className}`}
      onPress={handlePress}
    >
      Mis Artículos
    </Button>
  );
}