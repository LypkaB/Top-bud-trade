import {getButtonText} from '../helper/index.js';

export const createCard = (items = []) => {
    return items.map((item) => {
        let descriptionBlock = '';
        let bottomStyle = '';

        if (item.nazva_harakteristiki_1 && item.nazva_harakteristiki_2) {
            bottomStyle = 'bottom: -51.6px';
            descriptionBlock = `<div class="catalog__item--descr" style="${bottomStyle}">` +
                `<span>${item.nazva_harakteristiki_1}: ${item.znachennya_harakteristiki_1}</span>` +
                `<span>${item.nazva_harakteristiki_2}: ${item.znachennya_harakteristiki_2}</span></div>`;
        } else if (item.nazva_harakteristiki_1) {
            bottomStyle = 'bottom: -25.8px';
            descriptionBlock = `<div class="catalog__item--descr" style="${bottomStyle}">` +
                `<span>${item.nazva_harakteristiki_1}: ${item.znachennya_harakteristiki_1}</span></div>`;
        }

        return `<div class="catalog__item-wrap">
            <div class="catalog__item">
                <span class="catalog__item--title">${item.nazva}</span>
                
                <div class="catalog__item--img">
                    <img src="./assets/images/products/${item.zobrazhennya}" alt="${item.nazva}">
                </div>
                
                <div class="row">
                    <span>${item.cina} грн/${item.odinicya_vimiru}</span>
                    <button type="button" class="btn" data-id='${item.nomer}'>
                          ${getButtonText(item.nomer)}
                    </button>
                </div>
                
                ${descriptionBlock}
            </div>
        </div>`;
    }).join('');
};
