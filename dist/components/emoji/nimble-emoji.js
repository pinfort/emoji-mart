'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../../utils');

var _data = require('../../utils/data');

var _sharedProps = require('../../utils/shared-props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SHEET_COLUMNS = 52;

var _getData = function _getData(props) {
  var emoji = props.emoji;
  var skin = props.skin;
  var set = props.set;
  var data = props.data;

  return (0, _utils.getData)(emoji, skin, set, data);
};

var _getPosition = function _getPosition(props) {
  var _getData2 = _getData(props);

  var sheet_x = _getData2.sheet_x;
  var sheet_y = _getData2.sheet_y;
  var multiply = 100 / (SHEET_COLUMNS - 1);

  return multiply * sheet_x + '% ' + multiply * sheet_y + '%';
};

var _getSanitizedData = function _getSanitizedData(props) {
  var emoji = props.emoji;
  var skin = props.skin;
  var set = props.set;
  var data = props.data;

  return (0, _utils.getSanitizedData)(emoji, skin, set, data);
};

var _handleClick = function _handleClick(e, props) {
  if (!props.onClick) {
    return;
  }
  var onClick = props.onClick;
  var emoji = _getSanitizedData(props);

  onClick(emoji, e);
};

var _handleOver = function _handleOver(e, props) {
  if (!props.onOver) {
    return;
  }
  var onOver = props.onOver;
  var emoji = _getSanitizedData(props);

  onOver(emoji, e);
};

var _handleLeave = function _handleLeave(e, props) {
  if (!props.onLeave) {
    return;
  }
  var onLeave = props.onLeave;
  var emoji = _getSanitizedData(props);

  onLeave(emoji, e);
};

var _isNumeric = function _isNumeric(value) {
  return !isNaN(value - parseFloat(value));
};

var _convertStyleToCSS = function _convertStyleToCSS(style) {
  var div = document.createElement('div');

  for (var key in style) {
    var value = style[key];

    if (_isNumeric(value)) {
      value += 'px';
    }

    div.style[key] = value;
  }

  return div.getAttribute('style');
};

var NimbleEmoji = function NimbleEmoji(props) {
  if (props.data.compressed) {
    (0, _data.uncompress)(props.data);
  }

  for (var k in NimbleEmoji.defaultProps) {
    if (props[k] == undefined && NimbleEmoji.defaultProps[k] != undefined) {
      props[k] = NimbleEmoji.defaultProps[k];
    }
  }

  var data = _getData(props);
  if (!data) {
    return null;
  }

  var unified = data.unified;
  var custom = data.custom;
  var short_names = data.short_names;
  var colons = data.colons;
  var imageUrl = data.imageUrl;
  var style = {};
  var children = props.children;
  var className = 'emoji-mart-emoji';
  var title = null;

  if (!unified && !custom) {
    return null;
  }

  if (props.tooltip) {
    title = short_names ? ':' + short_names[0] + ':' : colons;
  }

  if (props.native && unified) {
    className += ' emoji-mart-emoji-native';
    style = { fontSize: props.size };
    children = (0, _utils.unifiedToNative)(unified);

    if (props.forceSize) {
      style.display = 'inline-block';
      style.width = props.size;
      style.height = props.size;
    }
  } else if (custom) {
    className += ' emoji-mart-emoji-custom';
    style = {
      width: props.size,
      height: props.size,
      display: 'inline-block',
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'contain'
    };
  } else {
    var setHasEmoji = data['has_img_' + props.set] == undefined || data['has_img_' + props.set];

    if (!setHasEmoji) {
      if (props.fallback) {
        return props.fallback(data);
      } else {
        return null;
      }
    } else {
      style = {
        width: props.size,
        height: props.size,
        display: 'inline-block',
        backgroundImage: 'url(' + props.backgroundImageFn(props.set, props.sheetSize) + ')',
        backgroundSize: 100 * SHEET_COLUMNS + '%',
        backgroundPosition: _getPosition(props)
      };
    }
  }

  if (props.html) {
    style = _convertStyleToCSS(style);
    return '<span style=\'' + style + '\' ' + (title ? 'title=\'' + title + '\'' : '') + ' class=\'' + className + '\'>' + (children || '') + '</span>';
  } else {
    return _react2.default.createElement(
      'span',
      {
        key: props.emoji.id || props.emoji,
        onClick: function onClick(e) {
          return _handleClick(e, props);
        },
        onMouseEnter: function onMouseEnter(e) {
          return _handleOver(e, props);
        },
        onMouseLeave: function onMouseLeave(e) {
          return _handleLeave(e, props);
        },
        title: title,
        className: className
      },
      _react2.default.createElement(
        'span',
        { style: style },
        children
      )
    );
  }
};

NimbleEmoji.defaultProps = _sharedProps.EmojiDefaultProps;

exports.default = NimbleEmoji;