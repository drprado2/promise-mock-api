'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class CrudBase {
  constructor(tableName) {
    this.newGuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });

    this.findIndexById = id => this.dataSource.findIndex(e => e.id == id);

    this.add = entity => this.dataSource.push(_extends({}, entity, { id: this.newGuid() }));

    this.remove = id => {
      const entity = this.dataSource.find(x => x.id == id);
      if (!entity) return false;

      this.dataSource.splice(this.findIndexById(id), 1);
      return true;
    };

    this.update = (id, values) => {
      const entity = this.dataSource.find(x => x.id == id);
      if (!entity) return false;

      const newEntity = _extends({}, entity, values);
      this.dataSource.splice(this.findIndexById(id), 1, newEntity);
      return true;
    };

    this.get = filter => {
      const page = filter && filter.page ? filter.page : 1;
      const itemsPerPage = filter && filter.itemsPerPage ? filter.itemsPerPage : 0;

      const filteredItems = this.dataSource.filter(x => {
        let result = true;
        for (let key in filter) {
          if (typeof key === 'string') {
            result = !!x[key].match(filter[key]);
          } else {
            result = x[key] === filter[key];
          }
          if (!result) break;
        }
        return result;
      });

      const totalItems = filteredItems.length;
      const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

      const paginatedItems = itemsPerPage > 0 && filteredItems.length > itemsPerPage ? filteredItems.slice((page - 1) * itemsPerPage) : filteredItems;

      return { totalItems, totalPages, data: paginatedItems };
    };

    this.commit = () => {
      const json = Object.create(null);
      json[this.tableName] = this.dataSource;

      localStorage.setItem(this.tableName, JSON.stringify(json));
    };

    const storage = localStorage.getItem(tableName);
    const dataSource = storage ? JSON.parse(storage)[tableName] : [];

    this.dataSource = dataSource;
    this.tableName = tableName;
  }

}
exports.default = CrudBase;