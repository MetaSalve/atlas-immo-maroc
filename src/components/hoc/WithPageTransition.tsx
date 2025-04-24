
import React from 'react';
import { PageTransition } from '../ui/animations';

export function withPageTransition<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithPageTransitionWrapper(props: P) {
    return (
      <PageTransition>
        <Component {...props} />
      </PageTransition>
    );
  };
}
