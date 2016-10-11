import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import _ from 'lodash';
import $ from 'jquery';

import styles from "./style.css";

export default class TestPage0 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fonts: this.props.fontStore.fonts
    };
  }

  componentWillMount() {
    console.log($('body'))
    $('body').attr('class', '').addClass('test0');
  }

  render() {
    var fontItems = _.map(this.state.fonts, function(font, index) {
      var link = '/karaoke/' + font.name;

      return (
        <li key={ index } style={{ backgroundColor: font.color }}>
          <Link to={ link }>
            <p>{ font.name }</p>
          </Link>
        </li>
      );
    });

    return (
      <div>
        <ul className={ styles.directory }>
          { fontItems }
        </ul>
        <address>
          <p>Standard Typefaces Int'l</p>
          <p>For inquiries please contact</p>
          <a target="_blank" href="mailto:mail@standardtype.xyz">mail@standardtype.xyz</a>
        </address>
      </div>
    );
  }
}