'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressBar = exports.progressBar = exports.activeRequests = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setOriginalFetch = setOriginalFetch;
exports.progressBarFetch = progressBarFetch;
exports.setActiveRequests = setActiveRequests;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var activeRequests = exports.activeRequests = 0;

var progressBar = exports.progressBar = void 0;

var ProgressBar = exports.ProgressBar = function (_Component) {
  _inherits(ProgressBar, _Component);

  function ProgressBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ProgressBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ProgressBar.__proto__ || Object.getPrototypeOf(ProgressBar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      mode: 'hibernate'
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ProgressBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      exports.progressBar = progressBar = this;
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextState.mode !== this.state.mode;
    }
  }, {
    key: 'tick',
    value: function tick() {
      var _this2 = this;

      var mode = this.state.mode;

      if (mode === 'complete') {
        setTimeout(function () {
          _this2.setState({ mode: 'hibernate' });
        }, 1000);
      } else if (mode === 'active') {
        if (activeRequests === 0) {
          setTimeout(function () {
            if (activeRequests === 0) {
              _this2.moveToMode('complete');
            } else {
              _this2.tick();
            }
          }, 200);
        } else {
          this.tickWithDelay();
        }
      } else {
        if (activeRequests > 0) {
          setTimeout(function () {
            if (activeRequests > 0) {
              _this2.moveToMode('active');
            } else {
              _this2.setState({ mode: 'hibernate' });
            }
          }, 100);
        } else {
          this.setState({ mode: 'hibernate' });
        }
      }
    }
  }, {
    key: 'moveToInit',
    value: function moveToInit() {
      if (this.state.mode === 'hibernate') {
        this.moveToMode('init');
      }
    }
  }, {
    key: 'moveToMode',
    value: function moveToMode(mode) {
      var _this3 = this;

      this.setState({ mode: mode }, function () {
        _this3.tick();
      });
    }
  }, {
    key: 'tickWithDelay',
    value: function tickWithDelay() {
      var _this4 = this;

      setTimeout(function () {
        _this4.tick();
      }, 50);
    }
  }, {
    key: 'render',
    value: function render() {
      var mode = this.state.mode;

      if (mode === 'hibernate') {
        return null;
      }

      var width = mode === 'complete' ? 100 : mode === 'init' ? 0 : this.props.activeWidth;
      var animationSpeed = mode === 'complete' ? this.props.completeSpeed : this.props.activeSpeed;
      var transition = mode === 'init' ? '' : 'width ' + String(animationSpeed) + 's ease-in';

      var style = _extends({
        position: 'absolute',
        top: '0',
        zIndex: '9000',
        backgroundColor: '#f0ad4e',
        height: '4px',
        transition: transition,
        width: String(width) + '%'
      }, this.props.style);

      return _react2.default.createElement('div', { className: 'react-fetch-progress-bar', style: style });
    }
  }]);

  return ProgressBar;
}(_react.Component);

ProgressBar.defaultProps = {
  activeSpeed: 30,
  completeSpeed: 0.8,
  activeWidth: 80
};

var originalFetch = void 0;

function setOriginalFetch(nextOriginalFetch) {
  originalFetch = nextOriginalFetch;
}

function progressBarFetch(url, options) {
  exports.activeRequests = activeRequests += 1;

  if (progressBar) {
    progressBar.moveToInit();
  }

  return originalFetch(url, options).then(function (response) {
    exports.activeRequests = activeRequests -= 1;
    return response;
  }).catch(function (error) {
    exports.activeRequests = activeRequests -= 1;
    return Promise.reject(error);
  });
}

function setActiveRequests(nextActiveRequest) {
  exports.activeRequests = activeRequests = nextActiveRequest;
}
