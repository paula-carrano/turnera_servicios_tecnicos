import { useState } from "react";

const EMPTY_REQUEST = {
  numeroCuenta: "",
  nombreTitular: "",
  direccion: "",
  motivoPedido: "",
  operador: "",
  fechaVisita: "",
  horaDesde: "",
  horaHasta: "",
  comentariosServicio: "",
  estado: "PENDIENTE",
};

export default function RequestFormScreen({ request, onSave, onCancel }) {
  const [values, setValues] = useState(() => ({ ...EMPTY_REQUEST, ...request }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = ({ target }) => {
    setValues((current) => ({ ...current, [target.name]: target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = cleanOptionalValues(values);
      await onSave(request ? { ...payload, version: request.version } : payload);
    } catch (requestError) {
      setError(getSaveErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell form-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Servicios técnicos</p>
          <h1>{request ? "Editar solicitud" : "Nueva solicitud"}</h1>
        </div>
      </header>

      <form onSubmit={submit}>
        <div className="form-grid">
          <TextField label="Número de cuenta" name="numeroCuenta" value={values.numeroCuenta} onChange={updateField} required />
          <TextField label="Nombre del titular" name="nombreTitular" value={values.nombreTitular} onChange={updateField} required />
          <TextField label="Dirección" name="direccion" value={values.direccion} onChange={updateField} required />
          <TextField label="Operador" name="operador" value={values.operador} onChange={updateField} required />
          <TextField label="Motivo del pedido" name="motivoPedido" value={values.motivoPedido} onChange={updateField} required wide />
          <TextField label="Fecha de visita" name="fechaVisita" type="date" value={values.fechaVisita ?? ""} onChange={updateField} />
          <TextField label="Hora desde" name="horaDesde" type="time" value={values.horaDesde ?? ""} onChange={updateField} />
          <TextField label="Hora hasta" name="horaHasta" type="time" value={values.horaHasta ?? ""} onChange={updateField} />
          <label>
            Estado
            <select name="estado" value={values.estado} onChange={updateField}>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN_PRUEBA">EN PRUEBA</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
          </label>
          <label className="wide">
            Comentarios del servicio
            <textarea name="comentariosServicio" value={values.comentariosServicio ?? ""} onChange={updateField} rows="4" />
          </label>
        </div>

        {error && <p role="alert" className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={saving}>Cancelar</button>
          <button type="submit" className="primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </main>
  );
}

function TextField({ label, wide, ...inputProps }) {
  return (
    <label className={wide ? "wide" : undefined}>
      {label}
      <input {...inputProps} />
    </label>
  );
}

function cleanOptionalValues(values) {
  return Object.fromEntries(
    Object.entries(values)
      .filter(([key]) => key !== "id" && key !== "version")
      .map(([key, value]) => [key, value === "" && ["fechaVisita", "horaDesde", "horaHasta"].includes(key) ? null : value]),
  );
}

export function getSaveErrorMessage(error) {
  if (error?.status === 409 || error?.code === "VERSION_CONFLICT") {
    return "Otra persona modificó esta solicitud. Tus cambios se conservaron: revisá la información actualizada antes de volver a guardar.";
  }
  return error?.message ?? "No se pudo guardar la solicitud.";
}
