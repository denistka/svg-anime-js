import anime from 'animejs';

const TRANSITION_LINK_ID_ATTR = 'data-transition-link-id';
const TRANSITION_OPTIONS_ATTR = 'data-transition-options';
const TIMELINE_TIME_OFFSET_ATTR = 'data-timeline-offset';

const DEFAULT_TIMELINE_OPTIONS = {
    easing: 'easeOutExpo',
    duration: 500,
    delay: 0,
    loop: false,
    direction: 'normal'
};

export default class {
    constructor(options) {
        this.element = options.element;
        this.statesIds = options.statesIds;
        this.baseStateIndex = options.baseStateIndex || 0;
        this.states = {};
        this.timeline = null;
        this.initStatesParams();
    }

    initStatesParams() {
        this.statesIds && this.statesIds.forEach((state) => {
            this.states[state] = this.parseStateParams(state);
        });
        this.element
            .querySelector(`#${this.statesIds[this.baseStateIndex]}`)
            .setAttribute('visibility', 'visible');
    }

    parseStateParams(state) {
        const pathElements = this.element.querySelectorAll(`#${state} [${TRANSITION_LINK_ID_ATTR}]`);
        const result = {};

        [...pathElements].forEach((path) => {
            const linkAttrValue = path.getAttribute(TRANSITION_LINK_ID_ATTR);
            const transOptionsAttrValue = path.getAttribute(TRANSITION_OPTIONS_ATTR);
            const timeOffsetAttrValue = path.getAttribute(TIMELINE_TIME_OFFSET_ATTR);

            result[linkAttrValue] = {
                path,
                values: {
                    d: anime.get(path, 'd'),
                    fill: anime.get(path, 'fill')
                },
                transition: transOptionsAttrValue ? JSON.parse(transOptionsAttrValue) : {},
                tlOffset: timeOffsetAttrValue ? timeOffsetAttrValue : null
            };
        });

        return !!Object.keys(result).length ? result : null;
    }

    moveTo(state) {
        if (!this.states[state]) return;
        !!this.timeline && this.timeline.pause();
        this.timeline = anime.timeline(DEFAULT_TIMELINE_OPTIONS);

        for (let tLinkId in this.states[this.statesIds[this.baseStateIndex]]) {
            const initialState = this.states[this.statesIds[this.baseStateIndex]][tLinkId];
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