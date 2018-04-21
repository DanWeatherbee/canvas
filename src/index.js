var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

canvas.render = function() {
    console.log(this.width);
    this.width = innerWidth - 20;
    this.height = innerHeight - 21;
    this.id = "game-area";
    this.style = "background-color:black;";
    document.body.insertBefore(this, document.body.childNodes[0]);
};
canvas.init = function() {
    this.render();
};
canvas.clear = function() {
    ctx.clearRect(0, 0, this.width, this.height);
};
canvas.random = function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};
canvas.color = function(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    return "rgba(" +
        this.a.toString() +
        ", " +
        this.b.toString() +
        ", " +
        this.c.toString() +
        ", " +
        this.d.toString() +
        ")";
};

canvas.init();
var mouse = {
        x: undefined,
        y: undefined
    },
    maxRadius = 50,
    minRadius = 3,
    gravity = 1,
    friction = 0.99;

function Circle(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = canvas.color(
        canvas.random(255),
        canvas.random(255),
        canvas.random(255),
        canvas.random(255)
    );
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.fill();
        ctx.stroke();
        this.update();
    };
    this.update = function() {
        // if (this.x + this.radius * 2 > innerWidth || this.x - this.radius < 0) {
        //     this.dx = -this.dx;
        // }
        if (this.y + (this.radius * 2) + this.dy > innerHeight) {
            this.dy = -this.dy * friction;
        } else {
            this.dy += gravity;
        }
        if (this.x + this.radius + this.dx > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        this.y += this.dy;
        this.x += this.dx;

        // Interactivity

        if (mouse.x - this.x < 50 &&
            mouse.x - this.x > -50 &&
            mouse.y - this.y < 50 &&
            mouse.y - this.y > -50) {
            if (this.radius < maxRadius) {
                this.radius += 1;
            }

        } else if (this.radius > minRadius) {
            this.radius -= 1;
        }

    }
};

var circleArray = [];

function init() {
    circleArray = [];
    for (var i = 0; i <= 1000; i++) {
        circleArray.push(
            new Circle(
                canvas.random(innerWidth - 30) + 30,
                canvas.random(innerHeight - 20) - 30,
                minRadius,
                canvas.random(4),
                1
            )
        )
    };
};
// shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
// Determines the distance between two objects from center to center.
function getDistance(x1, y1, x2, y2) {
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.sqrt(// Pythagoras theorem formula.
        Math.pow(
            xDistance,
            2
        ) +
        Math.pow(
            yDistance,
            2
        )
    );
};

(function animloop() {
    requestAnimFrame(animloop);

    canvas.clear();
    circleArray.forEach(function(i) {
        i.draw();
    });

})();
// place the rAF *before* the render() to assure as close to
// 60fps with the setTimeout fallback.

window.addEventListener('mousemove',
    function(evt) {
        mouse.x = evt.pageX;
        mouse.y = evt.pageY;
    });
window.addEventListener('resize',
    function() {
        canvas.width = innerWidth - 20;
        canvas.height = innerHeight - 21;
        init();
    });



init();