import Icon from '../common/Icon.jsx';

const PedidoSchedule = ({ slot, estado, busy, onChangeSlot, onChangeEstado, onClear }) => {
  const slotRequired = Boolean(slot.fecha || slot.inicio || slot.fin);

  return (
    <section className="schedule-section" aria-labelledby="schedule-heading">
      <div className="section-title">
        <h3 id="schedule-heading"><Icon name="calendar" size={19} /> Turno y seguimiento</h3>
        <button type="button" className="btn btn-link btn-sm" onClick={onClear} disabled={!slotRequired || busy}>
          Quitar turno
        </button>
      </div>
      <div className="row g-3">
        <div className="col-sm-6">
          <label className="form-label" htmlFor="turno-fecha">Fecha</label>
          <input
            type="date"
            className="form-control"
            id="turno-fecha"
            min="0001-01-01"
            max="9999-12-31"
            required={slotRequired}
            value={slot.fecha}
            onChange={(event) => onChangeSlot('fecha', event.target.value)}
          />
        </div>
        <div className="col-6 col-sm-3">
          <label className="form-label" htmlFor="turno-inicio">Inicio</label>
          <input
            type="time"
            className="form-control"
            id="turno-inicio"
            required={slotRequired}
            value={slot.inicio}
            onChange={(event) => onChangeSlot('inicio', event.target.value)}
          />
        </div>
        <div className="col-6 col-sm-3">
          <label className="form-label" htmlFor="turno-fin">Fin</label>
          <input
            type="time"
            className="form-control"
            id="turno-fin"
            required={slotRequired}
            value={slot.fin}
            onChange={(event) => onChangeSlot('fin', event.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="estado">Estado</label>
          <select className="form-select" id="estado" value={estado} onChange={(event) => onChangeEstado(event.target.value)}>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="PRUEBA">PRUEBA</option>
            <option value="FINALIZADO">FINALIZADO</option>
          </select>
        </div>
      </div>
      <p className="form-note">
        Hora de Buenos Aires. Solo los pedidos pendientes reservan la franja; en prueba o finalizados la liberan.
      </p>
    </section>
  );
};

export default PedidoSchedule;
