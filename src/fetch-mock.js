const FetchMock = (function(){

  let _apis = [];

  const _findApi = url =>!_apis ? null : _apis.find(x => url.match(x.baseUrl));

  const _getResource = (url, baseUrl) => url.substring(baseUrl.length);

  const loadApis = (...apis) => _apis =  _apis.concat(apis);

  const get = (url, queryString, forcedResult=null) => {
    const api = _findApi(url);

    if(!api)
      return Promise.reject(new Response(null, {"status": 404}));

    const resource = _getResource(url, api.baseUrl);
    return api.get(resource, queryString, forcedResult);
  }

  const post = (url, bodyObj, forcedResult=null) => {
    const api = _findApi(url);

    if(!api)
      return Promise.reject(new Response(null, {"status": 404}));

    const resource = _getResource(url, api.baseUrl);
    return api.post(resource, bodyObj, forcedResult);
  }

  const put = (url, id, bodyObj, forcedResult=null) => {
    const api = _findApi(url);

    if(!api)
      return Promise.reject(new Response(null, {"status": 404}));

    const resource = _getResource(url, api.baseUrl);
    return api.put(resource, id, bodyObj, forcedResult);
  }

  const del = (url, id, forcedResult=null) => {
    const api = _findApi(url);

    if(!api)
      return Promise.reject(new Response(null, {"status": 404}));

    const resource = _getResource(url, api.baseUrl);
    return api.delete(resource, id, forcedResult);
  }

  return {
    loadApis,
    get,
    post,
    put,
    delete: del
  }
})();

export default FetchMock;

