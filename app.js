
'use strict';

/**
 * Bagel app entry point.
 * ======================================
 */

import Utils from './modules/utils.js';
import * as PIXI from 'pixi.js';
import $ from 'jquery';

((win, doc, c) => {

    let
        stage,
        renderer,

        w = win.innerWidth,
        h = win.innerHeight,

        // These are all used for the main rendering loop
        now,
        then = Date.now(),
        interval = 1000/60,
        delta;

    function render() {
        requestAnimationFrame(render);
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            renderer.render(stage);
        }
    }
    

    function init () {

        stage = new PIXI.Container();
        renderer = new PIXI.WebGLRenderer(w, h, {
            view: c,
            backgroundColor: 0xDDDDDD,
            antialias: true
        });

        window.requestAnimationFrame(render);
    }

    $(init);

})(window, document);
