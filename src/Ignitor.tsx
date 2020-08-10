/*
 * Ignitor
 * React.js 애플리케이션 부트스트랩을 위한 모듈
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ServiceWorker } from './ServiceWorker';
import { ReduxStore } from './ReduxStore';

export namespace Ignitor {
  declare type RouterClass = React.ComponentClass<any>;

  export type Option = {
    application: {
      component: any;
      rootElementId?: string;
      onHotReload (next: () => void): void;
      onAfterReload? (): void;
      onBeforeUnload? (): void;
      onRender? (): void;
    };
    router?: {
      isUseBrowserRouter: boolean;
      basename?: string;
    };
    store?: ReduxStore.Option | null;
    serviceWorker?: {
      isUse: boolean;
      isUnregisterOnUnload?: boolean;
      config?: ServiceWorker.Config;
    },
    isLogInfo?: boolean | undefined;
  }

  const defaultIgnitorOption: Option = {
    application: {
      component: null,
      rootElementId: 'app',
      onHotReload () {
        logInfo('The "onHotReload" function is not implemented!');
      },
    },
    router: {
      isUseBrowserRouter: true,
      basename: '',
    },
    store: null,
    serviceWorker: {
      isUse: process.env.NODE_ENV === 'production',
      isUnregisterOnUnload: true,
      config: {
        url: process.env.PUBLIC_PATH ?? '/',
        file: 'service-worker.js',
      },
    },
    isLogInfo: true,
  };

  /**
   * logInfo
   * - cannot use arrow function
   * @param _
   */
  function logInfo (..._: string[]): void {
    const args = Array.prototype.slice.call(arguments);
    console.info('[%cIgnitor%c]', 'color:magenta;font-weight:bold', 'color:inherit;font-weight:normal', ...args);
  }

  /**
   * init
   * Ignitor 초기화 함수
   *
   * @param ignitorOption {Option}
   */
  export function initialize (ignitorOption: Option): void {
    const option = { ...defaultIgnitorOption, ...ignitorOption };

    // Title message
    if (option.isLogInfo) {
      console.info(
        '\n%cReact Ignitor\n%cCopyright 2020. mornya. All rights reserved.\n',
        'color:magenta;font-weight:bold',
        'color:purple;font-weight:bold',
      );
    }

    /**
     * ===== 초기화 =====
     */
    // 루트 컴포넌트가 적재될 element ID
    if (option.isLogInfo) {
      logInfo(`Application was loading in document "#${option.application.rootElementId}"`);
    }

    // <html lang=""> 속성 미존재시 등록
    const elHTML = document.querySelector('html');
    if (elHTML && !elHTML.getAttribute('lang')) {
      elHTML.setAttribute('lang', navigator.language);
    }

    // Redux 미들웨어 설정 및 초기 상태 등을 설정
    let store: ReduxStore.Store | null = null;
    if (option.store) {
      store = ReduxStore.create(option.store);
      if (option.isLogInfo) {
        logInfo('Created Redux store');
      }
    }

    // 서비스워커 사용시 등록
    if (option.serviceWorker?.isUse) {
      if (option.isLogInfo) {
        option.serviceWorker.config = {
          url: './',
          onReady: () => logInfo('Service Worker is ready.'),
          ...option.serviceWorker.config,
        };
      }
      ServiceWorker.register(option.serviceWorker.config);

      // 페이지 unload시 서비스워커 등록해제 처리
      window.onunload = () => {
        if (option.serviceWorker?.isUnregisterOnUnload) {
          // ServiceWorker 등록 해제
          if (option.isLogInfo) {
            logInfo('Unregistering Service Worker.');
          }
          ServiceWorker.unregister();
        }

        // 기본적으로 onBeforeUnload 실행
        option.application.onBeforeUnload?.();
      };
    }

    // First render modules
    const Router: RouterClass = option.router?.isUseBrowserRouter ? BrowserRouter : HashRouter;
    const rootRenderer = (AppContent: any): void => {
      ReactDOM.render(
        (
          <AppContainer>
            {store ? (
              <Provider store={store}>
                <Router basename={option.router?.basename}>
                  <AppContent/>
                </Router>
              </Provider>
            ) : (
              <Router basename={option.router?.basename}>
                <AppContent/>
              </Router>
            )}
          </AppContainer>
        ),
        document.getElementById(option.application.rootElementId ?? 'app'),
        option.application.onRender,
      );
    };

    option.application.component()
      .then((component: any) => rootRenderer(component.default))
      .catch((error: Error) => console.error(error));

    // When re-rendered by HMR (development only)
    option.application.onHotReload(
      () => {
        if (option.isLogInfo) {
          logInfo('HMR is accepted the updated modules...');
        }

        option.application.component()
          .then((component: any) => {
            rootRenderer(component.default);
            option.application.onAfterReload?.();
            return null;
          })
          .catch((error: Error) => console.error(error));
      });
  }
}
