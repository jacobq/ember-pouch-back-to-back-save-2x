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
    const item = store.createRecord('item');
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
/*
Error: Assertion Failed: 'item:1D71839B-6FA0-E9F8-8B09-CB24747F3A69' was saved to the server, but the response returned the new id 'D01D56DF-2F48-482D-9A4E-626AA774B982'. The store cannot assign a new id to a record that already has an id.
    at new EmberError (http://localhost:7357/assets/vendor.js:24386:25)
    at Object.assert (http://localhost:7357/assets/vendor.js:24629:15)
    at Class.updateId (http://localhost:7357/assets/vendor.js:101057:60)
    at Class.didSaveRecord (http://localhost:7357/assets/vendor.js:100998:12)
    at http://localhost:7357/assets/vendor.js:101865:13
    at Backburner.run (http://localhost:7357/assets/vendor.js:20324:36)
    at Backburner.join (http://localhost:7357/assets/vendor.js:20333:33)
    at http://localhost:7357/assets/vendor.js:101855:23
    at tryCatcher (http://localhost:7357/assets/vendor.js:63702:21)
    at invokeCallback (http://localhost:7357/assets/vendor.js:63880:33)
*/
      assert.ok(false, e.stack);
      done();
    });
  });
});
