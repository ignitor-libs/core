/*
 * LazyComponent
 * React.js 컴포넌트 레이지 로딩을 위한 모듈
 */
import React from 'react';

declare type ReactComponent = React.ComponentClass<any, any> | React.FunctionComponent<any>;
declare type Factory<T extends ReactComponent> = () => Promise<{ readonly default: T }> | Promise<any>; // Promise<any>는 jsx을 위해 추가
declare type Fallback = React.ComponentType<any> | JSX.Element;

/**
 * LazyComponent
 * React.lazy() 와 React.Suspense 컴포넌트를 이용하여 lazy로딩을 구현한 함수형 컴포넌트를 리턴한다.
 *
 * @param factory {Factory}
 * @param fallback {Fallback}
 * @param props {object}
 * @returns {React.ComponentClass<P, any>}
 */
export function LazyComponent<T extends ReactComponent, P = {}> (factory: Factory<T>, fallback?: Fallback, props?: React.ComponentProps<any>): React.FunctionComponent<any> {
  const Component: React.LazyExoticComponent<T> = React.lazy(factory);

  return () => (
    <React.Suspense fallback={fallback ?? <div>Loading...</div>}>
      <Component {...props}/>
    </React.Suspense>
  );
}
