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
        this.initStateParams();
    }

    initStateParams(state = 'initial') {
        return this.states[state] ? this.states[state] : (() => {
            this.states[state] = this.getStateParams(state);
            return this.states[state];
        })();
    }


    getStateParams(state) {
        const transLinkIdAttr = 'data-transition-link-id';
        const transOpsAttr = 'data-transition-options';
        const timelineOffsetAttr = 'data-timeline-offset';
        const pathElements = this.element.querySelectorAll(`#${state} [${transLinkIdAttr}]`);
        const result = {};

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
            const initialValues = initialStateEl.values;
            const stateValues = !!this.states[state][tLinkId] ? this.states[state][tLinkId].values : {};
            const initialTransitionOptions = initialStateEl.transition;
            const stateTransitionOptions = !!this.states[state][tLinkId] ? this.states[state][tLinkId].transition : {};
            const timelineOffset = this.states[state][tLinkId] && this.states[state][tLinkId].tlOffset ? this.states[state][tLinkId].tlOffset : initialStateEl.tlOffset;

            const animeParams = {
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