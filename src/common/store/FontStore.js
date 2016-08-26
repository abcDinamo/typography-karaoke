import _ from 'lodash';

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

var fontStore = new FontStore();
fontStore.addFont(new Font('gothic-bold-loose-lkerned', 'Gothic Bold Loose Ikerned'));
fontStore.addFont(new Font('inhouse-gothic', 'Inhouse Gothic'));
fontStore.addFont(new Font('lapidar-mittel', 'Lapidar Mittel'));
fontStore.addFont(new Font('pegasus-regular', 'Pegasus Regular'));
fontStore.addFont(new Font('roma', 'Roma'));
fontStore.addFont(new Font('weissfalk-regular', 'WeissFalk Regular'));

export default fontStore;
