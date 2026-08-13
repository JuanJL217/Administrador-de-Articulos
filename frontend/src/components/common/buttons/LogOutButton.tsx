import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@heroui/react';

import { logoutRequest } from '../../../service/account/logout';

interface LogoutButtonProps {
  onLogout?: () => void;
  className?: string;
}

export function LogoutButton({
  onLogout,
  className = '',
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,

    onSuccess: async () => {
      queryClient.setQueryData(
        ['auth-session'],
        null
      );

      queryClient.removeQueries({
        queryKey: ['my-articles'],
      });

      onLogout?.();

      navigate({
        to: '/',
        replace: true,
      });
    },

    onError: (error) => {
      console.error(
        'Error al intentar cerrar sesión:',
        error
      );
    },
  });

  return (
    <Button
      variant="danger"
      className={`font-bold ${className}`}
      isPending={logoutMutation.isPending}
      onPress={() => logoutMutation.mutate()}
    >
      Cerrar Sesión
    </Button>
  );
}