# Ignitor core
![npm](https://img.shields.io/npm/v/@ignitor/core)
![node](https://img.shields.io/node/v/@ignitor/core)
![types](https://img.shields.io/npm/types/@ignitor/core)
![downloads](https://img.shields.io/npm/dw/@ignitor/core)
![license](https://img.shields.io/npm/l/@ignitor/core)

React/Redux Ignitor for development with less configuration.

> This project has been created by [Vessel CLI](https://www.npmjs.com/package/@mornya/vessel).
  For a simple and quick reference about it, click [here](https://mornya.github.io/documents/guide/vessel.md).

## About
React와 Redux, ServiceWorker 등 애플리케이션 개발에 필요한 기초 요소들에 대한 헬퍼 라이브러리.

## Installation
해당 라이브러리를 사용 할 프로젝트에서는 아래와 같이 의존성 모듈로 설치한다.
```bash
$ npm install --save @ignitor/core
or
$ yarn add @ignitor/core
```

## Modules in the package
본 패키지에는 아래와 같은 모듈들을 포함한다.<br>
제공되는 모듈과 메소드 사용법 등은 코드 스니핏을 참고한다.

### Ignitor module
HMR, Redux, Redux Middleware, Service Worker 등에 대한 처리 모듈

### LazyComponent module
React.lazy / React.Suspend를 이용하여 lazy component loading을 구현한 모듈

### ReduxStore module
Redux store 생성, 응용을 위한 메소드 제공

### ReduxMockStore module
테스트 환경에서 Redux Store에 대한 mock store를 제공하기 위한 래핑 함수

## Change Log
프로젝트 변경사항은 [CHANGELOG.md](CHANGELOG.md) 파일 참조.

## License
프로젝트 라이센스는 [LICENSE](LICENSE) 파일 참조.
