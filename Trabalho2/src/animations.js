function Animation(scene, id, span) {
  this.scene = scene;
  this.id = id;
  this.span = span;
  this.matrixes = [];
}

/*LINEAR ANIMATION*/
function LinearAnimation(scene, id, span, control_points){
  if(control_points.length < 2)
    console.warn("Animacao invalida - pontos de controlo insuficientes: " + control_points);

  this = new Animation(scene, id, span);
  this.control_points = control_points;
  this.distances = [];
  this.distances.push(
    Math.sqrt(
      Math.pow(control_points[0][0] - control_points[1][0],2)+
      Math.pow(control_points[0][1] - control_points[1][1],2)+
      Math.pow(control_points[0][2] - control_points[1][2],2)
    )
  );
  for(var i = 2; i < control_points.length;i++){
    this.distances.push(
      this.distances[i-2] +
      Math.sqrt(
        Math.pow(control_points[i][0] - control_points[i-1][0],2)+
        Math.pow(control_points[i][1] - control_points[i-1][1],2)+
        Math.pow(control_points[i][2] - control_points[i-1][2],2)
      )
    );
  }
  var last = control_points.length - 1;
  this.total_distance =
  Math.sqrt(
    distances[last - 2] +
      Math.pow(control_points[0][0] - control_points[last][0],2)+
      Math.pow(control_points[0][1] - control_points[last][1],2)+
      Math.pow(control_points[0][2] - control_points[last][2],2)
    );
  this.distances.push(this.total_distance);
}

LinearAnimation.prototype.update = function(time){
  var phase = (time%this.span)/this.span;
  var distance = phase*this.total_distance;
  var control_point_i, control_point_f, control_point_phase;
  var distance_i, distance_f;
  for(var i = 0 ; i < this.distances.length;i++){
    if(distances[i] > distance){
      control_point_i = this.control_points[i];
      distance_f = this.distances[i];
      if(i == 0)
        distance_i = 0;
      else
        distance_i = this.distances[i-1];
      control_point_phase = (distance_f-distance_i)/(distance-distance_i);
      if(i + 1 == this.distances.length)
        control_point_f = this.control_points[0];
      else
        control_point_f = this.control_points[i+1];
      break;
    }
  }

  var control_point = [];
  control_point.push(
    control_point_phase*(control_point_f[0]-control_point_i[0]),
    control_point_phase*(control_point_f[1]-control_point_i[1]),
    control_point_phase*(control_point_f[2]-control_point_i[2])
  );

  this.scene.rotate(
    0,
    0,
    1,
    Math.atan(
      (control_point_f[0]-control_point_i[0])/
      (control_point_f[1]-control_point_i[1])
    )
  );
  this.scene.rotate(
    0,
    1,
    0,
    Math.atan(
      (control_point_f[0]-control_point_i[0])/
      (control_point_f[2]-control_point_i[2])
    )
  );
  this.scene.translate(
    control_point[0],
    control_point[1],
    control_point[2]
  );
}





 /*CIRCULAR ANIMATION*/
function CircularAnimation(scene, id, span,centerx,centery,centerz,radius,starang,rotang){
    this = new Animation(scene, id, span);
    this.centerx = centerx;
    this.centery = centery;
    this.centerz = centerz;
    this.radius = radius;
    this.starang = starang*Math.PI/180;
    this.rotang = rotang*Math.PI/180;
}

CircularAnimation.prototype.update = function(time){
  var phase = (time%this.span)/this.span;

  var orientation = phase*this.rotang;
  if(this.rotang > 0)
    orientation += Math.PI/2;
  else
    orientation -= Math.PI/2;

  //orientacao do objecto
  this.scene.rotate(
    0,
    1,
    0,
    orientation
  );

  //posicao inicial
  this.scene.translate(
    this.radius*Math.cos(this.startang),
    0,
    this.radius*Math.sin(this.startang)
  );

  //fracao da trajetoria
  this.scene.rotate(
    0,
    1,
    0,
    phase*this.rotang
  );

  //centrar
  this.scene.translate(
    this.centerx,
    this.centery,
    this.centerz
  );
}
