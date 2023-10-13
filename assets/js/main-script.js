window.addEventListener('DOMContentLoaded', () => {
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
})