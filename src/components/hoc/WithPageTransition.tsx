
import React, { Suspense } from 'react';
import { PageTransition } from '../ui/animations';
import { LoadingFallback } from '../common/LoadingFallback';
import { useCodeSplitting } from '@/hooks/useCodeSplitting';

export function withPageTransition<P extends object>(
  Component: React.ComponentType<P>,
  preloadModules: Array<() => Promise<any>> = []
): React.FC<P> {
  return function WithPageTransitionWrapper(props: P) {
    const { preloadModule } = useCodeSplitting();

    // Précharger les modules associés à ce composant
    React.useEffect(() => {
      preloadModules.forEach(moduleLoader => {
        preloadModule(moduleLoader, { priority: 'low' });
      });
    }, []);

    return (
      <Suspense fallback={<LoadingFallback />}>
        <PageTransition>
          <Component {...props} />
        </PageTransition>
      </Suspense>
    );
  };
}
