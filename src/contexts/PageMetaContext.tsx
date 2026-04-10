import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface PageMeta {
  title: string;
  subtitle?: string;
}

interface PageMetaContextValue {
  meta: PageMeta;
  setMeta: (meta: PageMeta) => void;
}

const defaultMeta: PageMeta = { title: 'Admin Panel', subtitle: '' };

const PageMetaContext = createContext<PageMetaContextValue>({
  meta: defaultMeta,
  setMeta: () => {},
});

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const [meta, setMetaState] = useState<PageMeta>(defaultMeta);

  const setMeta = useCallback((newMeta: PageMeta) => {
    setMetaState(newMeta);
  }, []);

  return (
    <PageMetaContext.Provider value={{ meta, setMeta }}>
      {children}
    </PageMetaContext.Provider>
  );
}

export function usePageMeta() {
  return useContext(PageMetaContext);
}
