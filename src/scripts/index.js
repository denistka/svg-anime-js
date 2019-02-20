import '../styles/index.scss';
import  SvgAnimation  from './svg-animation';

const buttons = document.querySelectorAll('.button');
let dragonSvgAnimation = null;

function initButtons() {
    buttons.forEach((el) => {
        el.addEventListener('click', (e) => {
            dragonSvgAnimation.moveTo(e.target.getAttribute('data-emotion-id'));
            document.querySelector('.button.is-active').classList.remove('is-active');
            e.target.classList.add('is-active');
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initButtons();
    dragonSvgAnimation = new SvgAnimation({
        element: document.getElementById('just-smile'),
        statesIds: ['smile', 'angry', 'surprise']
    });
});
