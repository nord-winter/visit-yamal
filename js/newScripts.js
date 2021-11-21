function changeLevelBlock() {
    let windowWidth = $(window).width()
    if (windowWidth < 1200) {
        $('.aurora-photos__level-inner').prepend($('.light-level__block'))
    } else {
        $('.light-level__wrapper').append($('.light-level__block'))
    }
}
changeLevelBlock()
$(window).resize(() => {
    changeLevelBlock()
})

jQuery.extend(jQuery.validator.messages, {
    required: "Заполните поле",
});
$('#ooptt-form').validate();

$('#ooptt-form__submit').on('click', function (e) {
    e.preventDefault();
    if ($('#ooptt-form').valid()) {
        let el = $(this).attr('data-popup')
        showPopup(el)
    }
})

const showPopup = el => {
    $('.popups').show();
    $('body').addClass('overlay');
    $(el).addClass('show');
};

const closeModal = () => {
    $('.popup').removeClass('show');
    $('.popups').hide();
    $('body').removeClass('overlay');
}

if ($('#planet').length) {
    (function () {
        var globe = planetaryjs.planet();
        // Load our custom `autorotate` plugin; see below.
        globe.loadPlugin(autorotate(10));
        // The `earth` plugin draws the oceans and the land; it's actually
        // a combination of several separate built-in plugins.
        //
        // Note that we're loading a special TopoJSON file
        // (world-110m-withlakes.json) so we can render lakes.
        globe.loadPlugin(planetaryjs.plugins.earth({
            topojson: { file: '/world-110m-withlakes.json' },
            oceans: { fill: '#01065a' },
            land: { fill: '#3a542b' },
            borders: { stroke: '#f2f3f3' }
        }));
        // Load our custom `lakes` plugin to draw lakes; see below.
        globe.loadPlugin(lakes({
            fill: '#000080'
        }));
        // The `pings` plugin draws animated pings on the globe.
        globe.loadPlugin(planetaryjs.plugins.pings());
        // The `zoom` and `drag` plugins enable
        // manipulating the globe with the mouse.
        globe.loadPlugin(planetaryjs.plugins.zoom({
            scaleExtent: [100, 300]
        }));
        globe.loadPlugin(planetaryjs.plugins.drag({
            // Dragging the globe should pause the
            // automatic rotation until we release the mouse.
            onDragStart: function () {
                this.plugins.autorotate.pause();
            },
            onDragEnd: function () {
                this.plugins.autorotate.resume();
            }
        }));
        // Set up the globe's initial scale, offset, and rotation.
        globe.projection.scale(175).translate([175, 175]).rotate([0, -10, 0]);

        var color = '#6de444';
        setInterval(function () {
            globe.plugins.pings.add(65.578929, 78.12177, { color: color, ttl: 2000, angle: Math.random() * 20 });
        }, 150);
        setInterval(function () {
            globe.plugins.pings.add(71.499709, 82.692082, { color: color, ttl: 2000, angle: Math.random() * 20 });
        }, 150);
        setInterval(function () {
            globe.plugins.pings.add(77.475157, 79.176457, { color: color, ttl: 2000, angle: Math.random() * 20 });
        }, 150); setInterval(function () {
            globe.plugins.pings.add(80.477243, 71.442082, { color: color, ttl: 2000, angle: Math.random() * 20 });
        }, 150);

        var canvas = document.getElementById('globe');
        // Special code to handle high-density displays (e.g. retina, some phones)
        // In the future, Planetary.js will handle this by itself (or via a plugin).
        if (window.devicePixelRatio == 2) {
            canvas.width = 800;
            canvas.height = 800;
            context = canvas.getContext('2d');
            context.scale(2, 2);
        }
        // Draw that globe!
        globe.draw(canvas);

        // This plugin will automatically rotate the globe around its vertical
        // axis a configured number of degrees every second.
        function autorotate(degPerSec) {
            // Planetary.js plugins are functions that take a `planet` instance
            // as an argument...
            return function (planet) {
                var lastTick = null;
                var paused = false;
                planet.plugins.autorotate = {
                    pause: function () { paused = true; },
                    resume: function () { paused = false; }
                };
                // ...and configure hooks into certain pieces of its lifecycle.
                planet.onDraw(function () {
                    if (paused || !lastTick) {
                        lastTick = new Date();
                    } else {
                        var now = new Date();
                        var delta = now - lastTick;
                        // This plugin uses the built-in projection (provided by D3)
                        // to rotate the globe each time we draw it.
                        var rotation = planet.projection.rotate();
                        rotation[0] += degPerSec * delta / 1000;
                        if (rotation[0] >= 180) rotation[0] -= 360;
                        planet.projection.rotate(rotation);
                        lastTick = now;
                    }
                });
            };
        };

        // This plugin takes lake data from the special
        // TopoJSON we're loading and draws them on the map.
        function lakes(options) {
            options = options || {};
            var lakes = null;

            return function (planet) {
                planet.onInit(function () {
                    // We can access the data loaded from the TopoJSON plugin
                    // on its namespace on `planet.plugins`. We're loading a custom
                    // TopoJSON file with an object called "ne_110m_lakes".
                    var world = planet.plugins.topojson.world;
                    lakes = topojson.feature(world, world.objects.ne_110m_lakes);
                });

                planet.onDraw(function () {
                    planet.withSavedContext(function (context) {
                        context.beginPath();
                        planet.path.context(context)(lakes);
                        context.fillStyle = options.fill || 'black';
                        context.fill();
                    });
                });
            };
        };
    })();
}