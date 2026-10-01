# Turnera · Servicios técnicos

Aplicación en español para cargar pedidos, coordinar visitas y registrar su seguimiento. Frontend **React + JavaScript + Bootstrap** y API **Node.js + Express** independientes; persistencia en **Supabase/PostgreSQL**.

## Requisitos

- Node.js 22.12 o superior y npm.
- Proyecto Supabase vacío (`turnera_servicios_tecnicos`).
- Dos terminales para ejecutar frontend y backend.

## 1. Preparar Supabase

1. Abrir el proyecto en Supabase y entrar a **SQL Editor**.
2. Ejecutar una sola vez el contenido completo de [`backend/sql/001_init.sql`](backend/sql/001_init.sql). Crea las tablas, índices, restricciones de agenda y permisos dentro de una transacción. No está diseñado para reemplazar tablas existentes.
3. Obtener la URL del proyecto y una **secret key** (`sb_secret_...`). También funciona la clave heredada `service_role`. No usar la clave `anon` ni una publishable key para el backend.
4. Mantener ambas tablas en el esquema `public`, expuesto por la Data API. El SQL activa RLS y no habilita políticas para clientes anónimos ni autenticados. Solo el backend accede mediante su clave de servidor.

La clave secreta omite RLS y debe permanecer exclusivamente en el servidor, según la [documentación de Supabase](https://supabase.com/docs/guides/getting-started/api-keys). No se debe colocar en variables `VITE_`, commits ni código del navegador.

## 2. Iniciar la API

En PowerShell, desde la raíz:

```powershell
cd backend
npm ci
Copy-Item .env.example .env
```

Editar `backend/.env`:

```dotenv
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SECRET_KEY=TU_CLAVE_DE_SERVIDOR
```

Luego:

```powershell
npm run dev
```

La API queda en `http://localhost:3001/api`. `GET /api/health` confirma que el proceso está activo; no verifica la conexión a Supabase. Para comprobar la conexión, consultar `GET /api/pedidos?solapa=SIN_ASIGNAR`.

## 3. Iniciar el frontend

En otra terminal, desde la raíz:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

Abrir **http://localhost:5173**. La única variable del frontend es:

```dotenv
VITE_API_URL=http://localhost:3001/api
```

El frontend usa esa URL al compilar. Si se cambia, reiniciar Vite o volver a compilar. Para desarrollo HTTP local, el backend permite tanto `localhost` como `127.0.0.1` en el puerto de `FRONTEND_ORIGIN`. Para un dominio externo, el origen debe coincidir exactamente. Si Vite usa otro puerto, actualizar `FRONTEND_ORIGIN` y reiniciar el backend.

En Linux/macOS, usar `cp .env.example .env` en lugar de `Copy-Item`.

## Uso

1. **Nuevo pedido:** completar cuenta, titular, dirección con localidad/provincia, motivo y operador. Se crea `PENDIENTE`, sin turno. Las cuentas se guardan como texto y pueden repetirse.
2. **Ver pedido:** corregir datos, asignar fecha/inicio/fin, cambiar estado o quitar el turno. Guardar con **Guardar cambios**.
3. **Comentarios:** escribir nombre y comentario, y pulsar **Agregar comentario**. Se conservan los comentarios anteriores con su fecha; no hay edición ni eliminación. El guardado del comentario es independiente del formulario del pedido.
4. **Google Maps:** abre una búsqueda de la dirección en otra pestaña; no requiere clave de Maps.
5. **Actualizar:** vuelve a consultar la solapa. También se actualiza al cambiar de solapa y después de guardar. No hay sincronización en tiempo real entre navegadores.

| Solapa | Pedidos incluidos | Orden |
| --- | --- | --- |
| Sin asignar | `PENDIENTE` sin turno | Creación descendente |
| Asignados | `PENDIENTE` con turno | Inicio ascendente |
| En prueba | `PRUEBA`, con o sin turno | Creación descendente |
| Finalizados | `FINALIZADO`, con o sin turno | Creación descendente |

La agenda es única. No se selecciona técnico. Todos los horarios se ingresan y muestran en `America/Argentina/Buenos_Aires`, independientemente de la zona horaria del navegador. Se guardan como `timestamptz`.

Cada turno empieza y termina el mismo día, con fin posterior a inicio. Se permiten fechas pasadas y cualquier día/horario. Dos turnos pueden ser consecutivos (10–11 y 11–12). Solo los pedidos `PENDIENTE` con turno bloquean la franja. Pasar a `PRUEBA` o `FINALIZADO` libera el horario pero conserva las fechas. Al reabrir, se comprueba nuevamente la disponibilidad; ante conflicto se rechaza todo el cambio. Se puede quitar el turno o reprogramarlo en el mismo guardado.

La exclusión parcial GiST sobre `tstzrange(..., '[)')` garantiza que dos escrituras concurrentes no reserven la misma franja. [Referencia de PostgreSQL](https://www.postgresql.org/docs/15/rangetypes.html).

## API

JSON, sin autenticación. Fechas de respuesta en ISO 8601 con zona horaria. Identificadores UUID.

| Método y ruta | Entrada | Respuesta |
| --- | --- | --- |
| `GET /api/pedidos?solapa=SIN_ASIGNAR` | `SIN_ASIGNAR`, `ASIGNADOS`, `PRUEBA` o `FINALIZADOS`; por defecto `SIN_ASIGNAR` | `{ "pedidos": [...] }` |
| `GET /api/pedidos/:id` | UUID | `{ "pedido": {...}, "comentarios": [...] }` |
| `POST /api/pedidos` | Datos de alta | `201`, `{ "pedido": {...} }` |
| `PATCH /api/pedidos/:id` | Solo los campos a modificar | `{ "pedido": {...} }` |
| `POST /api/pedidos/:id/comentarios` | `{ "autor": "Luis", "texto": "Visita realizada" }` | `201`, `{ "comentario": {...} }` |

Datos de alta:

```json
{
  "numero_cuenta": "00012345",
  "titular": "Ana Pérez",
  "direccion": "Av. Colón 123, Córdoba, Argentina",
  "motivo": "Sin conexión a internet",
  "operador": "María"
}
```

Todos los campos son texto obligatorio y se recortan los espacios exteriores. Límites: cuenta 80, titular 200, dirección 500, motivo 3000, operador/autor 120 y comentario 5000 caracteres. El alta no acepta un estado ni un turno; nacen con los valores por defecto de la base.

Ejemplo de asignación/reprogramación:

```json
{
  "turno_inicio": "2026-10-10T10:00:00-03:00",
  "turno_fin": "2026-10-10T11:00:00-03:00"
}
```

Si se modifica un extremo, se deben enviar ambos. Para quitar el turno, enviar ambos como `null`. `PATCH` también permite modificar los datos de alta y `estado` (`PENDIENTE`, `PRUEBA`, `FINALIZADO`); debe incluir al menos un cambio. Se puede cambiar de estado sin turno.

Errores con formato `{ "error": { "message": "...", "details": [{ "campo": "...", "mensaje": "..." }] } }`; `details` es opcional:

- `400`: entrada inválida, UUID inválido, intervalo incompleto o estado desconocido.
- `404`: pedido o ruta inexistente.
- `409`: superposición de agenda; no se aplican cambios parciales.
- `413`: cuerpo JSON demasiado grande (máximo 32 KB).
- `503`: Supabase no está disponible o no se pudo consultar.
- `500`: error inesperado, sin exponer credenciales ni detalles internos.

No hay endpoints de eliminación ni edición de comentarios. Las consultas del repositorio recorren páginas de 500 filas para no truncar el listado con el límite predeterminado de Supabase (1000 filas). Mantener el límite de la Data API en 500 o más.

## Pruebas

Desde `backend/`:

```powershell
npm test
npm run test:db
```

- `npm test`: API Express mediante Supertest y consultas Supabase con transporte HTTP controlado; valida contratos, códigos HTTP, filtros, orden, intervalos, comentarios y paginación.
- `npm run test:db`: PostgreSQL real temporal, descargado como dependencia de desarrollo. Aplica el SQL y verifica persistencia, turnos consecutivos, concurrencia con dos conexiones, reapertura, reprogramación atómica, restricciones de fecha y permisos. No usa ni modifica el proyecto Supabase. Cierra el servidor y limpia sus archivos al terminar.
- Alternativa para plataformas donde no funciona PostgreSQL embebido: establecer `TEST_DATABASE_URL` apuntando a una base PostgreSQL **vacía y descartable**, con un usuario que pueda crear tablas y roles. La suite rechaza bases que ya contengan `pedidos` o `comentarios` y borra solamente las tablas/función que ella creó. Nunca usar una base real de trabajo para esa variable.

Desde `frontend/`:

```powershell
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

- Pruebas unitarias de fechas, zona horaria, estados y codificación de Maps.
- Playwright ejecuta los flujos de interfaz con HTTP controlado en escritorio y celular: alta, asignación, comentarios, cambios de estado, reapertura, errores y navegación por teclado. No requiere credenciales ni una API activa. La persistencia real se verifica por separado con `test:db`.
- Playwright inicia Vite en el puerto 5173; usar ese puerto libre. Genera capturas en `frontend/test-results/`, ignoradas por Git.
- `npm run build` genera `frontend/dist/`. `npm run preview` permite revisar esa compilación localmente.

## Ejecución fuera de desarrollo

Ejecutar la API con `npm start` y servir `frontend/dist/` como sitio estático. Configurar `VITE_API_URL` antes de compilar y `FRONTEND_ORIGIN` con el origen del sitio. Usar HTTPS para ambos cuando se expongan por internet. No se incluye configuración de un proveedor de despliegue.

**Acceso abierto por diseño:** no hay login, roles ni verificación de nombres. Cualquier persona con acceso a la API puede consultar y modificar pedidos. CORS no reemplaza autenticación. Si se requiere uso restringido, limitar el acceso de red o agregar autenticación en una versión posterior.

No incluye calendario visual, asignación individual de técnicos, notificaciones, adjuntos ni eliminación de pedidos.
