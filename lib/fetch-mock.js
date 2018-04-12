var FetchMock = function () {

  var _apis = [];

  var _findApi = function (url) {
    return !_apis ? null : _apis.find(function (x) {
      return url.match(x.baseUrl);
    });
  };

  var _getResource = function (url, baseUrl) {
    return url.substring(baseUrl.length);
  };

  var loadApis = function () {
    for (var _len = arguments.length, apis = Array(_len), _key = 0; _key < _len; _key++) {
      apis[_key] = arguments[_key];
    }

    return _apis = _apis.concat(apis);
  };

  var get = function (url, queryString) {
    var forcedResult = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var api = _findApi(url);

    if (!api) return Promise.reject(new Response(null, { "status": 404 }));

    var resource = _getResource(url, api.baseUrl);
    return api.get(resource, queryString, forcedResult);
  };

  var post = function (url, bodyObj) {
    var forcedResult = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var api = _findApi(url);

    if (!api) return Promise.reject(new Response(null, { "status": 404 }));

    var resource = _getResource(url, api.baseUrl);
    return api.post(resource, bodyObj, forcedResult);
  };

  var put = function (url, id, bodyObj) {
    var forcedResult = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var api = _findApi(url);

    if (!api) return Promise.reject(new Response(null, { "status": 404 }));

    var resource = _getResource(url, api.baseUrl);
    return api.put(resource, id, bodyObj, forcedResult);
  };

  var del = function (url, id) {
    var forcedResult = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var api = _findApi(url);

    if (!api) return Promise.reject(new Response(null, { "status": 404 }));

    var resource = _getResource(url, api.baseUrl);
    return api["delete"](resource, id, forcedResult);
  };

  return {
    loadApis: loadApis,
    get: get,
    post: post,
    put: put,
    "delete": del
  };
}();

export default FetchMock;