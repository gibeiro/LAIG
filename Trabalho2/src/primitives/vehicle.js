function vehicle(scene) {
  this.patch =
  new patch(
    scene,
    3,
    3,
    10,
    10,
    [
      [
        [-0.941,	-0.942,	-0.275, 1],
        [-1.457,	-0.468,	-0.425, 1],
        [-1.457,	0.420,	-0.416, 1],
        [-0.966,	0.755,	-0.292, 1]
      ],
      [
        [-0.515,	-1.333,	-0.098, 1],
        [-0.474,	-0.498,	0.326, 1],
        [-0.524,	0.386,	0.248, 1],
        [-0.549,	1.196,	-0.107, 1]
      ],
      [
        [0.554,	-1.352,	-0.145, 1],
        [0.557,	-0.622,	0.308, 1],
        [0.568,	0.381,	0.290, 1],
        [0.489,	1.266,	-0.075, 1]
      ],
      [
        [1.112,	-1.026,	-0.404, 1],
        [1.905,	-0.525,	-0.549, 1],
        [1.906,	0.425,	-0.547, 1],
        [1.004,	0.945,	-0.281, 1]
      ]
    ]
  );
  this.torus = new torus(scene,.6,1,20,20);
  this.sphere = new sphere(scene,1,20,20);
  this.scene = scene;
};

vehicle.prototype = Object.create(CGFobject.prototype);
vehicle.prototype.constructor = vehicle;

vehicle.prototype.display = function(){

  this.scene.pushMatrix();
  this.scene.scale(1.1,1,1);
  this.scene.translate(0,0.4,0);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.patch.display();
  this.scene.popMatrix();


  this.scene.pushMatrix();
  this.scene.translate(0,0.4,0);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.torus.display();
  this.scene.popMatrix();


  this.scene.pushMatrix();
  this.scene.scale(0.8,.8,0.8);
  this.scene.translate(0,0.7,0);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.torus.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.scale(0.6,.6,0.6);
  this.scene.translate(0,1.2,0);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.torus.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.scale(0.5,0.5,0.5);
  this.scene.translate(0,2,0);
  this.sphere.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0.3,0,0);

  this.scene.scale(1.8,.5,1.5);

  this.scene.rotate(-Math.PI/2,1,0,0);
  this.torus.display();

  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,-0.4,0);
  this.scene.rotate(Math.PI/2,1,0,0);
  this.patch.display();
  this.scene.popMatrix();

}
