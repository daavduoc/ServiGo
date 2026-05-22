import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restaura el scroll al cambiar de ruta (SPA no lo hace por defecto).
 * Si la URL trae hash (#sección), hace scroll a ese elemento.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    const scrollArriba = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollArriba();

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      scrollArriba();
      raf2 = requestAnimationFrame(scrollArriba);
    });
    const tLate = window.setTimeout(scrollArriba, 100);

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      window.clearTimeout(tLate);
    };
  }, [pathname, hash]);

  return null;
};
