function interface() {
	CGFinterface.call(this);
};

interface.prototype = Object.create(CGFinterface.prototype);
interface.prototype.constructor = interface;

interface.prototype.init = function (application) {
	CGFinterface.prototype.init.call(this, application);
	return true;
};
