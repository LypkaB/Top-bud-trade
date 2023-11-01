window.addEventListener('DOMContentLoaded', () => {
    const mainHtmlTag = document.documentElement;

    const catalogLink = document.querySelector('.header__menu--catalog');
    catalogLink.href = 'javascript:void(0);';
    const headerMenuListFirst = document.querySelector('.header__menu--list-dropdown-first');
    const nextBtnFirst = document.querySelectorAll('.next-btn--first');
    const listDropdownFirst = document.querySelector('.header__menu--list-dropdown-first');
    const listDropdownFirstItems = listDropdownFirst.querySelectorAll(':scope > .header__menu--list-dropdown-item');
    const nextBtnThird = document.querySelectorAll('.next-btn--third');
    const backBtnSecond = document.querySelectorAll('.back-btn--second');
    const backBtnThird = document.querySelectorAll('.back-btn--third');
    const closeMenuBtn = document.querySelector('.close-menu');

    catalogLink.addEventListener('click', () => {
        headerMenuListFirst.classList.add('list_show-first');
        mainHtmlTag.classList.add('overflow-hide');
    })

    nextBtnFirst.forEach(btn => {
        btn.addEventListener('click', () => {
            listDropdownFirstItems.forEach(li => {
                btn.closest('.header__menu--list-dropdown-item').classList.add('list-items--z-ind');
                li.classList.add('list-items--first_move');
            })

            btn.nextElementSibling.classList.add('list_show-second');
        })
    })

    nextBtnThird.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.list_show-second').classList.add('list_hide-second')

            btn.nextElementSibling.classList.add('list_show-third');
        })
    })

    backBtnSecond.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.header__menu--list-dropdown-second').classList.remove('list_show-second');

            listDropdownFirstItems.forEach(li => {
                li.classList.remove('list-items--z-ind');
                li.classList.remove('list-items--first_move');
            })
        })
    })

    backBtnThird.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.header__menu--list-dropdown-third').classList.remove('list_show-third');

            btn.closest('.header__menu--list-dropdown-second').classList.remove('list_hide-second');
        })
    })

    closeMenuBtn.addEventListener('click', () => {
        listDropdownFirstItems.forEach(li => li.classList.remove('list-items--first_move'))

        document.querySelectorAll('.header__menu--list-dropdown-second').forEach(list => {
            if (list.classList.contains('list_show-second')) list.classList.add('list_hide-second--non-visible');

            setTimeout(() => {
                if (list.classList.contains('list_show-second')) {
                    list.classList.remove('list_show-second');
                    list.classList.remove('list_hide-second');
                    list.classList.remove('list_hide-second--non-visible');
                }
            }, 1200)
        })

        document.querySelectorAll('.header__menu--list-dropdown-third').forEach(list => {
            if (list.classList.contains('list_show-third')) list.classList.add('list_hide-third--non-visible');

            setTimeout(() => {
                if (list.classList.contains('list_show-third')) {
                    list.classList.remove('list_show-third');
                    list.classList.remove('list_hide-third');
                    list.classList.remove('list_hide-third--non-visible');
                }
            }, 1200)
        })

        headerMenuListFirst.classList.remove('list_show-first');
        mainHtmlTag.classList.remove('overflow-hide');
    })

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
    })

    /*<----- Assortment ----->*/
    const dropdownList = document.querySelectorAll('[data-height]');
    if (dropdownList.length > 0) {
        dropdownList.forEach((element) => {
            const heightValue = element.getAttribute('data-height');

            if (heightValue) {
                element.style.setProperty('--custom-height', heightValue);
            }
        })
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
    })

    const recallBtn = document.querySelector('.contacts-links--recall');
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