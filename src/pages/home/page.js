import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import _ from 'lodash';
import mColors from 'material-colors';

import fontStore from '../../common/store/FontStore.js'

import styles from "./style.css";

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fonts: fontStore.fonts
    };

    this.colors = _.transform(mColors, function(result, value, key) {
      if(key.indexOf('Text') >= 0
        || key.indexOf('black') >= 0
        || key.indexOf('white') >= 0
        || key.indexOf('Icons') >= 0) {
        return result;
      }
      result.push(value['500'])
    }, []);
  }

  render() {
    var path = '/';
    if(window.location.href.indexOf('github') >= 0) {
      path = path + 'typography-karaoke/';
    }

    var colors = _.sampleSize(this.colors, this.state.fonts.length);
    var fontItems = _.map(this.state.fonts, function(font, index) {
      var link = path + 'karaoke/' + font.name;
      var style = 'background-color:' + colors[index];

      return (
        <li style={{ backgroundColor: colors[index] }}>
          <Link to={ link }>
            <p>{ font.name }</p>
          </Link>
        </li>
      );
    });

    return (
      <ul className={ styles.directory }>
        { fontItems }
        <li>
          <address>
            Standard Typefaces Int'l<br/>
            For inquiries please contact<br/>
            <a href="mailto:mail@standardtype.xyz">mail@standardtype.xyz</a><br/>
          </address>
        </li>
      </ul>
    );
  }
}