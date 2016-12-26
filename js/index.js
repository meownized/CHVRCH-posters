var ww, wh, renderer, scene, camera, curves;

var gradient = [
  [
    0,
    [239,217,115]
  ],
  [
    0.25,
    [209,40,99]
  ],
  [
    0.7,
    [109,20,114]
  ],
  [
    1,
    [77,180,215]
  ]
];
function init() {

  ww = window.innerWidth;
  wh = window.innerHeight;

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene"),
    antialias: true,
    alpha: true
  });
  renderer.setSize(ww, wh);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xffffff, 50, 200);

  camera = new THREE.PerspectiveCamera(50, ww / wh, 1, 10000);
  camera.position.set(0, 0, 1200);
  scene.add(camera);

  // var controls = new THREE.OrbitControls(camera);

  maxHeight = 500;

  curves = new THREE.Object3D();
  curves.rotation.x = Math.PI*0.5;
  scene.add(curves);
  for(var i=0;i<1000;i++){
    addCurve(i);
  }

  requestAnimationFrame(render);
  window.addEventListener("click", onClick);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", onMouseMove);
}

function addCurve(index){
  var random = Math.random()*Math.PI;
  var radius = 200;
  var pos1 = {
    x : Math.sin(random)*(radius+(Math.random()-0.5)*10),
    y : Math.random()*maxHeight,
    z : Math.cos(random)*(radius+(Math.random()-0.5)*10)
  };
  var pos2 = {
    x : Math.sin(random-Math.PI)*(radius+(Math.random()-0.5)*10),
    y : pos1.y,
    z : Math.cos(random-Math.PI)*(radius+(Math.random()-0.5)*10)
  };
  var curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3( pos1.x, pos1.y, pos1.z ),
    new THREE.Vector3( (Math.random()-0.5)*radius,(Math.random()-0.5)*(maxHeight) + maxHeight*0.5,(Math.random()-0.5)*radius ),
    new THREE.Vector3( (Math.random()-0.5)*radius,(Math.random()-0.5)*(maxHeight) + maxHeight*0.5,(Math.random()-0.5)*radius ),
    new THREE.Vector3( pos2.x, pos2.y, pos2.z )
  );

  var geometry = new THREE.Geometry();
  geometry.vertices = curve.getPoints(25);

  //From http://stackoverflow.com/a/30144587/4169963
  var colorRange = [];
  var yNorm = pos1.y/maxHeight;
  for(var i=0;i<gradient.length;i++){
    if(yNorm <= gradient[i][0]){
      colorRange = [i-1,i];
      i=gradient.length;
    }
  }
  var firstcolor = gradient[[colorRange[0]]][1];
  var secondcolor = gradient[colorRange[1]][1];

  var firstcolor_x = maxHeight*(gradient[colorRange[0]][0]/100);
  var secondcolor_x = maxHeight*(gradient[colorRange[1]][0]/100)-firstcolor_x;
  var slider_x = maxHeight*(yNorm/100)-firstcolor_x;
  var ratio = slider_x/secondcolor_x;
  var result = pickHex( secondcolor,firstcolor, ratio ).join(",");

  var material = new THREE.LineBasicMaterial( {
    color : new THREE.Color("rgb("+result+")"),
    transparent: true,
    opacity:1
  });

  var curveObject = new THREE.Line( geometry, material );
  TweenMax.to(curveObject.rotation, Math.random()*200+100,{
    y : Math.PI * (Math.random()<0.5?1:-1),
    repeat:-1,
    ease:Linear.easeOut
  });
  curves.add(curveObject);
}

function pickHex(color1, color2, weight) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}


var lateral = true;
function onClick() {
  if(lateral){
    TweenMax.to(curves.rotation, 0.5, {
      x : 0,
      ease: Power2.easeOut
    });
    TweenMax.to(curves.position, 0.5, {
      y : -maxHeight*0.5,
      ease: Power2.easeOut
    });
  }
  else{
    TweenMax.to(curves.rotation, 0.5, {
      x : Math.PI*0.5,
      ease: Power2.easeOut
    });
    TweenMax.to(curves.position, 0.5, {
      y : 0,
      ease: Power2.easeOut
    });
  }
  lateral = !lateral;
}
function onMouseMove(e) {
  var mouse = {
      x : (e.clientX-ww*0.5)/(ww*0.5), //From -1 to 1
      y : (e.clientY-wh*0.5)/(wh*0.5) //From -1 to 1
    };

  TweenMax.to(camera.position, 2, {
    z : mouse.y*maxHeight*0.8 + maxHeight*1,
    ease: Power2.easeOut
  });
  TweenMax.to(camera.rotation, 2, {
    z : mouse.x*Math.PI*0.25,
    ease: Power3.easeOut
  });
}

function onWindowResize() {
  ww = window.innerWidth;
  wh = window.innerHeight;

  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();

  renderer.setSize(ww, wh);
}


var prevA = 0;
function render(a) {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
}

init();
