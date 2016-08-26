import _ from 'lodash';

import Track from './Track';

import alphabetTrack from '../../assets/music/01-Alphabet-Song/track.mp4';
import alphabetSubtitles from '../../assets/music/01-Alphabet-Song/subtitles.vtt';

import frereTrack from '../../assets/music/02-Frere-Jacques/track.mp4';
import frereSubtitles from '../../assets/music/02-Frere-Jacques/subtitles.vtt';

import happyTrack from '../../assets/music/03-If-you-are-Happy/track.mp4';
import happySubtitles from '../../assets/music/03-If-you-are-Happy/subtitles.vtt';

class TrackStore {
  constructor() {
    this.tracks = [];
  }

  addTrack(track) {
    this.tracks.push(track);
  }

  getRandom() {
    return _.sample(this.tracks);
  }

  getTrackById(id) {
    // FIXME for now this works because it's just 3 things
    return _.find(this.tracks, ['id', id]);
  }
}

var trackStore = new TrackStore();
trackStore.addTrack(new Track('Alphabet Song', 'Alphabet Song', alphabetTrack, alphabetSubtitles));
trackStore.addTrack(new Track('Frere Jacques', 'Frere Jacques', frereTrack, frereSubtitles));
trackStore.addTrack(new Track('If you are Happy', 'If you are Happy', happyTrack, happySubtitles));

export default trackStore;