function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CrudBase = function CrudBase(tableName) {
  var _this = this;

  _classCallCheck(this, CrudBase);

  this.newGuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  this.findIndexById = function (id) {
    return _this.dataSource.findIndex(function (e) {
      return e.id == id;
    });
  };

  this.add = function (entity) {
    return _this.dataSource.push(Object.assign({}, entity, { id: _this.newGuid() }));
  };

  this.remove = function (id) {
    var entity = _this.dataSource.find(function (x) {
      return x.id == id;
    });
    if (!entity) return false;

    _this.dataSource.splice(_this.findIndexById(id), 1);
    return true;
  };

  this.update = function (id, values) {
    var entity = _this.dataSource.find(function (x) {
      return x.id == id;
    });
    if (!entity) return false;

    var newEntity = Object.assign({}, entity, values);
    _this.dataSource.splice(_this.findIndexById(id), 1, newEntity);
    return true;
  };

  this.get = function (filter) {
    var page = filter && filter.page ? filter.page : 1;
    var itemsPerPage = filter && filter.itemsPerPage ? filter.itemsPerPage : 0;

    var filteredItems = _this.dataSource.filter(function (x) {
      var result = true;
      for (var key in filter) {
        if (typeof key === 'string') {
          result = !!x[key].match(filter[key]);
        } else {
          result = x[key] === filter[key];
        }
        if (!result) break;
      }
      return result;
    });

    var totalItems = filteredItems.length;
    var totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

    var paginatedItems = itemsPerPage > 0 && filteredItems.length > itemsPerPage ? filteredItems.slice((page - 1) * itemsPerPage) : filteredItems;

    return { totalItems: totalItems, totalPages: totalPages, data: paginatedItems };
  };

  this.commit = function () {
    var json = Object.create(null);
    json[_this.tableName] = _this.dataSource;

    localStorage.setItem(_this.tableName, JSON.stringify(json));
  };

  var storage = localStorage.getItem(tableName);
  var dataSource = storage ? JSON.parse(storage)[tableName] : [];

  this.dataSource = dataSource;
  this.tableName = tableName;
};

export default CrudBase;