import React from 'react';
import fontStore from '../store/FontStore';
import trackStore from '../store/TrackStore';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontStore: fontStore,
      trackStore: trackStore
    };

    this.onAdd = this.onAdd.bind(this);

    this.state.fontStore.registerOnAddCallback(this.onAdd);
    this.state.trackStore.registerOnAddCallback(this.onAdd);
  }

  onAdd(thing) {
    // every time a new thing is addded, propagate the changes down
    // FIXME probably shouldn't do this every time
    this.setState({
      fontStore: fontStore,
      trackStore: trackStore
    });
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, { fontStore: fontStore, trackStore: trackStore });
    });

    return (
      <div id="container">
        { childrenWithProps }
      </div>
    );
  }
}
