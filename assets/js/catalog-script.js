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

    function generateHTML(products) {
        return products.map(product => `
            <div class="catalog__item-wrap">
                <div class="catalog__item">
                    <span class="catalog__item--title">${product["Название_позиции_укр"]}</span>
                    <div class="catalog__item--img">
                        <img src="${product["Ссылка_изображения"]}" alt="${product["Название_позиции_укр"]}">
                    </div>
                    <span>${product["Цена"]} грн/${product["Единица_измерения"]}</span>
                    <div class="catalog__item--descr">
                        <span>Довжина</span>
                        <span>Ширина</span>
                        <span>Висота</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function sortProductsDefault() {
        return productsData.sort((a, b) => {
            const priceA = parseFloat(a["Уникальный_идентификатор"]);
            const priceB = parseFloat(b["Уникальный_идентификатор"]);
            return priceA - priceB;
        })
    }

    function sortProductsAlphabetAsc() {
        return productsData.sort((a, b) =>
            a["Название_позиции_укр"].localeCompare(b["Название_позиции_укр"])
        )
    }

    function sortProductsAlphabetDesc() {
        return productsData.sort((a, b) =>
            b["Название_позиции_укр"].localeCompare(a["Название_позиции_укр"])
        )
    }

    function sortProductsPriceAsc() {
        return productsData.sort((a, b) => {
            const priceA = parseFloat(a["Цена"]);
            const priceB = parseFloat(b["Цена"]);
            return priceA - priceB;
        })
    }

    function sortProductsPriceDesc() {
        return productsData.sort((a, b) => {
            const priceA = parseFloat(a["Цена"]);
            const priceB = parseFloat(b["Цена"]);
            return priceB - priceA;
        })
    }

    function displayProducts(products) {
        const productsContainer = document.querySelector('.catalog__grid');
        productsContainer.innerHTML = generateHTML(products);
    }

    function hideLoadingPattern() {
        loadingEmptyItem.forEach(item => item.classList.add('hide'));
    }

    fetch('catalog-file.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            hideLoadingPattern();

            if (sessionStorage.getItem('selectedSortOption') === 'default') {
                productsData = data["Export Products Sheet"];
                displayProducts(productsData);
            } else if (sessionStorage.getItem('selectedSortOption') === 'name-asc') {
                productsData = data["Export Products Sheet"];
                displayProducts(productsData);

                const sortedProductsAsc = sortProductsAlphabetAsc(data["Export Products Sheet"]);
                displayProducts(sortedProductsAsc);
            } else if (sessionStorage.getItem('selectedSortOption') === 'name-desc') {
                productsData = data["Export Products Sheet"];
                displayProducts(productsData);

                const sortedProductsDesc = sortProductsAlphabetDesc(data["Export Products Sheet"]);
                displayProducts(sortedProductsDesc);
            } else if (sessionStorage.getItem('selectedSortOption') === 'price-asc') {
                productsData = data["Export Products Sheet"];
                displayProducts(productsData);

                const sortedProductsPriceAsc = sortProductsPriceAsc(data["Export Products Sheet"]);
                displayProducts(sortedProductsPriceAsc);
            } else if (sessionStorage.getItem('selectedSortOption') === 'price-desc') {
                productsData = data["Export Products Sheet"];
                displayProducts(productsData);

                const sortedProductsPriceDesc = sortProductsPriceDesc(data["Export Products Sheet"]);
                displayProducts(sortedProductsPriceDesc);
            }

            const sortSelect = document.getElementById('sortSelect');
            sortSelect.addEventListener('change', () => {
                sessionStorage.setItem('selectedSortOption', sortSelect.value);

                if (sessionStorage.getItem('selectedSortOption') === 'default') {
                    const sortedProductsDefault = sortProductsDefault(data["Export Products Sheet"]);
                    displayProducts(sortedProductsDefault);
                } else if (sessionStorage.getItem('selectedSortOption') === 'name-asc') {
                    const sortedProductsAsc = sortProductsAlphabetAsc(data["Export Products Sheet"]);
                    displayProducts(sortedProductsAsc);
                } else if (sessionStorage.getItem('selectedSortOption') === 'name-desc') {
                    const sortedProductsDesc = sortProductsAlphabetDesc(data["Export Products Sheet"]);
                    displayProducts(sortedProductsDesc);
                } else if (sessionStorage.getItem('selectedSortOption') === 'price-asc') {
                    const sortedProductsPriceAsc = sortProductsPriceAsc(data["Export Products Sheet"]);
                    displayProducts(sortedProductsPriceAsc);
                } else if (sessionStorage.getItem('selectedSortOption') === 'price-desc') {
                    const sortedProductsPriceDesc = sortProductsPriceDesc(data["Export Products Sheet"]);
                    displayProducts(sortedProductsPriceDesc);
                }
            })

            const savedOption = sessionStorage.getItem('selectedSortOption');
            if (savedOption) sortSelect.value = savedOption;
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoadingPattern();
        });
})