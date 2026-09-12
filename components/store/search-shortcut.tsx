'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function SearchShortcut() {
  const router = useRouter();
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        router.push('/search');
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [router]);
  return null;
}
