import React from 'react';

import styles from "../cue.css";

class Cue extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Cue';
  }

  render() {
    var duration = this.props.endTime - this.props.startTime;
    var progress = duration === 0 ? 0 : (this.props.currentTime - this.props.startTime) / duration * 100;

    if (progress < 0) {
      progress = 0;
    }

    if (progress > 100) {
      progress = 100;
    }

    var overlayStyle = {
      width: progress + '%'
    };

    return (
      <div className={ styles.cue }>
        <div className={ styles.children }>
          { this.props.children }
          <div className={ styles.overlay } style={ overlayStyle }>{ this.props.children }</div>
        </div>
      </div>
    );

  }
}

Cue.defaultProps = {
  startTime: 0,
  endTime: 0,
  currentTime: 0
}

export default Cue;
