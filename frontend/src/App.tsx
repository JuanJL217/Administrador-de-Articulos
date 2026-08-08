import { Button, Card } from '@heroui/react';

function App() {
  return (
    <div className="min-h-screen bg-background">


      <nav className="border-b border-divider bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <div>
            <h1 className="text-lg font-bold">
              Administrador de Artículos
            </h1>

            <p className="text-sm text-foreground-500">
              Panel de administración
            </p>
          </div>

          <Button variant="primary">
            + Nuevo artículo
          </Button>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Título */}
        <div className="mb-10">

          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h2>

          <p className="mt-2 text-foreground-500">
            Bienvenido al panel de administración.
            Desde aquí podés gestionar tus artículos.
          </p>

        </div>


        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">

          <Card>
            <Card.Header>
              <Card.Title>
                Total de artículos
              </Card.Title>

              <Card.Description>
                Artículos registrados
              </Card.Description>
            </Card.Header>

            <Card.Content>
              <p className="text-4xl font-bold">
                24
              </p>
            </Card.Content>
          </Card>

          <Card variant="secondary">
            <Card.Header>
              <Card.Title>
                Publicados
              </Card.Title>

              <Card.Description>
                Artículos visibles
              </Card.Description>
            </Card.Header>

            <Card.Content>
              <p className="text-4xl font-bold">
                18
              </p>
            </Card.Content>
          </Card>

          <Card variant="tertiary">
            <Card.Header>
              <Card.Title>
                Borradores
              </Card.Title>

              <Card.Description>
                Pendientes de publicación
              </Card.Description>
            </Card.Header>

            <Card.Content>
              <p className="text-4xl font-bold">
                6
              </p>
            </Card.Content>
          </Card>

        </div>

        <Card>

          <Card.Header>
            <Card.Title>
              Últimos artículos
            </Card.Title>

            <Card.Description>
              Los artículos modificados recientemente.
            </Card.Description>
          </Card.Header>


          <Card.Content>

            <div className="divide-y divide-divider">

              <div className="flex items-center justify-between py-5">

                <div>
                  <h3 className="font-semibold">
                    Introducción a React
                  </h3>

                  <p className="mt-1 text-sm text-foreground-500">
                    Publicado hace 2 horas
                  </p>
                </div>

                <div className="flex gap-2">

                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                  >
                    Eliminar
                  </Button>

                </div>

              </div>


              <div className="flex items-center justify-between py-5">

                <div>
                  <h3 className="font-semibold">
                    ¿Qué es TypeScript?
                  </h3>

                  <p className="mt-1 text-sm text-foreground-500">
                    Publicado ayer
                  </p>
                </div>

                <div className="flex gap-2">

                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                  >
                    Eliminar
                  </Button>

                </div>

              </div>

              <div className="flex items-center justify-between py-5">

                <div>
                  <h3 className="font-semibold">
                    Introducción a Docker
                  </h3>

                  <p className="mt-1 text-sm text-foreground-500">
                    Publicado hace 3 días
                  </p>
                </div>

                <div className="flex gap-2">

                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                  >
                    Eliminar
                  </Button>

                </div>

              </div>

            </div>

          </Card.Content>


          <Card.Footer className="justify-end">

            <Button variant="outline">
              Ver todos los artículos
            </Button>

          </Card.Footer>

        </Card>

      </main>

    </div>
  );
}

export default App;