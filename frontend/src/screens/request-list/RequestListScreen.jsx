export default function RequestListScreen({
  requests,
  loading,
  error,
  onRetry,
  onCreate,
  onEdit,
}) {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Servicios técnicos</p>
          <h1>Solicitudes</h1>
        </div>
        <button type="button" className="primary" onClick={onCreate}>
          Nueva solicitud
        </button>
      </header>

      {loading && <p role="status">Cargando solicitudes…</p>}

      {!loading && error && (
        <section role="alert" className="message error-message">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            Reintentar
          </button>
        </section>
      )}

      {!loading && !error && requests.length === 0 && (
        <section className="message empty-state">
          <h2>No hay solicitudes registradas</h2>
          <p>Creá la primera solicitud para comenzar a coordinar una visita.</p>
          <button type="button" onClick={onCreate}>
            Crear solicitud
          </button>
        </section>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Titular</th>
                <th>Dirección</th>
                <th>Visita</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.numeroCuenta}</td>
                  <td>{request.nombreTitular}</td>
                  <td>{request.direccion}</td>
                  <td>{formatVisit(request)}</td>
                  <td>
                    <span className={`status status-${request.estado.toLowerCase()}`}>
                      {formatStatus(request.estado)}
                    </span>
                  </td>
                  <td>
                    <button type="button" onClick={() => onEdit(request.id)}>
                      Editar
                    </button>
                    {buildGoogleMapsUrl(request.direccion) ? (
                      <a
                        className="button-link"
                        href={buildGoogleMapsUrl(request.direccion)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver ubicación
                      </a>
                    ) : (
                      <span className="unavailable-location">Ubicación no disponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function formatVisit(request) {
  if (!request.fechaVisita) return "Sin programar";
  const times = [request.horaDesde, request.horaHasta].filter(Boolean).join(" – ");
  return times ? `${request.fechaVisita} · ${times}` : request.fechaVisita;
}

function formatStatus(status) {
  return status.replaceAll("_", " ");
}

export function buildGoogleMapsUrl(address) {
  if (!address || !address.trim()) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}
