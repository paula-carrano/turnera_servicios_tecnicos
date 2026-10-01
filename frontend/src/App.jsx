import Home from './Pages/Home.jsx';
import AppHeader from './components/layout/AppHeader.jsx';

const App = () => (
  <>
    <a className="skip-link" href="#main">Ir a los pedidos</a>
    <AppHeader />
    <Home />
  </>
);

export default App;
