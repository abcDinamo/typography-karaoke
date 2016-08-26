import React from 'react';
import ReactDom from 'react-dom';
import ReactVTT from 'react-vtt';
import Cue from 'react-vtt';

import VideoTrack from '../../common/components/VideoTrack';
import trackStore from '../../common/store/TrackStore';
import fontStore from '../../common/store/FontStore';

import styles from "./style.css";

export default class KaraokePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      track: trackStore.getRandom(),
      font: fontStore.getFontByName(this.props.params.id),
      updateTick: null
    };
  }

  // FIXME refactor
  componentDidMount() {
    var self = this;

    this.video = document.getElementsByTagName('video')[0];

    ReactVTT.parse(ReactVTT.fromSelectorOrPath('track#recording'), function(videoCues) {
        var update, karaoke, updateKaraoke; //audioTrack, updateAudio;

        karaoke = ReactDom.render(<VideoTrack/>, document.getElementById('video-vtt'));

        updateKaraoke = function(time, cues) {
          var cue;
          cue = cues.activeCues[0] || {
            startTime: 0,
            endTime: 0
          };
          if (cues.activeCues[0]) {
            karaoke = ReactDom.render(<VideoTrack data={ReactVTT.separate(cues.activeCues[0])} currentTime={time}/>, document.getElementById('video-vtt'));
          }
        };

        update = function() {
          var videoTime, audioTime;
          videoTime = self.video.currentTime;
          videoCues.update(videoTime);
          updateKaraoke(videoTime, videoCues);
          self.state.updateTick = requestAnimationFrame(update);
          return self.state.updateTick;
        };
        self.state.updateTick = requestAnimationFrame(update);
    });
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.state.updateTick)
  }

  render() {
    return (
      <div className={ styles.content }>
        <video className={ styles.video } autoPlay loop>
            <source src={ this.state.track.recording } type="video/mp4"/>
            <track id="recording" kind="subtitles" src={ this.state.track.getSubtitlesUrl() } srcLang="en" label="English" default/>
        </video>
        <div id="video-vtt" className={ this.state.font.id }></div>
      </div>
    );
  }
}

