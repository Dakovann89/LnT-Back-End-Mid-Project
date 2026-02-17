let persons = [];
let editIndex = -1;

function openAdd() {
    document.querySelector(".modal-content h3").innerText = "Add Person";
    editIndex = -1;
    clearForm();
    document.getElementById("personModal").style.display = "block";
}

function closeModal() {
    document.getElementById("personModal").style.display = "none";
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phone").value = "";
    clearErrors();
}

function clearErrors() {
    document.getElementById("nameError").innerText = "";
    document.getElementById("ageError").innerText = "";
    document.getElementById("addressError").innerText = "";
    document.getElementById("phoneError").innerText = "";
}

function savePerson() {
    clearErrors();

    let name = document.getElementById("name").value.trim();
    let age = parseInt(document.getElementById("age").value);
    let address = document.getElementById("address").value.trim();
    let phoneInput = document.getElementById("phone").value.trim();
    let phone = "08" + phoneInput;

    let valid = true;

    if (name.length < 5 || name.length > 20) {
        document.getElementById("nameError").innerText = "❌";
        valid = false;
    }

    if (!age || age < 20) {
        document.getElementById("ageError").innerText = "❌";
        valid = false;
    }

    if (address.length < 10 || address.length > 14) {
        document.getElementById("addressError").innerText = "❌";
        valid = false;
    }

    if (!/^[0-9]+$/.test(phoneInput) || phoneInput.length < 9 || phoneInput.length > 12) {
        document.getElementById("phoneError").innerText = "❌";
        valid = false;
    }

    if (!valid) return;

    let person = { name, age, address, phone };

    if (editIndex === -1) {
        persons.push(person);
    } else {
        persons[editIndex] = person;
    }

    closeModal();
    renderTable();
}

function renderTable() {
    let table = document.getElementById("personTable");
    table.innerHTML = "";

    persons.forEach((p, index) => {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.address}</td>
                <td>${p.phone}</td>
                <td>
                    <button onclick="editPerson(${index})">Edit</button>
                    <button onclick="deletePerson(${index})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalPerson").innerText = persons.length;
}

function editPerson(index) {
    let p = persons[index];

    document.querySelector(".modal-content h3").innerText = "Edit Person";
    document.getElementById("name").value = p.name;
    document.getElementById("age").value = p.age;
    document.getElementById("address").value = p.address;
    document.getElementById("phone").value = p.phone.substring(2);

    editIndex = index;
    document.getElementById("personModal").style.display = "block";
}

function deletePerson(index) {
    persons.splice(index, 1);
    renderTable();
}
