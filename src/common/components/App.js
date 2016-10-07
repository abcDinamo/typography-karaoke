import React from 'react';
import fontStore from '../store/FontStore';
import trackStore from '../store/TrackStore';
import { RouteTransition } from 'react-router-transition';
import spring from 'react-motion/lib/spring';

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
        <RouteTransition
          pathname={this.props.location.pathname}
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: spring(0, { stiffness: 200, damping: 22 }) }}
          atActive={{ opacity: spring(1, { stiffness: 200, damping: 22 }) }}
        >
          { childrenWithProps }
        </RouteTransition>
      </div>
    );
  }
}
