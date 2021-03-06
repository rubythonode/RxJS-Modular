var isDisposable = require('rx.utils').isDisposable;

/**
* Represents a disposable resource whose underlying disposable resource can be replaced by another disposable resource, causing automatic disposal of the previous underlying disposable resource.
*/
function SerialDisposable () {
  this.isDisposed = false;
  this.current = null;
}

/**
* Gets the underlying subscription.
* @return {Disposable} The underlying subscription.
*/
SerialDisposable.prototype.getDisposable = function () {
  return this.current;
};

SerialDisposable.prototype.setDisposable = function (value) {
  if (value && !isDisposable(value)) {
    throw new TypeError('value must have a "dispose" method.')
  }

  var shouldDispose = this.isDisposed;
  if (!shouldDispose) {
    var old = this.current;
    this.current = value;
  }
  old && old.dispose();
  shouldDispose && value.dispose();
};

/**
 * Unsubscribes from the underlying subscription as well as all future replacements.
 */
 SerialDisposable.dispose = function () {
    if (!this.isUnsubscribed) {
      this.isUnsubscribed = true;
      var old = this.current;
      this.current = null;
    }
    old && old.unsubscribe();
};

module.exports = SerialDisposable;
