import $ from 'jquery';
import _ from 'lodash';

import React from 'react';
import ReactDom from 'react-dom';
import ReactVTT from 'react-vtt';
import Cue from 'react-vtt';
import FontFaceObserver from 'fontfaceobserver';

import VideoTrack from '../../common/components/VideoTrack';

import styles from "./style.css";

const CLICK = 1;
const SPACE = 32;

export default class KaraokePage extends React.Component {
  constructor(props) {
    super(props);

    var track = this.fetchTrack();
    var font = this.fetchFont();

    this.state = {
      track: track,
      font: font,
      isPlaying: true,
      trackIsLoaded: !!track,
      fontIsLoaded: false,
      cues: {},
      activeCue: null,
      currentTime: 0
    };

    this.updateTick = null

    this.updateKaraoke = this.updateKaraoke.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
  }

  fetchTrack() {
    // return this.props.trackStore.getTrackByName("If You're Happy and You Know It");
    return this.props.trackStore.tracks.length ? this.props.trackStore.getRandom() : null;
  }

  fetchFont() {
    return this.props.fontStore.fonts.length ? this.props.fontStore.getFontByName(this.props.params.id) : null;
  }

  togglePlay(toState = null) {
    var toggleState = toState === null ? !this.state.isPlaying : toState;
    var toggleMethod = toggleState ? 'play' : 'pause';

    // only change the state if we can change the element's state
    if(this.refs.audio) {
      this.refs.audio[toggleMethod]();
      this.setState({
        isPlaying: toggleState
      });
    }
  }

  play() {
    this.togglePlay(true);
  }

  pause() {
    this.togglePlay(false);
  }

  handleTogglePlay(event) {
    if (event.which === CLICK || event.which === SPACE) {
      this.togglePlay();
    }
  }

  updateKaraoke() {
    var updates = {
      currentTime: this.refs.audio.currentTime
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

  initRecording() {
    var self = this;

    if(this.isLoading()) {
      return;
    }

    ReactVTT.parse(ReactVTT.fromSelectorOrPath('track#cues'), function(videoCues) {
      self.setState({
        cues: videoCues
      });
      self.updateTick = requestAnimationFrame(self.updateKaraoke);
      self.play();
    });
  }

  isLoading(otherState) {
    var state = otherState ? otherState : this.state;
    return !state.fontIsLoaded || !state.trackIsLoaded;
  }

  componentWillReceiveProps(nextProps) {
    var track = this.fetchTrack();
    var font = this.fetchFont();

    this.setState({
      track: track,
      font: font,
      isPlaying: true,
      trackIsLoaded: !!track
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state.track, nextState.track) || this.isLoading() !== this.isLoading(nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    this.initRecording();
  }

  componentDidMount() {
    var self = this;
    var $window = $(window);

    $window.on('keydown click touch', this.handleTogglePlay);

    // wait for our font to load and then update when it has
    // pretty hacky
    var font = new FontFaceObserver(this.props.params.id);
    font.load(null, 5000)
    .then(function () {
      // set that we have loaded the font
      self.setState({
        fontIsLoaded: true
      })
    })
    .catch(function() {
      // something wrong, try reloading the page
      window.location.reload();
    });

    //  http://stackoverflow.com/questions/30855662/inline-html5-video-on-iphone
    //  FIXME play audio and then seek video...
    // this.refs.video.setAttribute('webkit-playsinline', '');
  }

  componentWillUnmount() {
    var $window = $(window);

    window.cancelAnimationFrame(this.updateTick);
    $window.off('keydown click touch');
  }

  render() {
    var fontFace = '';

    if(this.state.font) {
      var fontFace = `
        @font-face {
          font-family: "${this.state.font.name}";
          src: url("${this.state.font.url}") format("opentype");
          font-weight: normal;
          font-style: normal;
        }

        .kfont {
          font-family: "${this.state.font.name}";
        }
      `;
    }

    if(this.isLoading()) {
      return (
        <div id="content" className={ styles.content }>
          <style>
            { fontFace }
          </style>
          <p>loading...</p>
        </div>
      );
    }

    return (
      <div id="content" className={ styles.content + ' kfont' }>
        <style>
          { fontFace }
        </style>

        <audio ref="audio" className={ styles.audio } loop>
          <source src={ this.state.track.recording } type="video/mp4"/>
        </audio>
        <video ref="video" className={ styles.video }>
            <source src={ this.state.track.recording } type="video/mp4"/>
            <track id="cues" kind="subtitles" src={ this.state.track.getSubtitlesUrl() } srcLang="en" label="English" default/>
        </video>
        <div id="video-vtt">
          <VideoTrack/>
        </div>
      </div>
    );
  }
}

