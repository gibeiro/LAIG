
/**
 * Interface object constructor
 */
function interface() {
	CGFinterface.call(this);
};

interface.prototype = Object.create(CGFinterface.prototype);
interface.prototype.constructor = interface;


/**
 * Initiates interface with default values
 *
 * @param  {type} application CGFapplication object
 * @return {type}             Allways returns true
 */
interface.prototype.init = function (application) {
	CGFinterface.prototype.init.call(this, application);
	return true;
};
