import Icon from '../common/Icon.jsx';

const AppHeader = () => (
  <header className="app-header">
    <div className="app-container header-inner">
      <a className="brand" href="./" aria-label="Turnera, inicio">
        <span className="brand-symbol"><Icon name="calendar" size={24} /></span>
        <span>
          turnera<span className="brand-dot">.</span>
          <small>Servicios técnicos</small>
        </span>
      </a>
      <div className="header-label"><span className="live-dot" /> Gestión de servicios</div>
    </div>
  </header>
);

export default AppHeader;
