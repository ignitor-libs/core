/*
 * LazyComponent
 * React.js 컴포넌트 레이지 로딩을 위한 모듈
 */
import React, { ComponentState } from 'react';

type ReactComponent<P, S> = React.ComponentClass<P, S> | React.FunctionComponent<P>;
type Factory<T> = () => Promise<{ default: T }>;
type Fallback = React.ComponentType<any> | JSX.Element;

/**
 * LazyComponent
 * React.lazy() 와 React.Suspense 컴포넌트를 이용하여 lazy로딩을 구현한 함수형 컴포넌트를 리턴한다.
 *
 * @param factory {Factory}
 * @param fallback {Fallback}
 * @param props {object}
 * @returns {React.ComponentClass<P, any>}
 */
export function LazyComponent<T extends ReactComponent<P, S>, P = {}, S = ComponentState> (
  factory: Factory<T>,
  fallback?: Fallback,
  props?: P,
): React.FunctionComponent<P> {
  const Component: any = React.lazy<T>(factory);

  return () => (
    <React.Suspense fallback={fallback ?? <div>Loading...</div>}>
      <Component {...props}/>
    </React.Suspense>
  );
}
