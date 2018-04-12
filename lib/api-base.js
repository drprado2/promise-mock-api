function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import CrudBase from './crud-base';

var ApiBase = function ApiBase(baseUrl) {
  var _this = this;

  var timeToResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1500;

  _classCallCheck(this, ApiBase);

  this.get = function (resourceUrl, queryString, forcedResult) {
    var finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    var getAction = _this._gets.find(function (x) {
      return x.url === finalUrl;
    }).action;
    if (!getAction) return Promise.reject(new Response(null, { "status": 404 }));

    var resultAction = getAction(queryString, forcedResult);
    return _this._defaultAction(resultAction);
  };

  this.post = function (resourceUrl, bodyObj, forcedResult) {
    var finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    var postAction = _this._posts.find(function (x) {
      return x.url === finalUrl;
    }).action;
    if (!postAction) return Promise.reject(new Response(null, { "status": 404 }));

    var resultAction = postAction(bodyObj, forcedResult);
    return _this._defaultAction(resultAction);
  };

  this.put = function (resourceUrl, id, bodyObj, forcedResult) {
    var finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    var putAction = _this._puts.find(function (x) {
      return x.url === finalUrl;
    }).action;
    if (!putAction) return Promise.reject(new Response(null, { "status": 404 }));

    var resultAction = putAction(id, bodyObj, forcedResult);
    return _this._defaultAction(resultAction);
  };

  this['delete'] = function (resourceUrl, id, forcedResult) {
    var finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    var deleteAction = _this._deletes.find(function (x) {
      return x.url === finalUrl;
    }).action;
    if (!deleteAction) return Promise.reject(new Response(null, { "status": 404 }));

    var resultAction = deleteAction(id, forcedResult);
    return _this._defaultAction(resultAction);
  };

  this.addEndpoint = function () {
    for (var _len = arguments.length, endpoints = Array(_len), _key = 0; _key < _len; _key++) {
      endpoints[_key] = arguments[_key];
    }

    var addAction = function (actions, newAction) {
      var url = newAction.url.endsWith('/') ? newAction.url.substring(0, newAction.url.length - 1) : newAction.url;
      var urlIndex = actions.findIndex(function (y) {
        return y.url === newAction.url;
      });
      urlIndex >= 0 ? actions.splice(urlIndex, 1, { action: newAction.action, url: url }) : actions.push({ action: newAction.action, url: url });
    };

    endpoints.forEach(function (x) {
      switch (x.method.toUpperCase()) {
        case 'GET':
          addAction(_this._gets, x);
          break;
        case 'POST':
          addAction(_this._posts, x);
          break;
        case 'PUT':
          addAction(_this._puts, x);
          break;
        case 'DELETE':
          addAction(_this._deletes, x);
      }
    });
  };

  this._defaultGet = function (filter, forcedResult) {
    if (forcedResult) return { statusCode: forcedResult.statusCode, payload: forcedResult.body };

    var data = _this._crud.get(filter);
    return { statusCode: 200, payload: data };
  };

  this._defaultPost = function (obj, forcedResult) {
    if (forcedResult) return { statusCode: forcedResult.statusCode, payload: forcedResult.body };

    _this._crud.add(obj);
    _this._crud.commit();
    return { statusCode: 200 };
  };

  this._defaultPut = function (id, obj, forcedResult) {
    if (forcedResult) return { statusCode: forcedResult.statusCode, payload: forcedResult.body };

    var ok = _this._crud.update(id, obj);
    if (!ok) return { statusCode: 400 };

    _this._crud.commit();
    return { statusCode: 200 };
  };

  this._defaultDelete = function (id, forcedResult) {
    if (forcedResult) return { statusCode: forcedResult.statusCode, payload: forcedResult.body };

    var ok = _this._crud.remove(id);
    if (!ok) return { statusCode: 400, payload: null };

    _this._crud.commit();
    return { statusCode: 200, payload: null };
  };

  this._defaultAction = function (result) {
    return new Promise(function (resolve) {
      return setTimeout(function () {
        return resolve(_this._createResponse(result.payload, result.statusCode));
      }, _this._timeToResponse);
    });
  };

  this._createResponse = function (obj, statusCode) {
    if (!obj) return new Response(null, { "status": statusCode });

    var blobJson = new Blob([JSON.stringify(obj)], { type: 'application/json' });
    return new Response(blobJson, { "status": statusCode });
  };

  this.baseUrl = baseUrl;
  this._crud = new CrudBase(baseUrl);
  this._timeToResponse = timeToResponse;
  this._gets = [{ url: '', method: 'get', action: this._defaultGet }];
  this._posts = [{ url: '', method: 'post', action: this._defaultPost }];
  this._puts = [{ url: '', method: 'put', action: this._defaultPut }];
  this._deletes = [{ url: '', method: 'delete', action: this._defaultDelete }];
};

export default ApiBase;