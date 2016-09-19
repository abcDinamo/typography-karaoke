import React from 'react';
import Cue from './Cue';

import styles from "../videotrack.css";

class VideoTrack extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'VideoTrack';
  }

  render() {
    var self = this;

    var cues = this.props.data.map(function(datum, index) {
      datum.key = index;
      datum.currentTime = self.props.currentTime;

      return (
        <Cue { ...datum } color={ self.props.color }>{ datum.text }</Cue>
      );
    });

    return (
      <div className={ styles['video-track'] }>
        { cues }
      </div>
    );
  }
}

VideoTrack.defaultProps = {
  data: [],
  currentTime: 0
};

export default VideoTrack;

