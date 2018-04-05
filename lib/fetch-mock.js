"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class FetchMock {

  static loadApis(...apis) {
    FetchMock._apis = FetchMock._apis.concat(apis);
  }

  static get(url, queryString, forcedResult = null) {
    const api = FetchMock._findApi(url);
    if (!api) return Promise.reject(new Response(null, { "status": 404 }));
    const resource = FetchMock._getResource(url, api.baseUrl);
    return api.get(resource, queryString, forcedResult);
  }

  static post(url, bodyObj, forcedResult = null) {
    const api = FetchMock._findApi(url);
    if (!api) return Promise.reject(new Response(null, { "status": 404 }));
    const resource = FetchMock._getResource(url, api.baseUrl);
    return api.post(resource, bodyObj, forcedResult);
  }

  static put(url, id, bodyObj, forcedResult = null) {
    const api = FetchMock._findApi(url);
    if (!api) return Promise.reject(new Response(null, { "status": 404 }));
    const resource = FetchMock._getResource(url, api.baseUrl);
    return api.put(resource, id, bodyObj, forcedResult);
  }

  static delete(url, id, forcedResult = null) {
    const api = FetchMock._findApi(url);
    if (!api) return Promise.reject(new Response(null, { "status": 404 }));
    const resource = FetchMock._getResource(url, api.baseUrl);
    return api.delete(resource, id, forcedResult);
  }
}
exports.default = FetchMock;
FetchMock._apis = [];

FetchMock._findApi = url => {
  if (!FetchMock._apis) return null;

  return FetchMock._apis.find(x => url.match(x.baseUrl));
};

FetchMock._getResource = (url, baseUrl) => url.substring(baseUrl.length);