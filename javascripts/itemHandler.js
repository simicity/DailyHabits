window.onload = loadItems;

function loadItems() {
  if (localStorage.getItem("items") == null) return;
  const items = Array.from(JSON.parse(localStorage.getItem("items")));
  items.forEach(item => {
    document.getElementById("item-list").innerHTML += `
      <div class="d-flex justify-content-between" id="item-${item.id}">
        <div class="list-group list-group-flush col-10">
          <a href="${item.url}" class="list-group-item list-group-item-action">
            <h5 class="mb-1">${item.title}</h5>
            <p class="text-muted mb-1">${item.note}</p>
          </a>
        </div>
        <div>
          <span data-bs-toggle="collapse" data-bs-target="#edit-item-${item.id}" aria-expanded="true" aria-controls="edit-item-${item.id}">
            <i class="bi-pencil"></i>
          </span>
        </div>
        <div>
          <span class="m-1" onclick="removeItem(this)"><i class="bi-trash2"></i></span>
        </div>
        <div>
          <span class="m-1" onclick="toggleCheck(this)"><i class=${item.check}></i></span>
        </div>
      </div>
      <div class="row collapse mt-3" id="edit-item-${item.id}">
        <form id="edit-form-${item.id}" action="">
          <div class="row justify-content-center">
              <div class="col-8 mb-2">
                  <label for="item-title" class="form-label"><small>Task *</small></label>
                  <input type="text" class="form-control" id="item-title" name="title" value=${item.title} required>
              </div>
          </div>
          <div class="row justify-content-center">
              <div class="col-8 mb-2">
                  <label for="item-url" class="form-label"><small>URL</small></label>
                  <input type="text" class="form-control" id="item-url" name="url" value=${item.url}>
              </div>
          </div>
          <div class="row justify-content-center">
              <div class="col-8 mb-2">
                  <label for="item-note" class="form-label"><small>Note</small></label>
                  <textarea class="form-control" id="item-note" name="note" rows="3">${item.note}</textarea>
              </div>
          </div>
          <div class="row justify-content-center mt-2">
              <div class="col-auto">
                  <button type="submit" class="btn btn-primary mb-3">Update</button>
              </div>
          </div>
        </form>
      </div>
    `;
  });

  items.forEach(item => {
    document.getElementById("edit-form-" + item.id).addEventListener("submit", e => {
      e.preventDefault();
      editItem(item.id);
    });
  });
}

async function addItem() {
  let container = document.getElementById("add-item");
  const form = document.getElementById("add-form");
  const formData = new FormData(form);
  let item = {}
  for (const [key, value] of formData) {
    item[key] = value;
  }
  item["check"] = "bi-check-square";
  if (localStorage.getItem("items") == null) {
    item["id"] = 0;
  } else {
    item["id"] = Array.from(JSON.parse(localStorage.getItem("items"))).length;
  }

  // Add item to local storage
  localStorage.setItem("items", JSON.stringify([...JSON.parse(localStorage.getItem("items") || "[]"), item]));
  
  document.getElementById("item-list").innerHTML += `
    <div class="d-flex justify-content-between" id="item-${item.id}">
      <div class="list-group list-group-flush col-10">
        <a href="${item.url}" class="list-group-item list-group-item-action">
          <h5 class="mb-1">${item.title}</h5>
          <p class="text-muted mb-1">${item.note}</p>
        </a>
      </div>
      <div>
        <span data-bs-toggle="collapse" data-bs-target="#edit-item-${item.id}" aria-expanded="true" aria-controls="edit-item-${item.id}">
          <i class="bi-pencil"></i>
        </span>
      </div>
      <div>
        <span class="m-1" onclick="removeItem(this)"><i class="bi-trash2"></i></span>
      </div>
      <div>
        <span class="m-1" onclick="toggleCheck(this)"><i class=${item.check}></i></span>
      </div>
    </div>
    <div class="row collapse mt-3" id="edit-item-${item.id}">
      <form id="edit-form-${item.id}" action="">
        <div class="row justify-content-center">
            <div class="col-8 mb-2">
                <label for="item-title" class="form-label"><small>Task *</small></label>
                <input type="text" class="form-control" id="item-title" name="title" value=${item.title} required>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-8 mb-2">
                <label for="item-url" class="form-label"><small>URL</small></label>
                <input type="text" class="form-control" id="item-url" name="url" value=${item.url}>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-8 mb-2">
                <label for="item-note" class="form-label"><small>Note</small></label>
                <textarea class="form-control" id="item-note" name="note" rows="3">${item.note}</textarea>
            </div>
        </div>
        <div class="row justify-content-center mt-2">
            <div class="col-auto">
                <button type="submit" class="btn btn-primary mb-3">Update</button>
            </div>
        </div>
      </form>
    </div>
  `;

  document.getElementById("edit-form-" + item.id).addEventListener("submit", e => {
    e.preventDefault();
    editItem(item.id);
  });

  form.reset();
  container.classList.remove("show");
}

