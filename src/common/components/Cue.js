import $ from 'jquery';
import _ from 'lodash';

import React from 'react';

import styles from "../cue.css";

class Cue extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Cue';

    this.state = {
      text: this.props.children
    };

    this.lineCache = {};

    this.handleResize = this.handleResize.bind(this);
  }

  mapInRange(value, inMin, inMax, outMin, outMax, constrain = false) {
    var outValue = (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

    if(!constrain) {
      return outValue;
    }

    if(outValue > outMax) {
      return outMax;
    }

    if(outValue < outMin) {
      return outMin;
    }

    return outValue;
  }

  // FIXME don't do this everytime, just when text changes or window is resized
  getLines(text) {
    var $measureContainer = $('#content');
    var $measure = $measureContainer.find('.measure').length ? $measureContainer.find('.measure') : $('<div class="measure kfont"></div>');
    var $widther = $measureContainer.find('.widther').length ? $measureContainer.find('.widther') : $('<div class="measure widther kfont"></div>');
    // MAYBE http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
    // var words = text.split(/\s+/);
    var words = text.split(/(\s+)/);
    var lines = [];
    var height = 0;
    var lastHeightIndex = 0;
    var textSoFar = words[0];
    var currentLine = words[0];
    var currentLineWidthRange = 0;

    $measureContainer.append($measure);
    $measureContainer.append($widther);

    // find the tallest min-height
    // some sources say this is the tallest character
    $measure.text('ƒ');
    var minHeight = $measure.height();
    $measure.css('min-height', minHeight + 'px')

    // start with our text
    $measure.text(textSoFar);
    height = $measure.height();

    for (var i = 1; i < words.length; i++) {
      var newText = textSoFar + words[i];
      $measure.text(newText);

      if($measure.height() > height) {
        $widther.text(currentLine);
        var lineWidth = $widther.width();
        var lineHeight = $widther.height();

        lines.push({
          text: currentLine,
          width: lineWidth,
          height: lineHeight,
          widthRange: [currentLineWidthRange, currentLineWidthRange + lineWidth]
        });

        currentLineWidthRange = currentLineWidthRange + lineWidth
        height = $measure.height();
        lastHeightIndex = i - 1;
        currentLine = words[i];
      } else {
        currentLine = currentLine + words[i];
      }

      textSoFar = newText;
    }

    $widther.text(currentLine);
    var lineWidth = $widther.width();
    var lineHeight = $widther.height();
    lines.push({
      text: currentLine,
      width: lineWidth,
      height: lineHeight,
      widthRange: [currentLineWidthRange, currentLineWidthRange + lineWidth]
    });

    return lines;
  }

  getLinesCached(text) {
    if(this.lineCache[text]) {
      return this.lineCache[text];
    }

    var lines = this.getLines(text);
    this.lineCache[text] = lines;

    return lines;
  }

  handleResize(event) {
    this.lineCache = {};
  }

  componentDidMount() {
    var $window = $(window);

    $window.on('resize orientationchange', this.handleResize);
  }

  componentWillUnmount() {
    var $window = $(window);

    $window.off('resize orientationchange', this.handleResize);
  }

  render() {
    var self = this;
    var duration = this.props.endTime - this.props.startTime;
    var progress = duration === 0 ? 0 : (this.props.currentTime - this.props.startTime) / duration * 100;

    if (progress < 0) {
      progress = 0;
    }

    if (progress > 100) {
      progress = 100;
    }

    if(progress > 99) {
      progress = 100;
    }

    progress = (Math.ceil(progress * 5) / 5).toFixed(2);

    var progressPercent = progress + '%';
    var lines = this.getLinesCached(this.props.children);
    var totalWidth = lines[lines.length - 1].widthRange[1];
    var progressWidth = this.mapInRange(progress, 0, 100, 0, totalWidth);

    var htmlLines = _.map(lines, function(line, index) {
        var lineProgress = self.mapInRange(progressWidth, line.widthRange[0], line.widthRange[1], 0, 100, true);
        var lineProgressPercent = lineProgress.toFixed(2)  + '%';
        var patternId = 'pattern' + index;

        return (
          <svg className={ styles.cueText } key={ index } width={ line.width } height={ line.height } textRendering="geometricPrecision" shapeRendering="geometricPrecision">
            <pattern id={ patternId } patternUnits="userSpaceOnUse" height={ line.height } width="100%">
              <rect style={{fill: self.props.color}} x="0" y="0" height="100" width={ lineProgressPercent }></rect>
              <rect style={{fill: '#fff'}} x={ lineProgressPercent } y="0" height="100" width="100%"></rect>
            </pattern>
            <text x="0" y="50%" dominantBaseline="middle" style={{ fill: 'url(#' + patternId + ')' }}>{ line.text }</text>
          </svg>
        );
    });

    // NOTE: this.props.children is the actual cue text in this case
    return (
      <div className={ styles.cue }>
        <div ref="measureContainer" className={ styles.children }>
          { htmlLines }
        </div>
      </div>
    );

  }
}

Cue.defaultProps = {
  startTime: 0,
  endTime: 0,
  currentTime: 0,
  color: '#fff'
}

export default Cue;
