export const DBConfig = {
  name: 'MyAccountingDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'Accountings',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'type', keypath: 'type', options: { unique: false } },
        { name: 'category', keypath: 'category', options: { unique: false } },
        { name: 'amount', keypath: 'amount', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'year', keypath: 'year', options: { unique: false } },
        { name: 'month', keypath: 'month', options: { unique: false } },
        { name: 'day', keypath: 'day', options: { unique: false } },
        { name: 'remark', keypath: 'remark', options: { unique: false } },

      ]
    },
    {
      store: 'Accountings_Categories',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ]
    }
  ]
};
