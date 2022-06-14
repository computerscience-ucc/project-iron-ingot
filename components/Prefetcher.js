import { useContext, createContext } from 'react';

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  let sharedState = {};

  return (
    <PrefetcherContext.Provider value={sharedState}>
      {children}
    </PrefetcherContext.Provider>
  );
};

const usePrefetcherContext = (e) => {
  return useContext(PrefetcherContext);
};

export { PrefetcherWrapper, usePrefetcherContext };
