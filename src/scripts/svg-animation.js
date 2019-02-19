import anime from 'animejs';

if (!Object.prototype.forEach) {
    Object.defineProperty(Object.prototype, 'forEach', {
        value: function (callback, thisArg) {
            if (this == null) {
                throw new TypeError('Not an object');
            }
            thisArg = thisArg || window;
            for (let key in this) {
                if (this.hasOwnProperty(key)) {
                    callback.call(thisArg, this[key], key, this);
                }
            }
        }
    });
}

export default class {
    constructor(element) {
        this.element = element;
        this.states = {};
        this.timeline = null;
        this.initStateParams('initial');
    }

    initStateParams(state) {
        return this.states[state] ? this.states[state] : (() => {
            this.states[state] = this.getStateParams(state);
            return this.states[state];
        })();
    }


    getStateParams(state) {
        let transLinkIdAttr = 'data-transition-link-id';
        let transOpsAttr = 'data-transition-options';
        let timelineOffsetAttr = 'data-timeline-offset';
        let pathElements = this.element.querySelectorAll(`#${state} [${transLinkIdAttr}]`);
        let result = {};

        pathElements.length && pathElements.forEach((path) => {
            result[path.getAttribute(transLinkIdAttr)] = {
                path,
                values: {
                    d: anime.get(path, 'd'),
                    fill: anime.get(path, 'fill')
                },
                transition: path.getAttribute(transOpsAttr) ? JSON.parse(path.getAttribute(transOpsAttr)) : {},
                tlOffset: path.getAttribute(timelineOffsetAttr) ? path.getAttribute(timelineOffsetAttr) : null
            };
        });

        return pathElements.length ? result : null;
    }


    moveTo(state) {
        !!this.timeline && this.timeline.pause();
        this.initStateParams(state);
        if (!this.states[state]) return;

        this.timeline = anime.timeline({
            easing: 'easeOutExpo',
            duration: 500,
            delay: 0,
            loop: false,
            direction: 'normal'
        });

        this.states['initial'].forEach((initialStateEl, tLinkId) => {
            let initialValues = initialStateEl.values;
            let stateValues = !!this.states[state][tLinkId] ? this.states[state][tLinkId].values : {};
            let initialTransitionOptions = initialStateEl.transition;
            let stateTransitionOptions = !!this.states[state][tLinkId] ? this.states[state][tLinkId].transition : {};
            let timelineOffset = this.states[state][tLinkId] && this.states[state][tLinkId].tlOffset ? this.states[state][tLinkId].tlOffset : initialStateEl.tlOffset;

            let animeParams = {
                targets: initialStateEl.path,
                ...initialValues,
                ...stateValues,
                ...initialTransitionOptions,
                ...stateTransitionOptions
            };

            this.timeline.add(animeParams, timelineOffset);
        });
    }
}