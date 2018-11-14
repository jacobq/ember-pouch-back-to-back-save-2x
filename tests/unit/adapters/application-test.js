/* global Promise */

import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('adapter:application', 'Unit | Adapter | application', {
  needs: ['model:item']
});

function getStore(context) {
  return context.container.lookup("service:store");
}

test('Can save an item', function(assert) {
  Ember.run(() => {
    const done = assert.async();
    const store = getStore(this);
    const item = store.createRecord('item');
    item.save().then(() => {
      assert.ok(!item.get('dirtyType'), `Item shouldn't be dirty (just saved it)`);
      done();
    });
  });
});


test('Can create & save an item with various, fixed IDs', function(assert) {
  Ember.run(() => {
    const done = assert.async();
    const store = getStore(this);
    const ids = ['12345', 'abcde', 'foo_bar', 'baz-quux'];
    function run(idIndex) {
      const id = ids[idIndex];
      const item = store.createRecord('item', { id });
      item.save().then(() => {
        assert.equal(item.get('id'), id);
        assert.ok(!item.get('dirtyType'), `Item shouldn't be dirty (just saved it)`);
        const nextIdIndex = idIndex + 1;
        if (nextIdIndex < ids.length) {
          run(nextIdIndex);
        }
        else {
          done();
        }
      });
    }
    run(0);
  });
});


test('Can save an item twice', function(assert) {
  Ember.run(() => {
    const done = assert.async();
    const store = getStore(this);
    const item = store.createRecord('item');
    item.save().then(() => {
      item.save().then(() => {
        assert.ok(!item.get('dirtyType'), `Item shouldn't be dirty (just saved it)`);
        done();
      })
    })
  });
});


test('Can save an item twice before waiting for the first to finish (!!! FAILING !!!)', function(assert) {
  Ember.run(() => {
    const done = assert.async();
    const store = getStore(this);

    store.findAll('item').then(items => {
      Ember.run.next(() => {
        Promise.all(items.map(item => item.destroyRecord())).then(() => {
          Ember.run.next(() => {
            let item;
            try {
              item = store.createRecord('item', { id: 'foo' });
            }
            catch (e) {
/* On subsequent runs
Error: Assertion Failed: The id foo has already been used with another record for modelClass 'item'.
    at new EmberError (error.js:40)
    at Object.assert (index.js:139)
    at Class._buildInternalModel (-private.js:12508)
    at Class.createRecord (-private.js:10489)
    at application-test.js:82
    at fn (backburner.js:701)
    at invokeWithOnError (backburner.js:283)
    at Queue.flush (backburner.js:153)
    at DeferredActionQueues.flush (backburner.js:345)
    at Backburner.end (backburner.js:455)
 */
              assert.ok(false, e);
              done();
              throw e;
            }
            console.log('1st save ----------'); //eslint-disable-line no-console
            item.save();
            console.log('2nd save ----------'); //eslint-disable-line no-console
            // The following will reject with "TypeError: Cannot read property 'id' of undefined"
            item.save().then(() => {
              // never gets here
              console.log('2nd save finished ----------', item); //eslint-disable-line no-console
              assert.ok(!item.get('dirtyType'), `Item shouldn't be dirty (just saved it)`);
              done();
            }).catch(e => {
              //debugger; // eslint-disable-line no-debugger
/* On first run
Error: Attempted to handle event `becameError` on <item:foo> while in state root.loaded.saved.
    at new EmberError (http://localhost:7357/assets/vendor.js:24386:25)
    at InternalModel._unhandledEvent (http://localhost:7357/assets/vendor.js:96318:11)
    at InternalModel.send (http://localhost:7357/assets/vendor.js:96190:12)
    at InternalModel.adapterDidError (http://localhost:7357/assets/vendor.js:96607:10)
    at Class.recordWasError (http://localhost:7357/assets/vendor.js:101034:19)
    at http://localhost:7357/assets/vendor.js:101875:13
    at tryCatcher (http://localhost:7357/assets/vendor.js:63702:21)
    at invokeCallback (http://localhost:7357/assets/vendor.js:63880:33)
    at publish (http://localhost:7357/assets/vendor.js:63866:9)
    at publishRejection (http://localhost:7357/assets/vendor.js:63801:5)
*/
              assert.ok(false, e.stack);
              done();
              throw e;
            });
          });
        });
      });
    });
  });
});
