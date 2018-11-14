import PouchDB from 'pouchdb';
import PouchDebugPlugin from 'pouchdb-debug';
import { Adapter } from 'ember-pouch';

export default Adapter.extend({
  init() {
    this._super(...arguments);
    PouchDB.plugin(PouchDebugPlugin);
    PouchDB.debug.enable('*pouch*');
    this.set('db', new PouchDB('_example_'));
  }
});
