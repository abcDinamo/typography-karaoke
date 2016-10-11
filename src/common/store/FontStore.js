import _ from 'lodash';
import mColors from 'material-colors';

import Font from './Font';
import client from './Contentful';

class FontStore {
  constructor() {
    this.fonts = [];
    this.onAddCallbacks = [];
  }

  registerOnAddCallback(func) {
    this.onAddCallbacks.push(func);
  }

  addFont(font) {
    this.fonts.push(font);

    _.each(this.onAddCallbacks, function(func) {
      func(font);
    });
  }

  getFontByName(name) {
    return _.find(this.fonts, ['name', name]);
  }
}

var colors = _.shuffle(['#00bcff', '#ff8200', '#ffd400', '#1865ff', '#ffaedd', '#3fa535', '#690041', '#ff372b']);
var fontStore = new FontStore();

client.getEntries({ content_type: 'font' })
.then(function (entries) {
  entries.items.forEach(function (entry, index) {
    fontStore.addFont(new Font(entry.sys.id, entry.fields.name, entry.fields.description, entry.fields.sources[0].fields.file.url, colors[index]));
  });
});

export default fontStore;
