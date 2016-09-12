import React from 'react';
import ReactDom from 'react-dom';
import ReactVTT from 'react-vtt';
import Cue from 'react-vtt';
import makeVideoPlayableInline from 'iphone-inline-video';

import VideoTrack from '../../common/components/VideoTrack';

import styles from "./style.css";

export default class KaraokePage extends React.Component {
  constructor(props) {
    super(props);

    // FIXME differentiate between loading and playing
    this.state = {
      track: this.props.trackStore.tracks.length ? this.props.trackStore.getRandom() : null,
      font: this.props.fontStore.fonts.length ? this.props.fontStore.getFontByName(this.props.params.id) : null,
      playing: this.props.trackStore.tracks.length && this.props.fontStore.fonts.length,
      updateTick: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      track: this.props.trackStore.tracks.length ? this.props.trackStore.getRandom() : null,
      font: this.props.fontStore.fonts.length ? this.props.fontStore.getFontByName(this.props.params.id) : null,
      playing: this.props.trackStore.tracks.length && this.props.fontStore.fonts.length,
    })
  }

  componentWillUpdate(nextProps, nextState) {
    this.componentDidMount();
  }

  // FIXME refactor
  componentDidMount() {
    var self = this;

    if(!this.state.playing) {
      return;
    }

    // got to do this because react strips out unknown attributes
    // why do people use this framework?
    this.refs.video.setAttribute('webkit-playsinline', '');
    makeVideoPlayableInline(this.refs.video);

    if(this.state.playing) {
      this.refs.video.play();
    }

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
            karaoke = ReactDom.render(<VideoTrack data={ReactVTT.separate(cues.activeCues[0])} currentTime={time} color={self.state.font.color}/>, document.getElementById('video-vtt'));
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

    if(!this.state.font || !this.state.track) {
      return (<p>loading...</p>);
    }

    // FIXME preload all the fonts
    var fontFace = `
      @font-face {
        font-family: "${this.state.font.id}";
        src: url("${this.state.font.url}") format("opentype");
        font-weight: normal;
        font-style: normal;
      }

      .kfont {
        font-family: "${this.state.font.id}";
      }
    `;

    return (
      <div className={ styles.content }>
        <style>
          {fontFace}
        </style>
        <video ref="video" className={ styles.video } autoPlay loop>
            <source src={ this.state.track.recording } type="video/mp4"/>
            <track id="recording" kind="subtitles" src={ this.state.track.getSubtitlesUrl() } srcLang="en" label="English" default/>
        </video>
        <div id="video-vtt" className={ 'kfont' }></div>
      </div>
    );
  }
}

