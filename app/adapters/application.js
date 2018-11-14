import PouchDB from 'pouchdb';
import PouchDebugPlugin from 'pouchdb-debug';
import { Adapter } from 'ember-pouch';

export default Adapter.extend({
  init() {
    this._super(...arguments);
    PouchDB.plugin(PouchDebugPlugin);
    PouchDB.debug.enable('*pouch*');
    this.set('db', new PouchDB('_example_', {
      adapter: 'idb',
      auto_compaction: true,
      deterministic_revs: true,
      //revs_limit: 1,
    }));
  }
});
