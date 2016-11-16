import _ from 'lodash';

import Track from './Track';
import client from './Contentful';

var path = "";

class TrackStore {
  constructor() {
    this.tracks = [];
    this.onAddCallbacks = [];
  }

  addTrack(track) {
    this.tracks.push(track);

    _.each(this.onAddCallbacks, function(func) {
      func(track);
    });
  }

  registerOnAddCallback(func) {
    this.onAddCallbacks.push(func);
  }

  getRandom() {
    return _.sample(this.tracks);
  }

  getTrackByName(name) {
    return _.find(this.tracks, ['name', name]);
  }
}

var trackStore = new TrackStore();

client.getEntries({ content_type: 'audio' })
.then(function (entries) {
  entries.items.forEach(function (entry, index) {
    var subtitlesDataURI = 'data:text/vtt;base64,' + btoa(unescape(encodeURIComponent(entry.fields.subtitles)));
    trackStore.addTrack(new Track(entry.sys.id, entry.fields.name, entry.fields.track.fields.file.url, subtitlesDataURI));
  });
});

export default trackStore;
