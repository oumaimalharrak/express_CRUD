//Read data on load table
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/getAll")
    .then((response) => response.json())
    .then((data) => loadHtmlTable(data["data"]));
});
// DOM
const addNameBtn = document.querySelector("#add-name-btn");
const table = document.querySelector("table tbody");
const updateBtn = document.getElementById("update-row-btn");

// delete btn doesnt exist in the DOM, w'll listen it dynamically using 'document eventless'
document.querySelector("table tbody").addEventListener("click", (e) => {
  if (e.target.className === "delete-row-btn") {
    deleteRowById(e.target.dataset.id);
  }

  if (e.target.className === "edit-row-btn") {
    handleEditRow(e.target.dataset.id);
  }
});
//edit row function
function handleEditRow(id) {
  const updateSection = document.querySelector("#update-section");
  updateSection.hidden = false;
  document.getElementById("update-row-btn").dataset.id = id;
}

updateBtn.onclick = () => {
  const updateName = document.querySelector("#update-name-input");

  fetch("http://localhost:5000/update", {
    method: 'PATCH',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: updateName.dataset.id,
      name: updateName.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};

// delete row function
function deleteRowById(id) {
  fetch("http://localhost:5000/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

// add name function
addNameBtn.onclick = function () {
  const nameInput = document.querySelector("#name-input");
  const name = nameInput.value;
  nameInput.value = "";

  fetch("http://localhost:5000/insert", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((data) => insertRowTable(data["data"]));
};

//Insert data
function insertRowTable(data) {
  console.log(data);
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");

  let tableHtml = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "dateAdded") {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHtml += `<td>${data[key]}</td>`;
    }
  }

  tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
  tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

  tableHtml += "</tr>";

  if (isTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
}

// data table
function loadHtmlTable(data) {
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data'colspan='5'>No data</td></tr>";
  }
  let tableHtml = "";

  data.forEach(({ id, name, date_added }) => {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${name}</td>`;
    tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${id} >Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${id} >Edit</button></td>`;
    tableHtml += "</tr>";
  });
  table.innerHTML = tableHtml;
}
