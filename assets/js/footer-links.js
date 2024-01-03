window.addEventListener('DOMContentLoaded', () => {
    const footerLinks = document.querySelectorAll('.footer__menu li');

    if (footerLinks) {
        footerLinks.forEach(link => {
            link.addEventListener('click', () =>
                sessionStorage.setItem('user_selection', `{"group":"nazva_grupi_1","category":"${link.textContent}"}`))
        })
    }
})