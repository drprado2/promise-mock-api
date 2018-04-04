import CrudBase from '../lib/crud-base';
import LocalStorageMock from './mocks/localStorageMock';

let crudBase;
const tableName = 'test-table';

beforeAll(() => {
  global.localStorage = new LocalStorageMock();
})

beforeEach(() => {
  crudBase = new CrudBase(tableName);
})

const validGuidRegexp = /(^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$)/;

describe('Adding, getting, deleting and updating registers', () => {

  test('Add a new register should push the register to data source with a new id', () =>{
    const register = {name: 'jhon', age: 23, active: true};
    crudBase.add(register);
    expect(crudBase.dataSource.length).toBe(1);
    expect(crudBase.dataSource[0]).toEqual({
      id: expect.stringMatching(validGuidRegexp),
      name: 'jhon',
      age: 23,
      active: true});
  });

  test('Commit should save the data source state in localStorage', () => {
    const mockSetItem = jest.fn();
    global.localStorage.setItem = mockSetItem;
    const register = {name: 'jhon', age: 23, active: true};

    crudBase.add(register);
    crudBase.commit();

    expect(mockSetItem.mock.calls.length).toBe(1);
    expect(mockSetItem.mock.calls[0][0]).toBe(tableName);
    const dataSourceExpected = Object.create(null);
    dataSourceExpected[tableName] = crudBase.dataSource;
    expect(mockSetItem.mock.calls[0][0]).toBe(tableName);
    expect(mockSetItem.mock.calls[0][1]).toBe(JSON.stringify(dataSourceExpected));
  })

})



