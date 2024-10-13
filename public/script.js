let showRecords = false;

function toggleRecords() {
    const recordsContainer = document.getElementById('recordsContainer');
    const noRecordsMessage = document.getElementById('noRecordsMessage');
    const contactForm = document.getElementById('contactForm');
    const createContactBtn = document.getElementById('createContactBtn');
    const viewRecordsBtn = document.getElementById('viewRecordsBtn');
    const hereAreRecordsMessage = document.getElementById('hereAreRecordsMessage');

    if (showRecords) {
        recordsContainer.style.display = 'block';
        noRecordsMessage.style.display = 'none';
        contactForm.style.display = 'none';
        createContactBtn.style.display = 'block';
        viewRecordsBtn.style.display = 'none';
        hereAreRecordsMessage.style.display = 'block';
    } else {
        createContactBtn.style.display = 'none';
        viewRecordsBtn.style.display = 'block';
        recordsContainer.style.display = 'none';
        noRecordsMessage.style.display = 'none';
        contactForm.style.display = 'block';
        hereAreRecordsMessage.style.display = 'none';
        contactForm.reset();
        clearImagePreview();
    }
    showRecords = !showRecords;
}

document.getElementById('viewRecordsBtn').addEventListener('click', async function () {
    const response = await fetch("/getContactInfo");
    const recordsContainer = document.getElementById("recordsContainer");
    const noRecordsMessage = document.getElementById("noRecordsMessage");
    const contactForm = document.getElementById('contactForm');

    if (response.ok) {
        const data = await response.json();
        recordsContainer.innerHTML = '';
        noRecordsMessage.style.display = 'none';

        if (data.length === 0) {
            noRecordsMessage.style.display = 'block';
            recordsContainer.style.display = 'none';
        } else {
            data.forEach(record => {
                const recordDiv = document.createElement("div");
                recordDiv.className = "record";
                recordDiv.innerHTML = `
                    <div><strong>Name:</strong> ${record.name}</div>
                    <div><strong>Email:</strong> ${record.email}</div>
                    <div><strong>Date of Birth:</strong> ${new Date(record.dob).toLocaleDateString()}</div>
                    <div><strong>Phone Number:</strong> ${record.phone}</div>
                    <div><strong>Additional Info:</strong> ${record.additionalInfo}</div>
                    <div>
                        <strong>Image:</strong>
                        <img src="${record.image}" alt="Contact Image" class="small-image">
                    </div>
                    <hr>
                `;
                recordsContainer.appendChild(recordDiv);
            });
            recordsContainer.style.display = 'block';
            contactForm.style.display = 'none';
            noRecordsMessage.style.display = 'none';
        }
    } else {
        alert("Error retrieving records.");
    }
});

document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const phone = document.getElementById("phone").value;
    const additionalInfo = document.getElementById("additional-info").value;
    const imageFile = document.getElementById("image").files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("dob", dob);
    formData.append("phone", phone);
    formData.append("additionalInfo", additionalInfo);
    formData.append("image", imageFile);

    const responseMessage = document.getElementById("responseMessage");

    const response = await fetch("/postContactInfo", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        responseMessage.innerText = "Thank you! Your contact info has been submitted.";
        responseMessage.style.color = "green";
        responseMessage.style.display = "block";
        clearImagePreview();
        document.getElementById("contactForm").reset();

        setTimeout(() => {
            responseMessage.style.display = "none";
        }, 3000);
    } else {
        responseMessage.innerText = "Error submitting your contact info.";
        responseMessage.style.color = "red";
        responseMessage.style.display = "block";

        setTimeout(() => {
            responseMessage.style.display = "none";
        }, 3000);
    }
});

document.getElementById("image").addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const imgElement = document.getElementById("imagePreview");
            imgElement.setAttribute("src", event.target.result);
            imgElement.style.display = "block";
        };

        reader.readAsDataURL(file);
    }
});

function clearImagePreview() {
    const imgElement = document.getElementById("imagePreview");
    imgElement.setAttribute("src", "");
    imgElement.style.display = "none";
}

toggleRecords();
