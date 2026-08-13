# Administrador de Artículos

Aplicación web para la gestión y exploración de artículos, desarrollada con **React + TypeScript** en el frontend y **Hono + TypeScript + MongoDB** en el backend.

El proyecto incluye autenticación de usuarios, creación y administración de artículos, búsqueda y filtrado, paginación y estadísticas de autores.

La aplicación está preparada para ejecutarse mediante **Docker Compose**, levantando automáticamente el frontend, backend y MongoDB.

---

# Índice

- [Funcionalidades](#funcionalidades)
- [Arquitectura general](#arquitectura-general)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura del Backend](#arquitectura-del-backend)
- [Capas del Backend](#capas-del-backend)
  - [Domain](#domain)
  - [Application](#application)
  - [Infrastructure](#infrastructure)
- [Inyección de dependencias](#inyección-de-dependencias)
- [Backend HTTP](#backend-http)
- [CORS](#cors)
- [Autenticación](#autenticación)
- [Protección de rutas](#protección-de-rutas)
- [Frontend](#frontend)
- [Parámetros de búsqueda](#parámetros-de-búsqueda)
- [Manejo de datos](#manejo-de-datos)
- [Debounce de filtros](#debounce-de-filtros)
- [Paginación](#paginación)
- [Validación](#validación)
- [Formularios](#formularios)
- [Cache después de crear un artículo](#cache-después-de-crear-un-artículo)
- [Variables de entorno](#variables-de-entorno)
  - [Variables del Backend](#variables-del-backend)
  - [PORT](#port)
  - [MONGO_URI](#mongo_uri)
  - [DB_NAME](#db_name)
  - [BETTER_AUTH_URL](#better_auth_url)
  - [BETTER_AUTH_SECRET](#better_auth_secret)
  - [FRONTED_URL](#fronted_url)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Ejecución con Docker Compose](#ejecución-con-docker-compose)
- [Agregación de datos: User y Article](#agregación-de-datos-user-y-article)
- [Servicios y puertos](#servicios-y-puertos)
- [Decisiones técnicas](#decisiones-técnicas)
  - [Separación Frontend / Backend](#separación-frontend--backend)
  - [Hono](#hono)
  - [MongoDB](#mongodb)
  - [TanStack Query](#tanstack-query)
  - [TanStack Router](#tanstack-router)
  - [Debounce](#debounce)
  - [CORS y cookies](#cors-y-cookies)
  - [URL como fuente del estado de búsqueda](#url-como-fuente-del-estado-de-búsqueda)
  - [Paginación del lado del servidor](#paginación-del-lado-del-servidor)
  - [Persistencia](#persistencia)
- [Flujo general de una petición](#flujo-general-de-una-petición)
- [Desarrollo](#desarrollo)

---

# Funcionalidades

* Registro de usuarios.
* Inicio de sesión.
* Cierre de sesión.
* Protección de rutas privadas.
* Creación de artículos.
* Edición de artículos.
* Eliminación de artículos.
* Visualización de artículos.
* Búsqueda por autor.
* Búsqueda por título.
* Búsqueda por contenido.
* Paginación.
* Estadísticas de autores.
* Menú responsive para dispositivos móviles.
* Persistencia de sesión mediante cookies.
* Persistencia de datos mediante MongoDB.
* Cache de datos mediante TanStack Query.
* Debounce de los filtros para evitar peticiones innecesarias.

---

# Arquitectura general

El proyecto está dividido en tres servicios principales:

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ React + TypeScript  │
                    │ HeroUI + Tailwind   │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               │ Cookies
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Hono + TypeScript   │
                    │                     │
                    │ /api/auth           │
                    │ /api/users          │
                    │ /api/articles       │
                    └──────────┬──────────┘
                               │
                               │ MongoDB Driver
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │                     │
                    │ administrador_      │
                    │ articulos_db        │
                    └─────────────────────┘
```

Docker Compose construye y ejecuta los tres servicios:

```text
mongodb
backend
frontend
```

MongoDB utiliza un volumen persistente llamado `mongo_data`, por lo que los datos no desaparecen simplemente al recrear los contenedores.

---

# Estructura del proyecto

La estructura general del proyecto se divide entre frontend y backend:

```text
Administrador-de-Articulos/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   ├── shared/
│   │   └── ...
│   │
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── service/
│   │   └── hooks/
│   │
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

La separación permite mantener aisladas las responsabilidades del frontend y backend y facilita su evolución independiente.

---

# Arquitectura del Backend

El backend utiliza una arquitectura modular inspirada en principios de **Clean Architecture / Domain-Driven Design / Hexagonal Architecture**, separando responsabilidades entre dominio, aplicación e infraestructura.

```text
┌─────────────────────────────────────────┐
│              HTTP / Hono                │
│              Controllers                │
│                Routers                  │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│              Application                │
│                Use Cases                │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│                 Domain                  │
│          Entities / Interfaces          │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│             Infrastructure              │
│ MongoDB / Better Auth / Configuration   │
│           Dependency Injection           │
└─────────────────────────────────────────┘
```

La intención es evitar que la lógica de negocio dependa directamente de detalles de infraestructura como MongoDB o HTTP.

Esto permite cambiar implementaciones de infraestructura sin tener que modificar toda la lógica de aplicación.

---

# Capas del Backend

## Domain

Contiene los conceptos principales del negocio, entidades e interfaces utilizadas por las diferentes capas.

Esta capa intenta mantenerse independiente de frameworks y tecnologías externas.

---

## Application

Contiene los casos de uso de la aplicación.

Los casos de uso representan operaciones que puede realizar el sistema, por ejemplo:

```text
Crear artículo
Obtener artículos
Filtrar artículos
Actualizar artículo
Eliminar artículo
Obtener estadísticas
```

La capa de aplicación utiliza interfaces en lugar de depender directamente de MongoDB.

---

## Infrastructure

Contiene las implementaciones relacionadas con infraestructura:

* Configuración.
* Conexión con MongoDB.
* Repositorios.
* Inyección de dependencias.
* Better Auth.
* Configuración de la aplicación.

El punto de entrada del backend inicializa la configuración, conecta MongoDB, configura el contenedor de dependencias y registra los routers HTTP.

---

# Inyección de dependencias

Se utiliza **TSyringe** para implementar Dependency Injection.

El objetivo es evitar que los componentes de la aplicación creen directamente sus dependencias.

El flujo general es:

```text
Controller
    │
    ▼
Use Case / Service
    │
    ▼
Repository Interface
    │
    ▼
MongoDB Repository
```

Esto facilita:

* Separación de responsabilidades.
* Testing.
* Sustitución de implementaciones.
* Mantenimiento del código.
* Reducción del acoplamiento entre capas.

---

# Backend HTTP

El servidor utiliza **Hono**.

Las rutas se organizan principalmente de la siguiente manera:

```text
/api/auth
/api/users
/api/articles
```

El servidor también incorpora:

* Logger.
* CORS.
* Manejo global de errores.
* Cookies y credenciales para autenticación.
* Configuración mediante variables de entorno.

---

# CORS

El backend configura CORS para aceptar únicamente los orígenes definidos en:

```env
FRONTED_URL
```

La variable permite definir múltiples orígenes separados mediante comas.

Por ejemplo:

```env
FRONTED_URL=http://localhost:5173,http://192.168.0.8:5173
```

El backend transforma estos valores en una lista de orígenes permitidos y habilita las credenciales.

```text
credentials: true
```

Esto es necesario porque la autenticación utiliza cookies de sesión.

---

# Autenticación

La autenticación utiliza **Better Auth**.

Las rutas de autenticación se encuentran bajo:

```text
/api/auth
```

El frontend realiza las peticiones utilizando:

```text
credentials: 'include'
```

Esto permite que las cookies de sesión sean enviadas entre frontend y backend cuando la configuración de CORS lo permite.

---

# Protección de rutas

El router protege las rutas que requieren autenticación.

Por ejemplo:

```text
/my-articles
```

requiere una sesión válida.

Si el usuario no está autenticado, es redirigido a:

```text
/
```

De manera similar, si un usuario autenticado intenta acceder a las páginas de login o registro, es redirigido a:

```text
/my-articles
```

El flujo general es:

```text
Usuario
   │
   ▼
Frontend
   │
   ▼
¿Ruta protegida?
   │
   ▼
¿Existe sesión?
   │
   ├── Sí ──► Mostrar página
   │
   └── No ──► Redirigir a /
```

---

# Frontend

El frontend está construido con:

* React.
* TypeScript.
* Vite.
* HeroUI.
* Tailwind CSS.
* TanStack Router.
* TanStack Query.
* TanStack Form.
* Zod.

La navegación se administra mediante **TanStack Router**.

Las rutas principales son:

```text
/
├── /login
├── /register
└── /my-articles
```

---

# Parámetros de búsqueda

La página principal utiliza parámetros de búsqueda para representar los filtros:

```text
/
├── page
├── author
├── title
└── content
```

Por ejemplo:

```text
/?page=1&author=Brenda
```

Esto permite que el estado de búsqueda sea representado mediante una URL.

Por lo tanto, una búsqueda puede compartirse, recargarse o recuperarse utilizando la propia URL.

---

# Manejo de datos

El frontend utiliza **TanStack Query** para manejar las peticiones al backend y su cache.

Las consultas se identifican mediante `queryKey`.

Por ejemplo:

```text
filtered-articles
```

se combina con los parámetros actuales de búsqueda y paginación.

Conceptualmente:

```text
filtered-articles
      │
      ├── page
      ├── limit
      ├── author
      ├── title
      └── content
```

Esto permite que diferentes combinaciones de filtros tengan su propio estado de cache.

También se utiliza:

```text
keepPreviousData
```

para evitar que la interfaz quede vacía durante la transición entre páginas o filtros.

---

# Debounce de filtros

Los filtros de búsqueda utilizan un mecanismo de **debounce**.

La razón es evitar realizar una petición HTTP por cada tecla presionada.

Sin debounce, escribir:

```text
Brenda
```

podría generar peticiones para:

```text
B
Br
Bre
Bren
Brend
Brenda
```

Con debounce, la aplicación espera 500 ms desde la última modificación antes de actualizar los parámetros de búsqueda y ejecutar la consulta.

El flujo es:

```text
Usuario escribe
      │
      ▼
Estado local del input
      │
      ▼
Debounce 500 ms
      │
      ▼
Search Params
      │
      ▼
TanStack Query
      │
      ▼
     API
```

Esto reduce tráfico innecesario hacia el backend y evita consultas redundantes.

---

# Paginación

La paginación se realiza desde el backend.

El frontend envía:

```text
page
limit
```

junto con los filtros actuales.

Por ejemplo:

```text
page = 2
limit = 8
```

El backend devuelve los artículos correspondientes y los metadatos necesarios para determinar el número total de páginas.

De esta manera, el frontend no necesita descargar todos los artículos para realizar la paginación en memoria.

---

# Validación

La validación de datos se realiza mediante **Zod**.

Se utiliza para validar información proveniente de formularios y mantener estructuras consistentes en los datos utilizados por la aplicación.

Esto ayuda a evitar que datos inválidos lleguen a las capas internas de la aplicación.

---

# Formularios

El frontend utiliza **TanStack Form**.

Los formularios manejan:

* Estado.
* Validación.
* Errores.
* Submit.
* Integración con mutaciones de TanStack Query.

El flujo general es:

```text
TanStack Form
      │
      ▼
     Zod
      │
      ▼
TanStack Query Mutation
      │
      ▼
     API
```

---

# Cache después de crear un artículo

Después de crear un artículo, el frontend puede actualizar directamente el cache de TanStack Query utilizando la respuesta recibida del backend.

El flujo es:

```text
Crear artículo
      │
      ▼
Backend responde
      │
      ▼
Actualizar cache
      │
      ▼
Interfaz actualizada
```

De esta manera se evita realizar una nueva petición únicamente para recuperar un recurso que ya se encuentra disponible en la respuesta de la operación de creación.

---

# Variables de entorno

El proyecto utiliza variables de entorno para evitar almacenar credenciales y configuración sensible directamente en el código fuente.

Se proporciona un archivo:

```text
.env.example
```

como referencia.

Para crear la configuración local:

```bash
cp .env.example .env
```

Después se deben modificar los valores necesarios.

---

# Variables del Backend

## PORT

Puerto donde escucha el backend.

```env
PORT=3000
```

---

## MONGO_URI

URI utilizada para conectarse a MongoDB.

Cuando se utiliza Docker Compose, el backend se conecta al servicio de MongoDB mediante el nombre del servicio dentro de la red de Docker.

Ejemplo:

```env
MONGO_URI=mongodb://mongodb:27017
```

---

## DB_NAME

Nombre de la base de datos utilizada por la aplicación.

```env
DB_NAME=administrador_articulos_db
```

---

## BETTER_AUTH_URL

URL base utilizada por Better Auth.

Ejemplo:

```env
BETTER_AUTH_URL=http://localhost:3000
```

---

## BETTER_AUTH_SECRET

Clave secreta utilizada por Better Auth para proteger y firmar información sensible relacionada con la autenticación y las sesiones.

Ejemplo:

```env
BETTER_AUTH_SECRET=una_clave_secreta_larga_y_aleatoria
```

---

## FRONTED_URL

Define los orígenes permitidos por CORS.

Se pueden especificar múltiples URLs separadas por comas.

Ejemplo:

```env
FRONTED_URL=http://localhost:5173
```

También es posible permitir el acceso desde otro dispositivo conectado a la misma red local:

```env
FRONTED_URL=http://localhost:5173,http://192.168.0.8:5173
```

Esto permite, por ejemplo, acceder al frontend desde un teléfono conectado a la misma red durante el desarrollo.

---

# Ejemplo de `.env`

Un entorno local puede tener una configuración similar a:

```env
PORT=3000

MONGO_URI=mongodb://mongodb:27017
DB_NAME=administrador_articulos_db

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=una_clave_secreta_larga_y_aleatoria

FRONTED_URL=http://localhost:5173
```

---

# Requisitos

Para ejecutar el proyecto localmente se necesita:

* Git.
* Node.js.
* npm.
* Docker.
* Docker Compose.

Para la ejecución mediante Docker Compose, no es necesario instalar MongoDB directamente en el sistema, ya que se ejecuta dentro de su propio contenedor.

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/JuanJL217/Administrador-de-Articulos.git
```

Entrar al proyecto:

```bash
cd Administrador-de-Articulos
```

---

## 2. Crear las variables de entorno

Crear el archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Modificar las variables según el entorno donde se vaya a ejecutar la aplicación.

---

# Ejecución con Docker Compose

Esta es la forma recomendada de ejecutar el proyecto porque permite levantar frontend, backend y MongoDB mediante una única configuración.

Ejecutar:

```bash
docker compose up --build -d
```

Verificar los contenedores:

```bash
docker compose ps
```
# Agregación de datos: User y Article

## 1. Entrar al contenedor de MongoDB:

```bash
docker compose exec mongodb mongosh
```

## 2. Entrar a la base de datos:

```bash
use administrador_articulos_db
```

## 3. Pegar el contenido
Copiar todo el contenido de `seedUser.txt` y `seedArticles.txt` con ctrl+c y pegar con el click derecho del ratón (no aplica ctrl+v)

La aplicación estará disponible en:

Frontend:
```bash
http://localhost:5173
```

Backend:
```bash
http://localhost:3000
```

MongoDB estará disponible para los contenedores mediante el puerto interno:

```text
27017
```

y, si está expuesto al sistema host por Docker Compose, mediante el puerto externo configurado.

---

# Servicios y puertos

Por defecto:

| Servicio |  Puerto |
| -------- | ------: |
| Frontend |  `5173` |
| Backend  |  `3000` |
| MongoDB  | `27018` |

El puerto externo de MongoDB es `27018`, mientras que el contenedor utiliza internamente el puerto estándar:

```text
27017
```

Por lo tanto:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:3000

MongoDB:
localhost:27018
```

---

# Decisiones técnicas

## Separación Frontend / Backend

Se decidió mantener frontend y backend separados.

Esto permite:

* Independencia entre presentación y lógica de negocio.
* Desarrollo y despliegue independiente.
* Separación de responsabilidades.
* Posibilidad de cambiar el frontend sin modificar la API.
* Mantener las credenciales y lógica de acceso a datos fuera del navegador.

El frontend se comunica exclusivamente con el backend mediante HTTP.

```text
Frontend
   │
   │ HTTP
   ▼
Backend
   │
   ▼
MongoDB
```

El frontend nunca accede directamente a MongoDB.

---

# Hono

Se utiliza Hono como framework HTTP del backend debido a su API sencilla, bajo overhead y buena integración con TypeScript.

La lógica de negocio no depende directamente de Hono.

Hono se utiliza principalmente como capa HTTP encargada de:

* Recibir peticiones.
* Ejecutar middleware.
* Validar y procesar solicitudes.
* Invocar casos de uso.
* Generar respuestas HTTP.

Esto permite mantener separada la lógica de negocio del framework.

---

# MongoDB

El acceso a MongoDB se mantiene dentro de la capa de infraestructura.

Esto evita que los casos de uso dependan directamente del driver de MongoDB.

El flujo es:

```text
Use Case
   │
   ▼
Repository Interface
   │
   ▼
MongoDB Repository
   │
   ▼
MongoDB
```

---

# TanStack Query

Se utiliza TanStack Query para gestionar el estado remoto proveniente de la API.

Esto permite centralizar:

* Cache.
* Estados de carga.
* Estados de error.
* Refetch.
* Mutaciones.
* Actualización del cache.

De esta manera no es necesario implementar manualmente la gestión del estado de cada petición HTTP dentro de los componentes.

---

# TanStack Router

Se utiliza TanStack Router para gestionar la navegación y los parámetros de búsqueda de forma tipada.

Los filtros de artículos forman parte de la URL:

```text
/?page=2&author=Brenda
```

Esto permite:

* Compartir una búsqueda.
* Recargar la página manteniendo los filtros.
* Utilizar los botones atrás/adelante del navegador.
* Mantener una navegación reproducible.
* Representar el estado de búsqueda mediante la URL.

---

# Debounce

Los filtros utilizan debounce para reducir la cantidad de peticiones realizadas al backend.

El usuario puede escribir normalmente en el input y el sistema espera 500 ms antes de actualizar los parámetros de búsqueda.

Esto evita generar una petición por cada tecla presionada.

La decisión resulta especialmente útil en filtros que realizan búsquedas contra la base de datos.

---

# CORS y cookies

La autenticación utiliza cookies de sesión.

Por este motivo, el frontend realiza las peticiones autenticadas utilizando:

```text
credentials: 'include'
```

El backend configura CORS utilizando los orígenes definidos en:

```env
FRONTED_URL
```

y permite credenciales.

De esta manera:

```text
Frontend
   │
   │ Cookie
   ▼
Backend
   │
   ▼
Better Auth
```

Las credenciales de autenticación no necesitan almacenarse manualmente en el código del frontend.

---

# URL como fuente del estado de búsqueda

Los filtros de la página principal se representan mediante search params.

Por ejemplo:

```text
/?page=2&author=Brenda&title=React
```

La URL funciona como representación del estado de búsqueda.

Esto permite que una misma URL produzca el mismo conjunto de filtros cuando se abre nuevamente.

Los inputs mantienen además un estado local para permitir que el usuario escriba sin provocar una actualización de la URL en cada tecla.

El debounce sincroniza posteriormente el estado local con los parámetros de búsqueda.

---

# Paginación del lado del servidor

La paginación se realiza en el backend en lugar de descargar todos los artículos y procesarlos en el navegador.

El frontend envía:

```text
page
limit
author
title
content
```

El backend procesa estos parámetros y devuelve únicamente los artículos necesarios.

Esto reduce la cantidad de información transferida y evita mantener todos los artículos en memoria en el navegador.

---

# Persistencia

MongoDB utiliza un volumen Docker:

```text
mongo_data
```

Esto permite conservar los datos aunque los contenedores sean recreados.

Los datos se eliminan únicamente al eliminar explícitamente el volumen.

Para eliminar los datos persistidos:

```bash
docker compose down -v
```

---

# Flujo general de una petición

Una petición típica de artículos sigue el siguiente flujo:

```text
Usuario
   │
   ▼
React Component
   │
   ▼
TanStack Query
   │
   ▼
HTTP Request
   │
   ▼
Hono Router
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
MongoDB
```

La respuesta realiza el camino inverso:

```text
MongoDB
   │
   ▼
Repository
   │
   ▼
Service
   │
   ▼
Controller
   │
   ▼
Hono
   │
   ▼
TanStack Query
   │
   ▼
React
```

Esta separación permite mantener cada capa enfocada en una responsabilidad concreta.

---

# Desarrollo

Para realizar cambios únicamente sobre frontend o backend también es posible ejecutar los servicios directamente con:

```bash
docker compose up --build -d backend
```

Así, en este caso, solo vuelves a construir el backend
