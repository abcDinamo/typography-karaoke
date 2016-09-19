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
  }

  mapInRange(value, inMin, inMax, outMin, outMax, contrain = false) {
    var outValue = (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

    if(!contrain) {
      return outValue;
    }

    if(outValue > outMax) {
      return outMax;
    }

    if(outValue < outMin) {
      return outMin;
    }
  }

  // FIXME don't do this everytime, just when text changes or window is resized
  getLines(text) {
    var $measureContainer = $(this.refs.measureContainer);
    var $measure = $measureContainer.find('.measure').length ? $measureContainer.find('.measure') : $('<div class="measure"></div>');
    var $widther = $measureContainer.find('.widther').length ? $measureContainer.find('.widther') : $('<div class="measure widther"></div>');
    // MAYBE http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
    var words = text.split(/\s+/);
    var lines = [];
    var height = 0;
    var lastHeightIndex = 0;
    var textSoFar = words[0];
    var currentLine = words[0];
    var currentLineWidthRange = 0;

    $measureContainer.append($measure);
    $measureContainer.append($widther);

    // find the tallest min-height
    $measure.text('ƒ');
    var minHeight = $measure.height();
    $measure.css('min-height', minHeight + 'px')

    // start with our text
    $measure.text(textSoFar);
    height = $measure.height();

    for (var i = 1; i < words.length; i++) {
      // textSoFar + spaces[i] + words [i]
      var newText = textSoFar + ' ' + words[i];
      $measure.text(newText);

      if($measure.height() > height) {
        $widther.text(currentLine);
        var lineWidth = $widther.width();
        lines.push({
          text: currentLine,
          width: lineWidth,
          widthRange: [currentLineWidthRange, currentLineWidthRange + lineWidth]
        });

        currentLineWidthRange = currentLineWidthRange + lineWidth
        height = $measure.height();
        lastHeightIndex = i - 1;
        currentLine = words[i];
      } else {
        currentLine = currentLine + ' ' + words[i];
      }

      textSoFar = newText;
    }

    $widther.text(currentLine);
    var lineWidth = $widther.width();
    lines.push({
      text: currentLine,
      width: lineWidth,
      widthRange: [currentLineWidthRange, currentLineWidthRange + lineWidth]
    });

    return lines;
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

    var progressPercent = progress + '%';
    var lines = this.getLines(this.props.children);
    var totalWidth = lines[lines.length - 1].widthRange[1]
    var progressWidth = this.mapInRange(progress, 0, 100, 0, totalWidth);

    var htmlLines = _.map(lines, function(line, index) {
        var lineProgress = self.mapInRange(progressWidth, line.widthRange[0], line.widthRange[1], 0, 100);
        var lineProgressPercent = (Math.ceil(lineProgress * 5) / 5).toFixed(2)  + '%';

        var cueTextStyle = {
          backgroundImage: `-moz-linear-gradient(left, ${self.props.color} ${lineProgressPercent}, #FFF ${lineProgressPercent})`,
          backgroundImage: `-webkit-linear-gradient(left, ${self.props.color} ${lineProgressPercent}, #FFF ${lineProgressPercent})`,
          backgroundImage: `linear-gradient(to right, ${self.props.color} ${lineProgressPercent}, #FFF ${lineProgressPercent})`
        };

        return (
          <div key={ index } className={ styles.cueText } style={ cueTextStyle }>
            { line.text }
          </div>
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
  color: '#f90'
}

export default Cue;
