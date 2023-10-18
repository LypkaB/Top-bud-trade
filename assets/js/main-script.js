window.addEventListener('DOMContentLoaded', () => {
    /*<----- Presentation slider ----->*/
    const swiper = new Swiper('.banner__swiper', {
        slidesPerView: 1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 2500,
        },
    });

    /*<----- Assortment ----->*/
    const dropdownList = document.querySelectorAll('[data-height]');
    if (dropdownList.length > 0) {
        dropdownList.forEach((element) => {
            const heightValue = element.getAttribute('data-height');

            if (heightValue) {
                element.style.setProperty('--custom-height', heightValue);
            }
        });
    }

    /*<----- Recall modal ----->*/
    const fieldsRecallModal = document.querySelectorAll('.recall__form input, .recall__form textarea');

    function handleFocus(event) {
        const label = event.target.previousElementSibling;

        if (label) label.classList.add('field-up');
    }

    function handleBlur(event) {
        const field = event.target;
        const label = field.previousElementSibling;

        if (field.value.trim() === '' && label) label.classList.remove('field-up');
    }

    fieldsRecallModal.forEach(field => {
        field.addEventListener('focus', handleFocus);
        field.addEventListener('blur', handleBlur);
    });

    const mainHtmlTag = document.documentElement;
    const recallBtn = document.querySelector('.header__recall');
    const recallModal = document.querySelector('.recall__modal');
    const recallCloseModal = document.querySelector('.recall__modal-close');

    function openModal() {
        mainHtmlTag.classList.add('overflow-hide');
        recallModal.classList.remove('hide');
    }

    function closeModal() {
        mainHtmlTag.classList.remove('overflow-hide');
        recallModal.classList.add('hide');
    }

    function handleKeydown(event) {
        if (event.keyCode === 27) closeModal();
    }

    recallBtn.addEventListener('click', openModal);
    recallCloseModal.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeydown);
})