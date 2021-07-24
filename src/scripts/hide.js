const elements = document.querySelectorAll('p');
elements.forEach(elem => {
    elem.addEventListener('click', () => {
        elem.classList.toggle('hide')
    });
});