/*
 * ServiceWorker
 * (!) Ignitor 모듈에서 내부적으로 사용하므로 export 하지 않는다.
 *
 * Register a service worker to serve assets from local cache.
 *
 * This lets the app load faster on subsequent visits in production, and gives
 * it offline capabilities. However, it also means that developers (and users)
 * will only see deployed updates on subsequent visits to a page, after all the
 * existing tabs open on the page have been closed, since previously cached
 * resources are updated in the background.
 */
export namespace ServiceWorker {
  export type Config = {
    url: string;
    file?: string;
    registrationOptions?: ServiceWorkerRegistration;
    onReady? (): void;
    onUpdate? (registration: ServiceWorkerRegistration): void;
    onSuccess? (registration: ServiceWorkerRegistration): void;
    onError? (error: string): void;
  }

  const defaultConfig: Config = {
    url: '/',
    file: 'service-worker.js',
    onReady () {
      console.info('[ServiceWorker] This web app is being served cache-first.');
    },
    onUpdate (/*registration*/) {
      console.info('[ServiceWorker] New content is available and will be used when all tabs for this page are closed.');
    },
    onSuccess (/*registration*/) {
      console.info('[ServiceWorker] Content is successfully cached for offline use.');
    },
    onError (error) {
      console.error('[ServiceWorker] Error during registration:', error);
    },
  };

  function isLocalhost (): boolean {
    return Boolean(
      window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
      ),
    );
  }

  function registerValidSW (option: Config): void {
    navigator.serviceWorker
      .register(`${option.url}${option.file}`, option.registrationOptions)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the updated precached content has been fetched,
                // but the previous service worker will still serve the older
                // content until all client tabs are closed.
                if (option?.onUpdate) {
                  option.onUpdate(registration);
                }
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // "Content is cached for offline use." message.
                if (option?.onSuccess) {
                  option.onSuccess(registration);
                }
              }
            }
          };
        };
        return null;
      })
      .catch((error: string) => {
        if (option?.onError) {
          option.onError(error);
        }
      });
  }

  function checkValidServiceWorker (option: Config): void {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(`${option.url}${option.file}`)
      .then((response: Response) => {
        // Ensure service worker exists, and that we really are getting a JS file.
        const contentType = response.headers.get('content-type');
        if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
          // No service worker found. Probably a different app. Reload the page.
          return navigator.serviceWorker.ready;
        }
        // Service worker found. Proceed as normal.
        registerValidSW(option);
        return null;
      })
      .then((registration: ServiceWorkerRegistration | null) => registration ? registration.unregister() : null)
      .then(window.location.reload)
      .catch(() => {
        if (option?.onError) {
          option.onError('No internet connection found. App is running in offline mode.');
        }
      });
  }

  /**
   * register
   * 서비스워커 등록.
   *
   * @param config {Config}
   */
  export function register (config?: Config): void {
    const option = { ...defaultConfig, ...config };

    if ('serviceWorker' in navigator) {
      // The URL constructor is available in all browsers that support SW.
      const publicUrl = new URL(option.url, window.location.href);

      if (publicUrl.origin !== window.location.origin) {
        // Our service worker won't work if PUBLIC_URL is on a different origin
        // from what our page is served on. This might happen if a CDN is used to
        // serve assets; see https://github.com/facebook/create-react-app/issues/2374
        if (option?.onError) {
          option.onError('Service worker won\'t work on a different origin from what our page is served on.');
        }
        return;
      }

      window.addEventListener('load', () => {
        if (isLocalhost()) {
          // This is running on localhost. Let's check if a service worker still exists or not.
          checkValidServiceWorker(option);

          // Add some additional logging to localhost, pointing developers to the
          // service worker/PWA documentation.
          navigator.serviceWorker.ready
            .then(() => {
              if (option?.onReady) {
                option.onReady();
              }
              return null;
            })
            .catch((error: string) => console.error('[ServiceWorker] Error on register', error));
        } else {
          // Is not localhost. Just register service worker
          registerValidSW(option);
        }
      });
    }
  }

  /**
   * unregister
   * 서비스워커 해제.
   */
  export function unregister (): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => registration.unregister())
        .catch((error: string) => console.error('[ServiceWorker] Error on unregister', error));
    }
  }
}
