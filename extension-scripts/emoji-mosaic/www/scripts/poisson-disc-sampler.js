/**
 * Create a function that creates a new point on each invocation.
 *
 * Based on https://www.jasondavies.com/poisson-disc/
 *
 * @param width
 * @param height
 * @param radius Radius of the sampling circle.
 */
function poissonDiscSampler(width, height, radius) {
	// Maximum number of samples before rejection.
	var k = 10,
			radius2 = radius * radius,
			R = 3 * radius2,
			cellSize = radius * Math.SQRT1_2,
			gridWidth = Math.ceil(width / cellSize),
			gridHeight = Math.ceil(height / cellSize),
			// Create an array containing every pixel in the grid.
			// Index = y * gridWidth + x (i.e. read pixels left to right like a book).
			grid = new Array(gridWidth * gridHeight),
			queue = [],
			queueSize = 0,
			sampleSize = 0;

	/**
	 * Create a sample, or do nothing if no more samples can be made.
	 *
	 * @return {mixed}
	 */
	return function() {
		// If there are no samples yet (first time through), create a sample in the middle.
		if (!sampleSize) {
			return sample(width / 2, height /2 );
		}

		while (queueSize) {
			// Select an active sample to create a new sample from.
			var i = Math.random() * queueSize | 0,
					s = queue[i];

			/*
			 * Attempt to make a new sample from candidate points
			 * between [radius, 2 * radius] from the sample.
			 */
			for (var j = 0; j < k; ++j) {
				var a = 2 * Math.PI * Math.random(),
						r = Math.sqrt(Math.random() * R + radius2),
						x = s[0] + r * Math.cos(a),
						y = s[1] + r * Math.sin(a);

				/*
				 * Reject candidates that are outside the allowed extent,
				 * or closer than 2 * radius to any existing sample.
				 *
				 * This is the heart of Poisson-Disc.
				 */
				if (0 <= x && x < width && 0 <= y && y < height && far(x, y) ) {
					return sample(x, y);
				}
			}

			/*
			 * No candidates were good enough, deactivate the sample.
			 */
			queue[i] = queue[--queueSize];
			queue.length = queueSize;
		}
	};

	/**
	 * Whether a coordinate is far enough from other existing points.
	 *
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	function far(x, y) {
		var i = x / cellSize | 0,
				j = y / cellSize | 0,
				i0 = Math.max(i - 2, 0),
				j0 = Math.max(j - 2, 0),
				i1 = Math.min(i + 3, gridWidth),
				j1 = Math.min(j + 3, gridHeight);

		for (j = j0; j < j1; ++j) {
			var o = j * gridWidth;
			for (i = i0; i < i1; ++i) {
				if (s = grid[o + i]) {
					var s,
							dx = s[0] - x,
							dy = s[1] - y;
					if (dx * dx + dy * dy < radius2) return false;
				}
			}
		}

		return true;
	}

	/**
	 * Create a sample at an x,y coordinate.
	 *
	 * @param  {Number} x
	 * @param  {Number} y
	 * @return {Array}
	 */
	function sample(x, y) {
		var s = [x, y];
		// Push the point onto the queue.
		queue.push(s);
		grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
		++sampleSize;
		++queueSize;
		return s;
	}
}