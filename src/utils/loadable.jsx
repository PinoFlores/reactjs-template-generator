import React, { lazy, Suspense } from 'react';

export const lazyLoad = (importFunc, selectorFunc, opts) => {
  let lazyFactory;

  if (selectorFunc) {
    lazyFactory = () =>
      importFunc().then(module => ({ default: selectorFunc(module) }));
  }

  const LazyComponent = lazy(lazyFactory);
  let fallback = opts != undefined ? opts.fallback : <></>;
  return props => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
