import SvgAnimation from './svg-animation';

function initButtons(animationInstance) {
  const buttons = document.querySelectorAll('.button');

  buttons.forEach((el) => {
    el.addEventListener('click', (event) => {
      const target = event.currentTarget;
      animationInstance.moveTo(target.getAttribute('data-emotion-id'));
      document.querySelector('.button.is-active')?.classList.remove('is-active');
      target.classList.add('is-active');
    });
  });
}

export function setupSvgAnimation() {
  const svgElement = document.getElementById('just-smile');
  if (!svgElement) return;

  const animation = new SvgAnimation({
    element: svgElement,
    statesIds: ['smile', 'love', 'angry', 'surprise'],
  });

  initButtons(animation);
}
