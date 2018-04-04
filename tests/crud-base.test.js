import CrudBase from './../src/crud-base';
import LocalStorageMock from './mocks/localStorageMock';

test('Add a new register should push the register to data source with a new id', () =>{
    global.localStorage = new LocalStorageMock();
    const crudBase = new CrudBase('test');
    const register = {name: 'jhon', age: 23, active: true};
    crudBase.add(register);
    expect(crudBase.dataSource.length).toBe(1);
    expect(crudBase.dataSource[0]).toEqual({
      id: expect.stringMatching(/(^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$)/),
      name: 'jhon',
      age: 23,
      active: true});
});

