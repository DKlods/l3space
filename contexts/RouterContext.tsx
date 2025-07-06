
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

interface RouterContextType {
  route: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState(window.location.pathname);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
