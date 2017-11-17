class Track {

  constructor(id, name, recording, contentType, subtitles) {
    this.id = id;
    this.name = name;
    this.recording = recording;
    this.contentType = contentType;
    this.subtitles = subtitles;
    this.subtitlesUrl = null;
  }

  // We convert the data URI to a blob URI because safari throws
  // a CORS exception with the data URI
  getSubtitlesUrl() {

    if (this.subtitlesUrl) {
      return this.subtitlesUrl;
    }

    var blob = this.dataURItoBlob(this.subtitles);
    this.subtitlesUrl = window.URL.createObjectURL(blob);

    return this.subtitlesUrl;
  }
}

Track.prototype.dataURItoBlob = function(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export default Track;