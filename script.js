function toast(txt, type) {
  Toastify({
    text: txt,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: type === 'error' ? 'linear-gradient(to right, #e80e0e, #e8910e)' : 'linear-gradient(to right, #00b09b, #96c93d)',
      fontFamily: "system-ui, Roboto"
    }
  }).showToast();
}

class Contact {
  constructor(name, tel, email) {
    this.name = name;
    this.tel = tel;
    this.email = email;
  }

  add() {
    PHONEBOOK.push(this);
  }
}

const STORAGE_KEY = 'PHONEBOOK';
let PHONEBOOK = [];

const nameInput = document.querySelector('#name');
const telInput = document.querySelector('#tel');
const emailInput = document.querySelector('#mail');
const addBtn = document.querySelector('#add-btn');
const phonebookDOM = document.querySelector('#agenda');

const checkIfContactAlreadyExists = (contact) => {
  if (PHONEBOOK.some(ctct => ctct.email === contact.email)) {
    toast('Ese contacto ya existe', 'error');
  } else {
    contact.add();
    savePhonebook();
    updateDOM();
    toast(`He añadido a ${contact.name} a tus contactos`, 'success');
  }
};

const createContact = (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const tel = telInput.value.replace(/\s|-/g, '');
  const email = emailInput.value;

  if (!name || !tel || !email) {
    toast('Los datos no son válidos', 'error');
  } else {
    const newContact = new Contact(name, tel, email);
    checkIfContactAlreadyExists(newContact);
  }

  document.querySelector('form').reset();
};

const editContact = (selectedContact) => {
  const newName = prompt('Ingrese el nuevo nombre:', selectedContact.name);
  const newMail = prompt('Ingrese el nuevo correo:', selectedContact.email);
  const newTel = prompt('Ingrese el nuevo teléfono:', selectedContact.tel);

  if (newName !== null) {
    selectedContact.name = newName.trim() !== '' ? newName.trim() : selectedContact.name;
  }

  if (newMail !== null) {
    selectedContact.email = newMail.trim() !== '' ? newMail.trim() : selectedContact.email;
  }

  if (newTel !== null) {
    selectedContact.tel = newTel.trim() !== '' ? newTel.trim() : selectedContact.tel;
  }

  savePhonebook();
  updateDOM();

  toast(`Has editado a ${selectedContact.name}`, 'success');
};

const deleteContact = (selectedContact) => {
  const confirmDelete = confirm(`¿Estás seguro de eliminar a ${selectedContact.name}?`);
  if (confirmDelete) {
    const selectedIndex = PHONEBOOK.indexOf(selectedContact);
    PHONEBOOK.splice(selectedIndex, 1);
    savePhonebook();
    updateDOM();
    toast(`Has eliminado a ${selectedContact.name}`, 'success');
  }
};

const savePhonebook = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(PHONEBOOK));
};

const loadPhonebook = () => {
  const storedPhonebook = localStorage.getItem(STORAGE_KEY);
  if (storedPhonebook) {
    PHONEBOOK = JSON.parse(storedPhonebook);
  }
};

const updateDOM = () => {
  phonebookDOM.innerHTML = '';

  if (PHONEBOOK.length === 0) {
    phonebookDOM.innerHTML = '<p>No hay contactos en la agenda</p>';
    return;
  }

  PHONEBOOK.forEach(contact => {
    const { name, tel, email } = contact;

    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contacto');

    const nameHeading = document.createElement('h3');
    nameHeading.textContent = name;
    contactDiv.appendChild(nameHeading);

    const emailSpan = document.createElement('span');
    emailSpan.classList.add('email');
    emailSpan.textContent = email;
    contactDiv.appendChild(emailSpan);

    const telSpan = document.createElement('span');
    telSpan.textContent = tel;
    contactDiv.appendChild(telSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerHTML = '&#9998;';
    actionsDiv.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '&#10060;';
    actionsDiv.appendChild(deleteBtn);

    contactDiv.appendChild(actionsDiv);

    phonebookDOM.appendChild(contactDiv);
  });

  const editBtns = document.querySelectorAll('.edit-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');

  editBtns.forEach((btn, index) => {
    const selectedContact = PHONEBOOK[index];
    btn.addEventListener('click', (e) => {
      const confirmEdit = confirm(`¿Deseas editar a ${selectedContact.name}?`);
      if (confirmEdit) {
        editContact(selectedContact);
      }
    });
  });

  deleteBtns.forEach((btn, index) => {
    const selectedContact = PHONEBOOK[index];
    btn.addEventListener('click', (e) => {
      const confirmDelete = confirm(`¿Estás seguro de eliminar a ${selectedContact.name}?`);
      if (confirmDelete) {
        deleteContact(selectedContact);
      }
    });
  });
};

addBtn.addEventListener('click', createContact);

window.addEventListener('load', () => {
  loadPhonebook();
  updateDOM();
});
