/*LINEAR ANIMATION*/
function LinearAnimation(scene, span, control_points){

  console.log("new linear animation");
  if(control_points.length < 2)
  console.warn("Animacao invalida - pontos de controlo insuficientes: " + control_points);

  this.scene = scene;
  this.span = span*1000;
  this.control_points = control_points;
  this.distances = [];

  for(var i = 1; i < control_points.length; i++){

    this.distances.push(
      Math.sqrt(
        Math.pow(control_points[i][0]-control_points[i-1][0],2)+
        Math.pow(control_points[i][1]-control_points[i-1][1],2)+
        Math.pow(control_points[i][2]-control_points[i-1][2],2)
      )
    );

  }

  this.distances.push(
    Math.sqrt(
      Math.pow(control_points[control_points.length - 1][0]-control_points[0][0],2)+
      Math.pow(control_points[control_points.length - 1][1]-control_points[0][1],2)+
      Math.pow(control_points[control_points.length - 1][2]-control_points[0][2],2)
    )
  );

  for(var i = 1; i < this.distances.length;i++)
  this.distances[i] += this.distances[i-1];
}

LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(time){

  var phase = (time%this.span)/this.span;
  var distance = this.distances[this.distances.length - 1]*phase;
  var control_point_i = [], control_point_f = [], control_point = [], control_point_phase;
  var distance_i, distance_f;

  for(var i = 0; i < this.distances.length; i++){

    if(this.distances[i] > distance){
      distance_f = this.distances[i];
      if(i > 0)
      distance_i = this.distances[i-1];
      else
      distance_i = 0;

      control_point_i = this.control_points[i];
      if(i == this.control_points.length - 1)
      control_point_f = this.control_points[0];
      else
      control_point_f = this.control_points[i+1];

      break;
    }
  }

  control_point_phase = (distance-distance_i)/(distance_f-distance_i);

  var vector = [];
  vector.push(
    control_point_f[0]-control_point_i[0],
    control_point_f[1]-control_point_i[1],
    control_point_f[2]-control_point_i[2]
  );

  control_point.push(
    control_point_i[0]+control_point_phase*vector[0],
    control_point_i[1]+control_point_phase*vector[1],
    control_point_i[2]+control_point_phase*vector[2]
  );


  this.scene.translate(
    control_point[0],
    control_point[1],
    control_point[2]
  );
  this.scene.rotate(
    angle_between(vector,),
    cross
  );
  this.scene.rotate(
    Math.atan(vector[1]/vector[2]),
    1,
    0,
    0
  );



}

/*CIRCULAR ANIMATION*/
function CircularAnimation(scene,span,centerx,centery,centerz,radius,startang,rotang){
  console.log("new circular animation");
  this.scene = scene;
  this.span = span*1000;
  this.centerx = centerx;
  this.centery = centery;
  this.centerz = centerz;
  this.radius = radius;
  this.startang = startang*Math.PI/180;
  this.rotang = rotang*Math.PI/180;
  if(this.rotang > 0)
  this.orientation = Math.PI/2;
  else
  this.orientation = -Math.PI/2;
}

CircularAnimation.prototype.constructor = CircularAnimation;


CircularAnimation.prototype.update = function(time){

  //console.log("circular animation update");


  var phase = (time%this.span)/this.span;
  //console.log(phase);

  var orientation = phase*this.rotang+this.orientation;
  //console.log(orientation);

  //orientacao do objecto



  //  console.log(this.radius*Math.cos(this.startang));
  //console.log(this.radius*Math.sin(this.startang));

  //posicao inicial


  //fracao da trajetoria

  //centrar
  /*


  this.scene.rotate(
  phase*this.rotang,
  0,
  1,
  0
);
*/
this.scene.rotate(
  orientation,
  0,
  1,
  0
);

this.scene.translate(
  this.radius*Math.cos(this.startang),
  0,
  this.radius*Math.sin(this.startang)
);

this.scene.translate(
  this.centerx,
  this.centery,
  this.centerz
);


}

function cross(u,v){
  return [
    u[1]*v[2]-u[2]*v[1],
    u[2]*v[0]-u[0]-v[2],
    u[0]*v[1]-u[1]*v[0]
  ];
}

function angle_between(u,v){
  return Math.acos(scalar_product(u,v)/vector_size(u)/vector_size(v));
}

function vector_size(u){
  return sqrt(
    pow(u[0],2),
    pow(u[1],2),
    pow(u[2],2)
  );
}

function scalar_product(u,v){
  return u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
}
