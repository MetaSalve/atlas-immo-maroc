
import React, { Suspense } from 'react';
import { PageTransition } from '../ui/animations';
import { LoadingFallback } from '../common/LoadingFallback';

export function withPageTransition<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithPageTransitionWrapper(props: P) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <PageTransition>
          <Component {...props} />
        </PageTransition>
      </Suspense>
    );
  };
}
