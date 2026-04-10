import { useEffect } from 'react';
import { usePageMeta } from '@/contexts/PageMetaContext';

export function useSetPageMeta(title: string, subtitle?: string) {
  const { setMeta } = usePageMeta();

  useEffect(() => {
    setMeta({ title, subtitle });
  }, [title, subtitle, setMeta]);
}