document.getElementById("add-form").addEventListener("submit", e => {
    e.preventDefault();
    addItem();
});

function removeItem(event) {
  const container = event.parentElement.parentElement;
  const id = container.id.replace("item-", "");
  let items = Array.from(JSON.parse(localStorage.getItem("items")));
  items.forEach(item => {
    if (item["id"] == id) {
      items.splice(items.indexOf(item), 1);
    }
  });

  // Update local storage
  localStorage.setItem("items", JSON.stringify(items));

  // Update view
  container.remove();
  document.getElementById("edit-item-" + id).remove();
}

function editItem(id) {
  let container = document.getElementById("edit-item-" + id);
  const form = document.getElementById("edit-form-" + id);
  const formData = new FormData(form);
  const items = Array.from(JSON.parse(localStorage.getItem("items")));
  let currentItem = null;
  items.forEach(item => {
    if (item["id"] == id) {
      for (const [key, value] of formData) {
        item[key] = value;
      }
      currentItem = item;
    }
  });

  // Update local storage
  localStorage.setItem("items", JSON.stringify(items));
  
  document.getElementById("item-" + id).innerHTML = `
    <div class="list-group list-group-flush col-10">
      <a href="${currentItem.url}" class="list-group-item list-group-item-action">
        <h5 class="mb-1">${currentItem.title}</h5>
        <p class="text-muted mb-1">${currentItem.note}</p>
      </a>
    </div>
    <div>
      <span data-bs-toggle="collapse" data-bs-target="#edit-item-${id}" aria-expanded="true" aria-controls="edit-item-${id}">
        <i class="bi-pencil"></i>
      </span>
    </div>
    <div>
      <span class="m-1" onclick="removeItem(this)"><i class="bi-trash2"></i></span>
    </div>
    <div>
      <span class="m-1" onclick="toggleCheck(this)"><i class=${currentItem.check}></i></span>
    </div>
  `;

  document.getElementById("edit-item-" + id).innerHTML = `
    <form id="edit-form-${id}" action="">
      <div class="row justify-content-center">
          <div class="col-8 mb-2">
              <label for="item-title" class="form-label"><small>Task *</small></label>
              <input type="text" class="form-control" id="item-title" name="title" value=${currentItem.title} required>
          </div>
      </div>
      <div class="row justify-content-center">
          <div class="col-8 mb-2">
              <label for="item-url" class="form-label"><small>URL</small></label>
              <input type="text" class="form-control" id="item-url" name="url" value=${currentItem.url}>
          </div>
      </div>
      <div class="row justify-content-center">
          <div class="col-8 mb-2">
              <label for="item-note" class="form-label"><small>Note</small></label>
              <textarea class="form-control" id="item-note" name="note" rows="3">${currentItem.note}</textarea>
          </div>
      </div>
      <div class="row justify-content-center mt-2">
          <div class="col-auto">
              <button type="submit" class="btn btn-primary mb-3">Update</button>
          </div>
      </div>
    </form>
  `;

  items.forEach(item => {
    document.getElementById("edit-form-" + item.id).addEventListener("submit", e => {
      e.preventDefault();
      editItem(item.id);
    });
  });

  container.classList.remove("show");
}

function toggleCheck(event) {
  let container = event.parentElement.parentElement;
  let items = Array.from(JSON.parse(localStorage.getItem("items")));
  items.forEach(item => {
    if (item["id"] == container.id.replace("item-", "")) {
      if (item["check"] == "bi-check-square") {
        item["check"] = "bi-check-square-fill";
        console.log("1");
      } else {
        item["check"] = "bi-check-square";

        console.log("2");
      }
      event.innerHTML = `<i class=${item.check}></i>`;
    }
  });

  // Update local storage
  localStorage.setItem("items", JSON.stringify(items));
}
