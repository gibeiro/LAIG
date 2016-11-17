/*LINEAR ANIMATION*/
function LinearAnimation(scene, span, control_points){

  if(control_points.length < 2)
  console.warn("Animacao invalida - pontos de controlo insuficientes: " + control_points);

  this.scene = scene;
  this.span = span*1000;
  this.control_points = control_points;
  this.direction = null;
  this.angle = 0;
  this.begin = -1;
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

  if(this.begin == -1)
  this.begin = time;

  var phase = (time-this.begin)/this.span;

  if(phase > 1)
  return true;
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

  if(this.direction == null)
  this.direction = vector;

  if(!is_equal(this.direction,vector)){
    this.angle += angle_xz_between(this.direction,vector);
    this.direction = vector;
  }

  this.scene.rotate(
    this.angle,
    0,
    1,
    0
  );

  return false;
}

/*CIRCULAR ANIMATION*/
function CircularAnimation(scene,span,centerx,centery,centerz,radius,startang,rotang){
  this.scene = scene;
  this.span = span*1000;
  this.centerx = centerx;
  this.centery = centery;
  this.centerz = centerz;
  this.radius = radius;
  this.begin = -1;
  this.startang = startang*Math.PI/180;
  this.rotang = rotang*Math.PI/180;
}

CircularAnimation.prototype.constructor = CircularAnimation;


CircularAnimation.prototype.update = function(time){

if(this.begin == -1)
  this.begin = time;

  var phase = (time-this.begin)/this.span;

  if(phase > 1)
    return true;

    this.scene.translate(
      this.centerx,
      this.centery,
      this.centerz
    );

    this.scene.translate(
      this.radius*Math.cos(this.startang+phase*this.rotang),
      0,
      this.radius*Math.sin(this.startang+phase*this.rotang)
    );

  this.scene.rotate(
    -phase*this.rotang,
    0,
    1,
    0
  );

  return false;

}

function is_equal(u,v){
  return u[0] == v[0] && u[1] == v[1] && u[2] == v[2];
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

function angle_xz_between(u,v){

  var i = u;
  var j = v;
  i[1] = 0;
  j[1] = 0;
  return -angle_between(i,j);
}

function vector_size(u){
  return Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]);
}

function scalar_product(u,v){
  return u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
}
