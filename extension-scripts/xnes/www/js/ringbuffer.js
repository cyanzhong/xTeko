/**
 * Expose `RingBuffer`.
 */
window.RingBuffer = RingBuffer;

/**
 * Initializes a new empty `RingBuffer` with the given `capacity`, when no
 * value is provided uses the default capacity (50).
 *
 * If provided, `evictedCb` gets run with any evicted elements.
 *
 * @param {capacity}
 * @param [evictedCb]
 * @return {RingBuffer}
 * @api public
 */
function RingBuffer(capacity, evictedCb) {
  this._elements = new Array(capacity || 50);
  this._first = 0;
  this._last = 0;
  this._size = 0;
  this._evictedCb = evictedCb;
}

/**
 * Returns the capacity of the ring buffer.
 *
 * @return {Number}
 * @api public
 */
RingBuffer.prototype.capacity = function() {
  return this._elements.length;
};

/**
 * Returns whether the ring buffer is empty or not.
 *
 * @return {Boolean}
 * @api public
 */
RingBuffer.prototype.isEmpty = function() {
  return this.size() === 0;
};

/**
 * Returns whether the ring buffer is full or not.
 *
 * @return {Boolean}
 * @api public
 */
RingBuffer.prototype.isFull = function() {
  return this.size() === this.capacity();
};

/**
 * Peeks at the top element of the queue.
 *
 * @return {Object}
 * @throws {Error} when the ring buffer is empty.
 * @api public
 */
RingBuffer.prototype.peek = function() {
  if (this.isEmpty()) throw new Error('RingBuffer is empty');

  return this._elements[this._first];
};

/**
 * Peeks at multiple elements in the queue.
 *
 * @return {Array}
 * @throws {Error} when there are not enough elements in the buffer.
 * @api public
 */
RingBuffer.prototype.peekN = function(count) {
  if (count > this._size) throw new Error('Not enough elements in RingBuffer');

  var end = Math.min(this._first + count, this.capacity());
  var firstHalf = this._elements.slice(this._first, end);
  if (end < this.capacity()) {
    return firstHalf;
  }
  var secondHalf = this._elements.slice(0, count - firstHalf.length);
  return firstHalf.concat(secondHalf);
};

/**
 * Dequeues the top element of the queue.
 *
 * @return {Object}
 * @throws {Error} when the ring buffer is empty.
 * @api public
 */
RingBuffer.prototype.deq = function() {
  var element = this.peek();

  this._size--;
  this._first = (this._first + 1) % this.capacity();

  return element;
};

/**
 * Dequeues multiple elements of the queue.
 *
 * @return {Array}
 * @throws {Error} when there are not enough elements in the buffer.
 * @api public
 */
RingBuffer.prototype.deqN = function(count) {
  var elements = this.peekN(count);

  this._size -= count;
  this._first = (this._first + count) % this.capacity();

  return elements;
};

/**
 * Enqueues the `element` at the end of the ring buffer and returns its new size.
 *
 * @param {Object} element
 * @return {Number}
 * @api public
 */
RingBuffer.prototype.enq = function(element) {
  this._end = (this._first + this.size()) % this.capacity();
  var full = this.isFull()
  if (full && this._evictedCb) {
    this._evictedCb(this._elements[this._end]);
  }
  this._elements[this._end] = element;

  if (full) {
    this._first = (this._first + 1) % this.capacity();
  } else {
    this._size++;
  }

  return this.size();
};

/**
 * Returns the size of the queue.
 *
 * @return {Number}
 * @api public
 */
RingBuffer.prototype.size = function() {
  return this._size;
};
