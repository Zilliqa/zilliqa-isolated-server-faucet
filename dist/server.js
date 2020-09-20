'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _faucet = require('./faucet');

var _faucet2 = _interopRequireDefault(_faucet);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config();

var FAUCET_PORT = process.env.FAUCET_PORT;

var app = (0, _express2.default)();
app.use((0, _cors2.default)());

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

var faucet = new _faucet2.default();

app.post('/register-account', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var address, date, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            address = req.body.address;
            _context.prev = 1;
            date = new Date();

            console.log('[' + date.toUTCString() + '] Register address ' + address + '.');
            _context.next = 6;
            return faucet.registerUser(address);

          case 6:
            result = _context.sent;

            faucet.saveState();
            return _context.abrupt('return', res.json(result));

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', res.json({ error: _context.t0.message }));

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 11]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

app.post('/request-funds', function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var address, amount, date, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            address = req.body.address;
            amount = req.body.amount || process.env.ZILS_PER_REQUEST;
            _context2.prev = 2;
            date = new Date();

            console.log('[' + date.toUTCString() + '] Request funds for ' + address + '. Amount ' + amount);
            _context2.next = 7;
            return faucet.requestFunds(address, amount);

          case 7:
            result = _context2.sent;

            faucet.saveState();
            return _context2.abrupt('return', res.json(result));

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](2);
            return _context2.abrupt('return', res.json({ error: _context2.t0.message }));

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[2, 12]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

app.listen(FAUCET_PORT, function () {
  return console.log('Faucet listening on port ' + FAUCET_PORT + '!');
});