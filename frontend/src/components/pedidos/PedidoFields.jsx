import { FIELDS } from '../../constants/pedidos.js';
import MapLink from '../common/MapLink.jsx';

const PedidoFields = ({ values, onChange, prefix }) => (
  <div className="row g-3">
    {FIELDS.map((field) => (
      <div className={field.wide ? 'col-12' : 'col-sm-6'} key={field.name}>
        <div className="field-label">
          <label className="form-label" htmlFor={`${prefix}-${field.name}`}>
            {field.label} <span aria-hidden="true">*</span>
          </label>
          {field.name === 'direccion' && values.direccion.trim() && <MapLink address={values.direccion} />}
        </div>
        {field.multiline ? (
          <textarea
            className="form-control"
            id={`${prefix}-${field.name}`}
            required
            maxLength={field.max}
            rows={3}
            value={values[field.name]}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
        ) : (
          <input
            className="form-control"
            id={`${prefix}-${field.name}`}
            required
            maxLength={field.max}
            value={values[field.name]}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
        )}
      </div>
    ))}
  </div>
);

export default PedidoFields;
