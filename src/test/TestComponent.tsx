import React from 'react';

export interface Props {
  value: string;
}

export interface State {
  result: string;
}

export default class TestComponent<T extends Props> extends React.Component<T, State> {
  static defaultProps: Props = {
    value: '',
  };

  state: State = {
    result: '',
  };

  render () {
    return (
      <>
        <p>Test Component {this.props.value}</p>
      </>
    );
  }
}
