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

  console.log(this.distances);
  console.log(this.total_distance);
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

  control_point_phase = (distance_f-distance)/(distance_f-distance_i);

  console.log(distance_i);
  console.log(distance);
  console.log(distance_f);

  control_point.push(
    control_point_phase*(control_point_f[0]+control_point_i[0]),
    control_point_phase*(control_point_f[1]+control_point_i[1]),
    control_point_phase*(control_point_f[2]+control_point_i[2])
  );

  console.log(control_point_i);
  console.log(control_point);
  console.log(control_point_f);

  this.scene.translate(
    control_point[0],
    control_point[1],
    control_point[2]
  );



/*
  var phase = (time%this.span)/this.span;
  var distance_phase = phase*this.total_distance;
  var control_point_i = [], control_point_f = [], control_point_phase = [];
  var distance_i, distance_f;

  for(var i = 0 ; i < this.distances.length;i++){

    if(this.distances[i] > distance_phase){

      distance_f = this.distances[i];
      if(i > 0){
        distance_i = this.distances[i-1];
      }
      else {
        distance_i = 0;
      }

      control_point_i = this.control_points[i];
      if(i == this.control_points.length - 1){
        control_point_f = this.control_points[0];
      }
      else {
        control_point_f = this.control_points[i+1];
      }

      break;
    }
  }
  console.log(distance_phase);
  console.log(control_point_i);
  console.log(control_point_f);


  control_point_phase.push(
    phase*(control_point_f[0]-control_point_i[0]),
    phase*(control_point_f[0]-control_point_i[0]),
    phase*(control_point_f[0]-control_point_i[0])
  );
  console.log(control_point_phase);

/*
  this.scene.rotate(
    Math.atan(
      (control_point_f[0]-control_point_i[0])/
      (control_point_f[1]-control_point_i[1])
    ),
    0,
    0,
    1
  );

  this.scene.rotate(
    Math.atan(
      (control_point_f[0]-control_point_i[0])/
      (control_point_f[2]-control_point_i[2])
    ),
    0,
    1,
    0
  );

  this.scene.translate(
    control_point_phase[0],
    control_point_phase[1],
    control_point_phase[2]
  );
  */
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
