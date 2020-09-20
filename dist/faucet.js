'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _util = require('@zilliqa-js/util');

var _zilliqa = require('@zilliqa-js/zilliqa');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();

var ZILS_PER_ACCOUNT = process.env.ZILS_PER_ACCOUNT;
var ZILS_PER_REQUEST = process.env.ZILS_PER_REQUEST;
// const BLOCKS_TO_WAIT = process.env.BLOCKS_TO_WAIT;
var OWNER_PRIVATEKEY = process.env.OWNER_PRIVATEKEY;
var ISOLATED_URL = process.env.ISOLATED_URL;

var Faucet = function () {
  function Faucet() {
    _classCallCheck(this, Faucet);

    this.chainId = 1; // chainId of the developer testnet
    this.msgVersion = 1; // current msgVersion
    this.VERSION = _util.bytes.pack(this.chainId, this.msgVersion);
    this.state = [];
    this.getState();

    this.zilliqa = new _zilliqa.Zilliqa(ISOLATED_URL);
    this.zilliqa.wallet.addByPrivateKey(OWNER_PRIVATEKEY);
  }

  _createClass(Faucet, [{
    key: 'getState',
    value: function getState() {
      if (!_fsExtra2.default.existsSync('./faucet-state.json')) {
        console.log('Generating state file');
        _fsExtra2.default.writeJSONSync('./faucet-state.json', [{
          address: 'init',
          block: 0
        }]);
      }

      var stateFile = _fsExtra2.default.readJSONSync('./faucet-state.json');
      this.state = stateFile;

      return this.state;
    }
  }, {
    key: 'saveState',
    value: function saveState() {
      _fsExtra2.default.writeJSONSync('./faucet-state.json', this.state);
    }
  }, {
    key: 'userAlreadyRegistered',
    value: function userAlreadyRegistered(userAddress) {
      return this.state.findIndex(function (item) {
        return item.address === userAddress;
      }) !== -1;
    }
  }, {
    key: 'appendUserToState',
    value: function appendUserToState(_ref) {
      var userAddress = _ref.userAddress,
          block = _ref.block;

      this.state.push({ address: userAddress, block: block });
    }
  }, {
    key: 'registerUser',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userAddress) {
        var gasPrice, myGasPrice, tx, callTx;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.userAlreadyRegistered(userAddress)) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Address already requested funds.');

              case 2:
                _context.next = 4;
                return this.zilliqa.blockchain.getMinimumGasPrice();

              case 4:
                gasPrice = _context.sent;
                myGasPrice = gasPrice.result;
                tx = this.zilliqa.transactions.new({
                  version: this.VERSION,
                  toAddr: userAddress,
                  amount: new _util.BN(ZILS_PER_ACCOUNT),
                  gasPrice: new _util.BN(myGasPrice), // in Qa
                  gasLimit: _util.Long.fromNumber(8000)
                });
                _context.next = 9;
                return this.zilliqa.blockchain.createTransaction(tx);

              case 9:
                callTx = _context.sent;


                if (callTx.receipt.success) {
                  this.appendUserToState({ userAddress: userAddress, block: callTx.receipt.epoch_num });
                }

                return _context.abrupt('return', callTx.receipt);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function registerUser(_x) {
        return _ref2.apply(this, arguments);
      }

      return registerUser;
    }()
  }, {
    key: 'requestFunds',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(userAddress) {
        var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ZILS_PER_REQUEST;
        var gasPrice, myGasPrice, tx, callTx;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.userAlreadyRegistered(userAddress)) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Address already requested funds.');

              case 2:
                _context2.next = 4;
                return this.zilliqa.blockchain.getMinimumGasPrice();

              case 4:
                gasPrice = _context2.sent;
                myGasPrice = gasPrice.result;
                tx = this.zilliqa.transactions.new({
                  version: this.VERSION,
                  toAddr: userAddress,
                  amount: new _util.BN(amount),
                  gasPrice: new _util.BN(myGasPrice), // in Qa
                  gasLimit: _util.Long.fromNumber(8000)
                });
                _context2.next = 9;
                return this.zilliqa.blockchain.createTransaction(tx);

              case 9:
                callTx = _context2.sent;


                if (callTx.receipt.success) {
                  this.appendUserToState({ userAddress: userAddress, block: callTx.receipt.epoch_num });
                }

                return _context2.abrupt('return', callTx.receipt);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function requestFunds(_x2) {
        return _ref3.apply(this, arguments);
      }

      return requestFunds;
    }()
  }]);

  return Faucet;
}();

exports.default = Faucet;