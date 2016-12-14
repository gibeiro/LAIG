//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

serialInclude([
  '../lib/CGF.js',
  'src/primitives/game.js',
  'src/primitives/chessboard.js',
  'src/primitives/patch.js',
  'src/primitives/plane.js',
  'src/primitives/vehicle.js',
  'src/primitives/cylinder.js',
  'src/primitives/triangle.js',
  'src/primitives/sphere.js',
  'src/primitives/torus.js',
  'src/primitives/rectangle.js',
  'src/primitives/piece.js',
  'src/animations.js',
  'src/interface.js',
  'src/scene.js',
  'src/graph.js',
  'src/tree.js',

main=function()
{
    var app = new CGFapplication(document.body);
    var myScene = new scene();
    var myInterface = new interface();
    app.init();
    app.setScene(myScene);
    app.setInterface(myInterface);
    myInterface.setActiveCamera(myScene.camera);
    var filename = getUrlVars()['file'] || "../res/dsx/test.dsx";
    var mySceneGraph = new graph(filename, myScene);
    app.run();
}
]);

function getPrologRequest(requestString, onSuccess, onError, port)
{
  var requestPort = port || 8081
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
}

function makeRequest()
{
  // Get Parameter Values
  var requestString = document.querySelector("#query_field").value;

  // Make Request
  getPrologRequest(requestString, handleReply);
}

//Handle the Reply
function handleReply(data){
  document.querySelector("#query_result").innerHTML=data.target.response;
}
