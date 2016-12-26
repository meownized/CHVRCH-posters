function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#0000ff');
  strokeWeight(1);
  stroke('#0000ff');
  frameRate(10);
}

function draw() {
  for (var i = 0; i < height/2; i++) {
    var blueColor = blue;
    var greenColor = blue;
    var blueColor = blue;
    var alphaColor = blue;
    var w = random(width); //random X
    var h = random(height); //random Y
    var s = random(40); //random diameter
    fill(blueColor, blueColor, blueColor, alphaColor);

  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

///
var container,
    renderer,
    scene,
    camera,
    mesh,
    start = Date.now(),
    fov = 30;

window.addEventListener( 'load', function() {

    // Grab the container from the DOM
    container = document.getElementById( "container" );

    // My scene
    scene = new THREE.Scene();

    // My camera
    camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        1,
        10000 );
    camera.position.z = 150;
    camera.target = new THREE.Vector3( 0, 0, 0 );

    scene.add( camera );
    scene.background = new THREE.Color( 0x000 );


    // My shader
   material = new THREE.ShaderMaterial( {

    uniforms: {
        time: {
            type: "e",
            value: 28.0
        }
    },

    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent


} );

    // Sphere and Geometry
    mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 18, 100, 300 ),
        material

    );

    scene.add( mesh );

    // My renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    render();

    window.addEventListener( 'resize', function() {
      var width = window.innerWidth;
      var height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize( width, height );
    })
} );

function render() {

    // A little light
    renderer.render( scene, camera );
    requestAnimationFrame( render );
  material.uniforms[ 'time' ].value = .00056 * ( Date.now() - start );

}
