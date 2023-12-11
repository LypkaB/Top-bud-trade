window.addEventListener('DOMContentLoaded', () => {
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
    function hideLoadingPattern() {
        const loadingEmptyItem = document.querySelectorAll('.empty-item');
        loadingEmptyItem.forEach(item => item.classList.add('hide'));
    }

    function addStorageKey() {
        const menuCatalog = document.querySelector('.header__menu--catalog');
        const menuCatalogCategoryValue = menuCatalog.getAttribute('data-category');
        const menuCatalogNameValue = menuCatalog.textContent.replace(/\s+/g, ' ').trim();

        sessionStorage.setItem(menuCatalogCategoryValue, menuCatalogNameValue);
    }

    function getFilterCategories(products) {
        return products.reduce((map, item) => {
            const key = item['Назва_характеристики_1'];
            const value = item['Значення_характеристики_1'];

            if (key) {
                const values = map.get(key) || new Set();
                values.add(value);
                map.set(key, values);
            }

            return map;
        }, new Map());
    }

    function showFilters(products) {
        const container = document.querySelector('.catalog__sidebar--filter');
        container.innerHTML = '';

        getFilterCategories(products).forEach((values, key) => {
            const sortedValues = Array.from(values).sort((a, b) => a - b);
            const listItemsHtml = sortedValues.map((value, index) => {
                const hiddenClass = index < 5 ? 'expanded' : '';
                return `<li class="${hiddenClass}">
                        <label>
                            <input type="checkbox">
                            ${value}
                        </label>
                    </li>`;
            }).join('');

            const showMoreHtml = sortedValues.length > 5 ? `<li class="show-more expanded">Показати більше</li>` : '';
            const htmlContent =
                `<div>
                    <span class="filter__characteristics-title">${key}:</span>
                    <ul class="filter__characteristics-list">${listItemsHtml}${showMoreHtml}</ul>
                </div>`;

            container.insertAdjacentHTML('beforeend', htmlContent);
        });

        container.addEventListener('click', function(event) {
            if (!event.target.classList.contains('show-more')) return;

            const button = event.target;
            const listItems = button.parentNode.querySelectorAll('li');
            const isExpanded = button.getAttribute('data-expanded') === 'true';

            listItems.forEach((item, index) => {
                if (index >= 5) item.classList.toggle('expanded');
            });

            button.textContent = isExpanded ? 'Показати більше' : 'Приховати';
            button.setAttribute('data-expanded', !isExpanded);
            button.classList.toggle('expanded');
        });
    }

    function createProductItems(products) {
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

    function showProducts(products) {
        if (createProductItems(products) !== '') {
            document.querySelector('.catalog__grid').innerHTML = createProductItems(products);
        } else {
            document.querySelector('.catalog__grid').innerHTML =
                `<div class="catalog__item-no-data">Даних немає. Вибачте за незручності.</div>`;
        }
    }

    function sortProducts(products, sortType) {
        const sortedProducts = [...products];

        switch (sortType) {
            case 'name-asc':
                return sortedProducts.sort((a, b) => a["Назва_позиції"].localeCompare(b["Назва_позиції"]));
            case 'name-desc':
                return sortedProducts.sort((a, b) => b["Назва_позиції"].localeCompare(a["Назва_позиції"]));
            case 'price-asc':
                return sortedProducts.sort((a, b) => parseFloat(a["Ціна"]) - parseFloat(b["Ціна"]));
            case 'price-desc':
                return sortedProducts.sort((a, b) => parseFloat(b["Ціна"]) - parseFloat(a["Ціна"]));
            default:
                return sortedProducts.sort((a, b) => parseFloat(a["Номер_позиції"]) - parseFloat(b["Номер_позиції"]));
        }
    }

    function removeUnnecessaryKeys(exceptKey) {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key !== exceptKey && key !== 'sort-option') sessionStorage.removeItem(key);
        }
    }

    function addActiveClass() {
        const elementsWithDataCategory = document.querySelectorAll('[data-category]');

        const categoriesContainer = document.querySelector('.catalog__sidebar--categories');
        const activeCategory = categoriesContainer.querySelector('.category_active');
        const showList = categoriesContainer.querySelectorAll('.list_show');

        if (activeCategory) activeCategory.classList.remove('category_active');
        if (showList) showList.forEach(list => list.classList.remove('list_show'));

        elementsWithDataCategory.forEach(elem => {
            const categoryName = elem.textContent.replace(/\s+/g, ' ').trim();
            const firstStorageKey = sessionStorage.getItem(sessionStorage.key(0));
            const secondStorageKey = sessionStorage.getItem(sessionStorage.key(1));

            if (!sessionStorage.getItem('Каталог')) {
                if (categoryName === firstStorageKey || categoryName === secondStorageKey) {
                    elem.classList.add('category_active');

                    if (elem.nextElementSibling !== null && elem.nextElementSibling.classList.contains('categories__list-first')) {
                        elem.nextElementSibling.classList.add('list_show');
                    } else if (elem.closest('.categories__list-first') !== null) {
                        elem.closest('.categories__list-first').classList.add('list_show');

                        if (elem.nextElementSibling !== null && elem.nextElementSibling.querySelector('.categories__list-second')) {
                            elem.nextElementSibling.querySelector('.categories__list-second').classList.add('list_show');
                        } else if (elem.closest('.categories__list-second') !== null) {
                            elem.closest('.categories__list-second').classList.add('list_show');
                        }
                    }
                }
            }
        });
    }

    fetch('catalog.json')
        .then(response => {
            return response.json();
        })
        .then(productsData => {
            hideLoadingPattern();

            showFilters(productsData);

            function showFilteredProducts(productsArr) {
                const sortOption = sessionStorage.getItem('sort-option');
                switch (sortOption) {
                    case 'name-asc':
                        showProducts(sortProducts(productsArr, 'name-asc'));
                        break;
                    case 'name-desc':
                        showProducts(sortProducts(productsArr, 'name-desc'));
                        break;
                    case 'price-asc':
                        showProducts(sortProducts(productsArr, 'price-asc'));
                        break;
                    case 'price-desc':
                        showProducts(sortProducts(productsArr, 'price-desc'));
                        break;
                    default:
                        showProducts(sortProducts(productsArr, 'default'));
                        break;
                }
            }

            function addListenerOfSortSelect(data) {
                const sortSelect = document.getElementById('sortSelect');
                sortSelect.addEventListener('change', () => {
                    sessionStorage.setItem('sort-option', sortSelect.value);
                    showFilteredProducts(data);
                });

                const savedOption = sessionStorage.getItem('sort-option');
                sortSelect.value = savedOption ? savedOption : sortSelect.value;
            }

            function showProductFromStorage() {
                let foundItem = null;
                for (let i = 0; i < sessionStorage.length; i++) {
                    let key = sessionStorage.key(i);
                    if (key !== 'sort-option') {
                        foundItem = { key: key, value: sessionStorage.getItem(key) };
                        break;
                    }
                }

                if (foundItem !== null) {
                    addActiveClass();

                    const filteredProducts = productsData.filter(item => item[foundItem.key] === foundItem.value);
                    showFilteredProducts(filteredProducts);
                    addListenerOfSortSelect(filteredProducts);
                }
            }

            if (sessionStorage.length === 0 || sessionStorage.getItem('Каталог')) {
                addStorageKey();
                showFilteredProducts(productsData);
                addListenerOfSortSelect(productsData);
            } else {
                showProductFromStorage();
            }

            const dataCategory = document.querySelectorAll('[data-category]');
            dataCategory.forEach(elem => {
                elem.addEventListener('click', () => {
                    const categoryValue = elem.getAttribute('data-category');
                    const nameValue = elem.textContent.replace(/\s+/g, ' ').trim();

                    if (categoryValue === 'Каталог') {
                        removeUnnecessaryKeys(categoryValue);
                        addStorageKey();
                        addActiveClass();
                        showFilteredProducts(productsData);
                        addListenerOfSortSelect(productsData);
                    } else {
                        removeUnnecessaryKeys(categoryValue);
                        sessionStorage.setItem(categoryValue, nameValue);
                        showProductFromStorage();
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoadingPattern();
        });
})