window.addEventListener('DOMContentLoaded', () => {
    /*<----- Recall window ----->*/
    const mainHtmlTag = document.documentElement;
    const recallModalFields = document.querySelectorAll('.recall__form input[type="text"], .recall__form textarea');
    const contactsFormFields = document.querySelectorAll('.contacts-content__form input[type="text"], .contacts-content__form textarea');
    const recallBtn = document.querySelector('.contacts-links--recall');
    const recallModal = document.querySelector('.recall__modal');
    const recallCloseModal = document.querySelector('.recall__modal-close');
    const recallForm = document.querySelector('.recall__form');
    const recallFormMessage = document.querySelector('.recall__form-message');

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

    function updateFormMessage(message) {
        if (recallFormMessage) recallFormMessage.innerHTML = message;
    }

    function closeRecallModal() {
        if (recallModal) recallModal.classList.add('hide');
        if (recallForm) recallForm.reset();
        if (recallFormMessage) recallFormMessage.innerHTML = '';
    }

    labelFieldUp(recallModalFields, 'recall');

    recallBtn.addEventListener('click', openModal);
    recallCloseModal.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeydown);

    if (recallForm) {
        recallForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(event.target);

            fetch('./php/send_mail.php', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(() => {
                    updateFormMessage('Thank you for your message. We will contact you shortly.');
                    setTimeout(closeRecallModal, 2000);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    updateFormMessage('Oops! Something went wrong. Please try again.');
                });
        });
    }
})