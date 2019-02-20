import anime from 'animejs';

export default class {
    constructor(options) {
        this.element = options.element;
        this.statesIds = options.statesIds;
        this.states = {};
        this.timeline = null;
        this.statesIds && this.statesIds.forEach((state) => {
            this.initStatesParams(state);
        });
    }

    initStatesParams(state) {
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

        this.states[state] = pathElements.length ? result : null;
    }

    moveTo(state) {
        if (!this.states[state]) return;

        !!this.timeline && this.timeline.pause();
        this.timeline = anime.timeline({
            easing: 'easeOutExpo',
            duration: 500,
            delay: 0,
            loop: false,
            direction: 'normal'
        });

        for (let tLinkId in this.states[this.statesIds[0]]) {
            const initialState = this.states[this.statesIds[0]][tLinkId];
            const nextState = this.states[state][tLinkId];
            const initialValues = initialState.values;
            const stateValues = !!nextState ? nextState.values : {};
            const initialTransitionOptions = initialState.transition;
            const stateTransitionOptions = !!nextState ? nextState.transition : {};
            const timelineOffset = nextState && nextState.tlOffset ? nextState.tlOffset : initialState.tlOffset;

            const animeParams = {
                targets: initialState.path,
                ...initialValues,
                ...stateValues,
                ...initialTransitionOptions,
                ...stateTransitionOptions
            };

            this.timeline.add(animeParams, timelineOffset);
        }
    }
}