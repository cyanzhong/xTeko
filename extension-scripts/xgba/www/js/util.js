Object.prototype.inherit = function() {
	for (var v in this) {
		this[v] = this[v];
	}
};
