import vhLogo from './assets/img/logo/vh_logo_purple.png';

function App() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center !my-4">
          <img
            src={vhLogo}
            className="w-6 h-auto !mx-2 !my-1"
            alt="Victor Hanszman's Logo"
          />
          <h1 className="text-[var(--purple-primary)] !text-xl !font-bold">
            Hanszman's UI Design Lib
          </h1>
        </div>
        <div>
          <p>
            In this Lib you can develop your components for your own projects.
          </p>
          <p>
            Check out the documentation by running the script: &nbsp;
            <code className="text-[var(--purple-primary)]">
              npm run storybook
            </code>
            .
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
