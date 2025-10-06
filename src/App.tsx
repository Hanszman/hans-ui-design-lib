import vhLogo from './assets/img/logo/vh_logo_purple.png';
import './styles/logo.scss';

function App() {
  return (
    <>
      <div className="flex bg-red-200 p-4">
        <img src={vhLogo} className="logo" alt="Victor Hanszman Logo" />
        <h1>Hanszman's UI Design Lib</h1>
      </div>
    </>
  );
}

export default App;
