'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apiBase = require('./api-base');

var _apiBase2 = _interopRequireDefault(_apiBase);

var _crudBase = require('./crud-base');

var _crudBase2 = _interopRequireDefault(_crudBase);

var _fetchMock = require('./fetch-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PromiseMockApi = {
  ApiBase: _apiBase2.default,
  CrudBase: _crudBase2.default,
  FetchMock: _fetchMock.FetchMock
};

exports.default = PromiseMockApi;