import React from 'react';
import ReactDom from 'react-dom';
import ReactVTT from 'react-vtt';
import Cue from 'react-vtt';

import VideoTrack from '../../common/components/VideoTrack';
import trackStore from '../../common/store/TrackStore';

import styles from "./style.css";

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    // this.props.params.id

    this.state = {
      track: trackStore.getRandom()
    };

    console.log(this)
  }

  // FIXME refactor
  componentDidMount() {
    var self = this;

    this.video = document.getElementsByTagName('video')[0];

    ReactVTT.parse(ReactVTT.fromSelectorOrPath('track#recording'), function(videoCues) {
        var update, karaoke, updateKaraoke; //audioTrack, updateAudio;

        karaoke = ReactDom.render(<VideoTrack/>, document.getElementById('video-vtt'));
        console.dir(karaoke)

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
          return requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    });
  }

  render() {
    return (
      <div className={styles.content}>
        <video className={ styles.video } autoPlay loop>
            <source src={ this.state.track.recording } type="video/mp4"/>
            <track id="recording" kind="subtitles" src={ this.state.track.getSubtitlesUrl() } srcLang="en" label="English" default/>
        </video>
        <div id="video-vtt"></div>
      </div>
    );
  }
}

