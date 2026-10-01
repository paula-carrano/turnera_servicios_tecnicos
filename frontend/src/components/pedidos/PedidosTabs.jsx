import { useRef } from 'react';
import { TABS } from '../../constants/pedidos.js';
import Icon from '../common/Icon.jsx';

const PedidosTabs = ({ tab, onSelect }) => {
  const tabRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    const targets = {
      ArrowRight: (index + 1) % TABS.length,
      ArrowLeft: (index + TABS.length - 1) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    onSelect(TABS[target].id);
    tabRefs.current[target].focus();
  };

  return (
    <div className="tabs-row">
      <div className="nav nav-tabs" role="tablist" aria-label="Estado de los pedidos">
        {TABS.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            className={`nav-link ${tab === item.id ? 'active' : ''}`}
            id={`tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="pedidos-panel"
            tabIndex={tab === item.id ? 0 : -1}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => onSelect(item.id)}
          >
            <Icon name={item.icon} size={18} />{item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PedidosTabs;
