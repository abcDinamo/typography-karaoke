import _ from 'lodash';
import mColors from 'material-colors';

import Font from './Font';

class FontStore {
  constructor() {
    this.fonts = [];
  }

  addFont(font) {
    this.fonts.push(font);
  }

  getFontByName(name) {
    return _.find(this.fonts, ['name', name]);
  }
}

var colors = _.transform(mColors, function(result, value, key) {
  if(key.indexOf('Text') >= 0
    || key.indexOf('black') >= 0
    || key.indexOf('white') >= 0
    || key.indexOf('Icons') >= 0) {
    return result;
  }

  result.push(value['500']);
}, []);

colors = _.shuffle(colors);

var fontStore = new FontStore();
fontStore.addFont(new Font('gothic-bold-loose-lkerned', 'Gothic Bold Loose Ikerned', colors[0]));
fontStore.addFont(new Font('inhouse-gothic', 'Inhouse Gothic', colors[1]));
fontStore.addFont(new Font('lapidar-mittel', 'Lapidar Mittel', colors[2]));
fontStore.addFont(new Font('pegasus-regular', 'Pegasus Regular', colors[3]));
fontStore.addFont(new Font('roma', 'Roma', colors[4]));
fontStore.addFont(new Font('weissfalk-regular', 'WeissFalk Regular', colors[5]));

export default fontStore;
