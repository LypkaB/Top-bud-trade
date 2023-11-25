window.addEventListener('DOMContentLoaded', () => {
    /*<----- Header adaptive sidebar ----->*/
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

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 640) catalogLink.href = 'javascript:void(0);';
        else catalogLink.href = 'catalog.html';
    })

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

    /*<----- Manipulation with input labels ----->*/
    const recallModalFields = document.querySelectorAll('.recall__form input[type="text"], .recall__form textarea');
    const contactsFormFields = document.querySelectorAll('.contacts-content__form input[type="text"], .contacts-content__form textarea');

    function labelFieldUp(element, valueName) {
        element.forEach((field, index) => {
            if (sessionStorage.getItem(`${valueName} ${index}`) !== null) {
                field.value = sessionStorage.getItem(`${valueName} ${index}`);
                field.previousElementSibling.classList.add('field_up');
            }

            field.addEventListener('focus', (e) => {
                const label = e.target.previousElementSibling;
                if (label) label.classList.add('field_up');
            })

            field.addEventListener('blur', (e) => {
                const field = e.target;
                const label = field.previousElementSibling;

                if (field.value !== '') {
                    sessionStorage.setItem(`${valueName} ${index}`, field.value);
                } else if (field.value === '') {
                    sessionStorage.removeItem(`${valueName} ${index}`);
                    label.classList.remove('field_up');
                }
            })
        })
    }

    if (contactsFormFields) labelFieldUp(contactsFormFields, 'contacts');
    labelFieldUp(recallModalFields, 'recall');

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

    /*<----- Catalog - sort ----->*/
    let productsData = [];
    const loadingEmptyItem = document.querySelectorAll('.empty-item');
    const sortSelect = document.getElementById('sortSelect');

    function generateHTML(products) {
        return products.map(product => {
            let characteristicsHTML = '';
            let characteristicsCount = 0;

            for (let i = 1; i <= 10; i++) {
                const nameKey = `Назва_характеристики_${i}`;
                const valueKey = `Значення_характеристики_${i}`;
                if (product[nameKey] && product[valueKey]) {
                    characteristicsHTML += `<span>${product[nameKey]}: ${product[valueKey]}</span>`;
                    characteristicsCount++;
                }
            }

            const bottomValue = -25.8 * characteristicsCount;

            return `
                <div class="catalog__item-wrap">
                    <div class="catalog__item">
                        <span class="catalog__item--title">${product["Назва_позиції"]}</span>
                        
                        <div class="catalog__item--img">
                            <img src="./assets/images/products/${product["Зображення"]}" alt="${product["Назва_позиції"]}">
                        </div>
                        
                        <span>${product["Ціна"]} грн/${product["Одиниця_виміру"]}</span>
                        
                        <div class="catalog__item--descr" style="bottom: ${bottomValue}px">
                            ${characteristicsHTML}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function sortProducts(data, sortType) {
        switch (sortType) {
            case 'name-asc':
                return data.sort((a, b) => a["Назва_позиції"].localeCompare(b["Назва_позиції"]));
            case 'name-desc':
                return data.sort((a, b) => b["Назва_позиції"].localeCompare(a["Назва_позиції"]));
            case 'price-asc':
                return data.sort((a, b) => parseFloat(a["Ціна"]) - parseFloat(b["Ціна"]));
            case 'price-desc':
                return data.sort((a, b) => parseFloat(b["Ціна"]) - parseFloat(a["Ціна"]));
            default:
                return data.sort((a, b) => parseFloat(a["Номер_позиції"]) - parseFloat(b["Номер_позиції"]));
        }
    }

    function displayProducts(products) {
        const productsContainer = document.querySelector('.catalog__grid');
        productsContainer.innerHTML = generateHTML(products);
        hideLoadingPattern();
    }

    function hideLoadingPattern() {
        loadingEmptyItem.forEach(item => item.classList.add('hide'));
    }

    function handleSortChange() {
        const sortOption = sortSelect.value;
        sessionStorage.setItem('selectedSortOption', sortOption);
        displayProducts(sortProducts(productsData, sortOption));
    }

    fetch('catalog.json')
        .then(response => response.json())
        .then(data => {
            productsData = data;
            const selectedSortOption = sessionStorage.getItem('selectedSortOption') || 'default';
            sortSelect.value = selectedSortOption;
            displayProducts(sortProducts(data, selectedSortOption));
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoadingPattern();
        });

    sortSelect.addEventListener('change', handleSortChange);
})