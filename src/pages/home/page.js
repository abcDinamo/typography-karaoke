import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import _ from 'lodash';
import client from '../../common/store/Contentful';
import marked from 'marked';

import styles from "./style.css";

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    var self = this;

    this.state = {
      fonts: this.props.fontStore.fonts,
      content: ''
    };

    client.getEntries({
      'content_type': 'page',
      'fields.title': 'Home'
    })
    .then(function (entries) {
      var content = _.get(entries, 'items[0].fields.content');
      self.setState({ content });
    })
    .catch(function(error) {
      console.error(error);
    });
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
      <div id="content">
        <ul className={ styles.directory }>
          { fontItems }
        </ul>
        <div className={ styles['page-content'] } dangerouslySetInnerHTML={{__html: marked(this.state.content)}}>
        </div>
      </div>
    );
  }
}