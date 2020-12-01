import * as React from "react";
import { makeProvider } from "../components/provider";

const STORAGE_KEY = "adaptable-layout-4";
async function setLastSnapShot() {
  const platform = fin.Platform.getCurrentSync();
  const snapshot = await platform.getSnapshot();

  if (snapshot.windows.length) {
    const strSnapshot = JSON.stringify(snapshot);
    localStorage.setItem(STORAGE_KEY, strSnapshot);
  }
}

function getLastSnapShot() {
  let snapshot: any = localStorage.getItem(STORAGE_KEY);
  snapshot = snapshot ? JSON.parse(snapshot) : null;

  if (snapshot) {
    if (!snapshot.windows || !snapshot.windows.length) {
      return null;
    }
  }
  return snapshot;
}
async function init() {
  fin.Platform.init({
    overrideCallback: async (Provider) => {
      class Override extends Provider {
        async quit(...args) {
          await setLastSnapShot();
          return super.quit(...args);
        }

        async applySnapshot({ snapshot, options }, callerIdentity) {
          const lastSnapshot = getLastSnapShot();
          if (lastSnapshot) {
            return super.applySnapshot(
              { snapshot: lastSnapshot, options },
              callerIdentity
            );
          } else {
            return super.applySnapshot({ snapshot, options }, callerIdentity);
          }
        }
      }
      return new Override();
    },
  });

  makeProvider();

  setInterval(setLastSnapShot, 250);
}

const App: React.FC = () => {
  const [initialized, setInitialized] = React.useState(false);
  React.useEffect(() => {
    if (initialized) {
      return;
    }
    setInitialized(true);
    init();
  }, [initialized]);
  return <div>provider</div>;
};

export default App;
