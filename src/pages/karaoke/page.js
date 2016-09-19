import _ from 'lodash';

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

    var track = this.fetchTrack();
    var font = this.fetchFont();
    var isPlaying = true;
    var isLoading = !track || !font;

    this.state = {
      track: track,
      font: font,
      isPlaying: isPlaying,
      isLoading: isLoading,
      cues: {},
      activeCue: null,
      currentTime: 0
    };

    this.updateTick = null

    this.updateKaraoke = this.updateKaraoke.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
  }

  fetchTrack() {
    return this.props.trackStore.tracks.length ? this.props.trackStore.getRandom() : null;
  }

  fetchFont() {
    return this.props.fontStore.fonts.length ? this.props.fontStore.getFontByName(this.props.params.id) : null;
  }

  updateKaraoke() {
    var updates = {
      currentTime: this.refs.video.currentTime
    };

    this.state.cues.update(updates.currentTime);
    if(this.state.cues.activeCues[0]) {
      updates.activeCue = this.state.cues.activeCues[0];
    }

    this.setState(updates);

    if(updates.activeCue && this.state.isPlaying) {
      ReactDom.render(<VideoTrack data={ ReactVTT.separate(this.state.activeCue) } currentTime={ this.state.currentTime } color={ this.state.font.color }/>, document.getElementById('video-vtt'));
    }

    this.updateTick = requestAnimationFrame(this.updateKaraoke);
  }

  togglePlay(toState = null) {
    var toggleState = toState === null ? !this.state.isPlaying : toState;
    var toggleMethod = toggleState ? 'play' : 'pause';

    this.refs.video[toggleMethod]();
    this.setState({
      isPlaying: toggleState
    });
  }

  play() {
    this.togglePlay(true);
  }

  pause() {
    this.togglePlay(false);
  }

  handleTogglePlay(event) {
    // click or space
    if (event.which === 1 || event.which === 32) {
      this.togglePlay();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);

    var track = this.fetchTrack();
    var font = this.fetchFont();

    this.setState({
      track: track,
      font: font,
      isPlaying: true,
      isLoading: !track || !font,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state.track, nextState.track);
  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate(prevProps, prevState) {
    this.componentDidMount();
  }

  // FIXME refactor
  componentDidMount() {
    var self = this;

    window.addEventListener("keydown", this.handleTogglePlay);
    window.addEventListener("click", this.handleTogglePlay);
    window.addEventListener("touch", this.handleTogglePlay);

    if(this.state.isLoading) {
      return;
    }

    // got to do this because react strips out unknown attributes
    // why do people use this framework?
    //  http://stackoverflow.com/questions/30855662/inline-html5-video-on-iphone
    //  FIXME play audio and then seek video...
    this.refs.video.setAttribute('webkit-playsinline', '');
    // makeVideoPlayableInline(this.refs.video);


    // get and parse all queues
    // save queues to state
    // TODO isLoading also takes into consideration loading of queues

    ReactVTT.parse(ReactVTT.fromSelectorOrPath('track#recording'), function(videoCues) {
      self.setState({
        cues: videoCues
      });
      self.updateTick = requestAnimationFrame(self.updateKaraoke);
      self.play();
    });

  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.updateTick);
    window.removeEventListener("keydown", this.handleTogglePlay);
    window.removeEventListener("click", this.handleTogglePlay);
    window.removeEventListener("touch", this.handleTogglePlay);
  }

  render() {

    if(this.state.isLoading) {
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
        <audio ref="masterAudio" className={ styles.audio }>
          <source src={ this.state.track.recording } type="video/mp4"/>
        </audio>
        <video ref="video" className={ styles.video } autoPlay loop>
            <source src={ this.state.track.recording } type="video/mp4"/>
            <track id="recording" kind="subtitles" src={ this.state.track.getSubtitlesUrl() } srcLang="en" label="English" default/>
        </video>
        <div id="video-vtt" className={ 'kfont' }>
          <VideoTrack/>
        </div>
      </div>
    );
  }
}

