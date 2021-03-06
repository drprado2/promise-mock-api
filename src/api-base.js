import CrudBase from './crud-base';

export default class ApiBase{
  constructor(baseUrl, timeToResponse=1500){
    this.baseUrl = baseUrl;
    this._crud = new CrudBase(baseUrl);
    this._timeToResponse=timeToResponse;
    this._gets = [{url: '', method: 'get', action: this._defaultGet}];
    this._posts = [{url: '', method: 'post', action: this._defaultPost}];
    this._puts = [{url: '', method: 'put', action: this._defaultPut}];
    this._deletes = [{url: '', method: 'delete', action: this._defaultDelete}];
  }

  get = (resourceUrl, queryString, forcedResult) => {
    const finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    const getAction = this._gets.find(x => x.url === finalUrl).action;
    if(!getAction)
      return Promise.reject(new Response(null, {"status": 404}));

    const resultAction = getAction(queryString, forcedResult);
    return this._defaultAction(resultAction);
  }

  post = (resourceUrl, bodyObj, forcedResult) => {
    const finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    const postAction = this._posts.find(x => x.url === finalUrl).action;
    if(!postAction)
      return Promise.reject(new Response(null, {"status": 404}));

    const resultAction = postAction(bodyObj, forcedResult);
    return this._defaultAction(resultAction);
  }

  put = (resourceUrl, id, bodyObj, forcedResult) => {
    const finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    const putAction = this._puts.find(x => x.url === finalUrl).action;
    if(!putAction)
      return Promise.reject(new Response(null, {"status": 404}));

    const resultAction = putAction(id, bodyObj, forcedResult);
    return this._defaultAction(resultAction);
  }

  delete = (resourceUrl, id, forcedResult) => {
    const finalUrl = resourceUrl.endsWith('/') ? resourceUrl.substring(0, resourceUrl.length - 1) : resourceUrl;

    const deleteAction = this._deletes.find(x => x.url === finalUrl).action;
    if(!deleteAction)
      return Promise.reject(new Response(null, {"status": 404}));

    const resultAction = deleteAction(id, forcedResult);
    return this._defaultAction(resultAction);
  }

  addEndpoint = (...endpoints) => {
    const addAction = (actions, newAction) => {
      const url = newAction.url.endsWith('/')
        ? newAction.url.substring(0, newAction.url.length -1)
        : newAction.url;
      const urlIndex = actions.findIndex(y => y.url === newAction.url);
      urlIndex >= 0
        ? actions.splice(urlIndex, 1, {action: newAction.action, url})
        : actions.push({action: newAction.action, url})
    }

    endpoints.forEach(x => {
      switch(x.method.toUpperCase()){
        case 'GET':
          addAction(this._gets, x);
          break;
        case 'POST':
          addAction(this._posts, x);
          break;
        case 'PUT':
          addAction(this._puts, x);
          break;
        case 'DELETE':
          addAction(this._deletes, x);
      }
    })
  }

  _defaultGet = (filter, forcedResult) => {
    if(forcedResult)
      return {statusCode: forcedResult.statusCode, payload: forcedResult.body};

    const data = this._crud.get(filter);
    return {statusCode: 200, payload: data};
  }

  _defaultPost = (obj, forcedResult) =>{
    if(forcedResult)
      return {statusCode: forcedResult.statusCode, payload: forcedResult.body};

    this._crud.add(obj);
    this._crud.commit();
    return {statusCode: 200}
  }

  _defaultPut = (id, obj, forcedResult) => {
    if(forcedResult)
      return {statusCode: forcedResult.statusCode, payload: forcedResult.body};

    const ok = this._crud.update(id, obj);
    if(!ok)
      return {statusCode: 400};

    this._crud.commit();
    return {statusCode: 200}
  }

  _defaultDelete = (id, forcedResult) => {
    if(forcedResult)
      return {statusCode: forcedResult.statusCode, payload: forcedResult.body}

    const ok = this._crud.remove(id);
    if(!ok)
      return {statusCode: 400, payload: null}

    this._crud.commit();
    return {statusCode: 200, payload: null}
  }

  _defaultAction = result =>
    new Promise(resolve =>
      setTimeout(() => resolve(this._createResponse(result.payload, result.statusCode)),
        this._timeToResponse)
    );

  _createResponse = (obj, statusCode) => {
    if(!obj)
      return new Response(null, {"status": statusCode})

    const blobJson = new Blob([JSON.stringify(obj)], {type: 'application/json'});
    return new Response(blobJson, {"status": statusCode})
  }
}