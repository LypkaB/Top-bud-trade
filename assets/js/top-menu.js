import {getData} from './api/api.js';
import {createMenu} from './markup/menu.js';
import {menuCatalogEl, menuNavEl} from './refs.js';
import {getMenuStructure, addMarkup, createADataObj} from './helper/index.js';
import {saveDataToSectionStore} from './api/sectionstore.js';

async function onLoad() {
    try {
        const response = await getData();
        const data = getMenuStructure(response);
        const htmlMenu = createMenu(data);
        addMarkup(menuCatalogEl, htmlMenu);
        addAdaptiveSidebar();
    } catch ({message}) {
        console.log(message);
    }
}

onLoad();

menuNavEl.addEventListener('click', (e) => {
    if (!e.target.classList.contains('item')) return;
    const {group, category} = e.target.dataset;
    const data = createADataObj(group, category);
    saveDataToSectionStore(data);
});

function addAdaptiveSidebar() {
    const mainHtmlTag = document.documentElement;
    const catalogLink = document.querySelector('.header__menu--catalog');
    const headerMenuListFirst = document.querySelector('.header__menu--list-dropdown-first');
    const nextBtnFirst = document.querySelectorAll('.next-btn--first');
    const listDropdownFirst = document.querySelector('.header__menu--list-dropdown-first');
    const listDropdownFirstItems = listDropdownFirst.querySelectorAll(':scope > .header__menu--list-dropdown-item');
    const nextBtnThird = document.querySelectorAll('.next-btn--third');
    const backBtnSecond = document.querySelectorAll('.back-btn--second');
    const backBtnThird = document.querySelectorAll('.back-btn--third');
    const closeMenuBtn = document.querySelector('.close-menu');

    if (window.innerWidth < 640) {
        catalogLink.addEventListener('click', (e) => {
            e.preventDefault();
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
    }
}