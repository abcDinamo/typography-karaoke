import $ from 'jquery';
import _ from 'lodash';
import FontFaceObserver from 'fontfaceobserver';

import React from 'react';
import ReactDom from 'react-dom';
import { IndexLink } from 'react-router';

import ReactVTT from '../../common/components/ReactVTT';
import VideoTrack from '../../common/components/VideoTrack';

import styles from './style.css';

const CLICK = 1;
const SPACE = 32;
const ESC = 27;

export default class KaraokePage extends React.Component {
  constructor(props) {
    super(props);

    var track = this.fetchTrack();
    var font = this.fetchFont();

    this.state = {
      track: track,
      font: font,
      isPlaying: false,
      trackIsLoaded: !!track,
      fontIsLoaded: false,
      cues: {},
      activeCue: null,
      currentTime: 0
    };

    this.updateTick = null;

    this.updateKaraoke = this.updateKaraoke.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handleEnded = this.handleEnded.bind(this);
  }

  fetchTrack() {
    if(!this.props.trackStore.tracks.length) {
      return null;
    }

    if(this.props.location.query.track) {
      return this.props.trackStore.getTrackByName(this.props.location.query.track);
    }

    return this.props.trackStore.getRandom();
  }

  fetchFont() {
    return this.props.fontStore.fonts.length ? this.props.fontStore.getFontByName(this.props.params.id) : null;
  }

  togglePlay(toState = null) {
    var toggleState = toState === null ? !this.state.isPlaying : toState;
    var toggleMethod = toggleState ? 'play' : 'pause';
    var overlayMethod = toggleState ? 'addClass' : 'removeClass';

    // only change the state if we can change the element's state
    if(this.refs.audio) {
      $(this.refs.overlay)[overlayMethod]('hide');
      this.refs.audio[toggleMethod]();
      this.setState({
        isPlaying: !this.refs.audio.paused
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
    var $target = $(event.target);

    // if we're trying to go back, don't toggle play
    if ($target.attr('id') === 'back') {
      return;
    }

    switch (event.which) {
      case CLICK:
        this.togglePlay();
        break;
      case SPACE:
        this.togglePlay();
        break;
      case ESC:
        $('#back')[0].click();
        break;
    }
  }

  handleEnded(event) {
    this.props.history.push('/');
  }

  updateKaraoke() {
    // we can't do anything with no audio element
    if (!this.refs.audio) {
      console.warn('no audio to update karaoke');
      return;
    }

    var updates = {
      currentTime: this.refs.audio.currentTime
    };

    this.state.cues.update(updates.currentTime);
    if(this.state.cues.activeCues[0]) {
      updates.activeCue = this.state.cues.activeCues[0];
    }

    this.setState(updates);

    // FIXME maybe avoid doing the above work by checking isPlaying earlier
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
      trackIsLoaded: !!track
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state.track, nextState.track)
      || this.isLoading() !== this.isLoading(nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    this.initRecording();
  }

  componentDidMount() {
    var self = this;
    var $document = $(document);

    $document.on('keyup click touch', this.handleTogglePlay);

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

    // http://stackoverflow.com/questions/30855662/inline-html5-video-on-iphone
  }

  componentWillUnmount() {
    var $document = $(document);

    window.cancelAnimationFrame(this.updateTick);
    $document.off('keyup click touch');
  }

  render() {
    var fontFace = '';
    var overlay = (<div ref="overlay" className={ styles.description }>loading...</div>);

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

      overlay = (
        <div ref="overlay" className={ styles.description }>
          <p>
            { this.state.font.description }
            <a className={ styles.toggle } href="javascript:;">Test { this.state.font.name }</a>
          </p>
        </div>
      );
    }

    if(this.isLoading()) {
      return (
        <div id="content" className={ styles.content }>
          <style>
            { fontFace }
          </style>
          <IndexLink id="back" className={ styles.back } to="/"></IndexLink>
          { overlay }
        </div>
      );
    }

    return (
      <div id="content" className={ styles.content + ' kfont' } onEnded={ this.handleEnded }>
        <style>
          { fontFace }
        </style>
        <IndexLink id="back" className={ styles.back } to="/"></IndexLink>
        <audio ref="audio" className={ styles.audio }>
          <source src={ this.state.track.recording } type={ this.state.track.contentType }/>
        </audio>
        <video ref="video" className={ styles.video }>
            <source src={ this.state.track.recording } type={ this.state.track.contentType }/>
            <track id="cues" kind="subtitles" src={ this.state.track.getSubtitlesUrl() } srcLang="en" label="English" default/>
        </video>
        { overlay }
        <div id="video-vtt">
          <VideoTrack/>
        </div>
      </div>
    );
  }
}

