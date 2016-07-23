import React from 'react';
import Cue from './Cue';

var CueFactory = React.createFactory(Cue);

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
        <Cue { ...datum }>{ datum.text }</Cue>
      );
    });

    return (
      <div className="video-track">
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

