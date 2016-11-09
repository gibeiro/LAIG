function Animation(scene, id, span, type) {

}

function LinearAnimation(){
  Animation.apply(this,arguments);
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;



function CircularAnimation(){
  Animation.apply(this,arguments);

}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;
