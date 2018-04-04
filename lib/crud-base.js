export default class CrudBase{
  constructor(tableName){
    const storage = localStorage.getItem(tableName);
    const dataSource = storage ? JSON.parse(storage)[tableName] : [];

    this.dataSource = dataSource;
    this.tableName = tableName;
  }

  newGuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })

  findIndexById = id => this.dataSource.findIndex(e => e.id == id);

  add = entity => this.dataSource.push({ ...entity, id: this.newGuid() });

  remove = id => {
    const entity = this.dataSource.find(x => x.id == id);
    if(!entity)
      return false;

    this.dataSource.splice(this.findIndexById(id), 1);
    return true;
  }

  update = (id, values) => {
    const entity = this.dataSource.find(x => x.id == id);
    if(!entity)
      return false;

    const newEntity = { ...entity, ...values};
    this.dataSource.splice(this.findIndexById(id), 1, newEntity);
    return true;
  }

  get = filter => {
    const page = filter && filter.page ? filter.page : 1;
    const itemsPerPage = filter && filter.itemsPerPage ? filter.itemsPerPage : 0;

    const filteredItems = this.dataSource.filter(x => {
      let result = true;
      for(let key in filter){
        result = x[key] === filter[key];
        if(!result)
          break;
      }
      return result;
    });

    const totalItems = filteredItems.length;
    const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

    const paginatedItems = itemsPerPage > 0 && filteredItems.length > itemsPerPage
      ? filteredItems.slice((page - 1) * itemsPerPage)
      : filteredItems;

    return {totalItems, totalPages, data: paginatedItems};
  }

  commit = () => {
    const json = Object.create(null);
    json[this.tableName] = this.dataSource;

    localStorage.setItem(this.tableName, JSON.stringify(json));
  }
}
