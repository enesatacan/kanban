const app = document.querySelector(".app");
const modes = document.querySelector(".container .main #modes");
const mode = document.querySelector(".container .main #modes button");
const links = document.querySelector(".main #links");
const link = document.querySelector(".main #links").querySelectorAll("a");
const contents = document.querySelector(".main #contents");
const nextBtn = document.querySelector("#contents #rightBtn");
const prevBtn = document.querySelector("#contents #leftBtn");
const cardHeader = document.querySelector(".main #contents .card-header");
const headerSpan = document.querySelector(".main #contents span");
const cardBody = document.querySelector(".main #contents .card-body");
const cardFooter = document.querySelector(".main #contents .card-footer");
const addTaskBtn = document.querySelector(
  ".main #contents .card-footer #addTask"
);
const input = document.querySelector(".form-control");

let tasks = {
  yapilacaklar: [
    "Yapmayı planlamış olduğun görevi 'Kart Ekle' butonu üzerinden ekleyebilirsin...",
  ],
  yapiliyor: [
    "Zaten yapmakta olduğun görevi 'Kart Ekle' butonu üzerinden ekleyebilirsin...",
  ],
  tamamlandi: [
    "Önceden tamamlamış olduğun görevleri 'Kart Ekle' butonu üzerinden ekleyebilirsin...",
  ],
};

let categories = Object.keys(tasks);
console.log(categories);

let currentIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  link.forEach((l) => l.classList.remove("active"));
  link[0].classList.add("active");
  displayTasks("yapilacaklar");
});

const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const displayTasks = (category) => {
  cardBody.innerHTML = "";
  console.log(category);
  let tasksHTML = tasks[category]
    .map(
      (task) => `
      <div class="card-title ${
        category === "tamamlandi"
          ? "bg-success text-white"
          : "bg-light text-black"
      }  rounded d-flex align-items-center justify-content-between">
        <span class="px-3 py-2">${task}</span>
          <div class="btn-group dropdown">
            <button type="button" class="${
              category === "tamamlandi"
                ? "text-white successMoreBtn"
                : "text-black moreBtn"
            } dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu">
            <li><a onclick=move(event) class="dropdown-item d-flex justify-content-between text-success py-2 align-items-center" href="#">Move to Next
              <i class="fa-solid fa-arrow-right"></i>
            </a></li>
             <li><a onclick=edit(event) class="dropdown-item d-flex justify-content-between text-primary py-2 align-items-center" href="#">Edit
              <i class="fa-solid fa-pen"></i>
            </a></li>
             <li><a onclick=trash(event) class="dropdown-item d-flex justify-content-between text-danger py-2 align-items-center" href="#">Delete
              <i class="fa-solid fa-trash"></i></a>
            </li>
            </ul>
          </div>
       </div>
      `
    )
    .join("");

  cardBody.insertAdjacentHTML("beforeend", tasksHTML);
};
const prev = () => {
  currentIndex = (currentIndex - 1 + categories.length) % categories.length;
  updateCategory();
};
const next = () => {
  currentIndex = (currentIndex + 1) % categories.length;
  updateCategory();
};
const updateCategory = () => {
  headerSpan.innerText =
    categories[currentIndex].charAt(0).toUpperCase() +
    categories[currentIndex].slice(1); // Baş harfi büyük harf yap
  link.forEach((l) => l.classList.remove("active"));
  link[currentIndex].classList.add("active");
  displayTasks(categories[currentIndex]);
};
const addTask = () => {
  const currentCategory = categories[currentIndex];
  if (input.style.opacity == 0) {
    input.style.opacity = 1;
    input.style.pointerEvents = "auto";
    addTaskBtn.innerHTML = "";
    addTaskBtn.innerHTML = `
    <i class="fa-solid fa-minus me-2"></i>
    <span> Kart Eklemekten Vazgeç </span>
    `;
    input.addEventListener("keydown", function handleEnter(event) {
      if (event.key === "Enter" && event.target.value.trim() !== "") {
        tasks[currentCategory].push(event.target.value.trim());
        console.log(currentCategory);
        updateLocalStorage();
        displayTasks(currentCategory);
        event.target.value = "";
        input.removeEventListener("keydown", handleEnter);
        addTask();
      }
    });
  } else {
    input.style.opacity = 0;
    input.style.pointerEvents = "none";
    addTaskBtn.innerHTML = "";
    addTaskBtn.innerHTML = `
    <i class="fa-solid fa-plus me-2"></i>
    <span> Kart Ekle </span>
    `;
  }
};
const move = (event) => {
  const taskElement = event.target.closest(".card-title");
  const taskText = taskElement.querySelector("span").innerText;
  const currentCategory = categories[currentIndex];
  const categoryOrder = ["yapilacaklar", "yapiliyor", "tamamlandi"];

  let currentCategoryIndex = categoryOrder.indexOf(currentCategory);
  if (currentCategoryIndex < categoryOrder.length - 1) {
    const nextCategory = categoryOrder[currentCategoryIndex + 1];
    if (tasks[currentCategory].includes(taskText)) {
      tasks[currentCategory] = tasks[currentCategory].filter(
        (task) => task !== taskText
      );
      tasks[nextCategory].push(taskText);
      updateLocalStorage();
      displayTasks(currentCategory);
    } else {
      console.error("Görev bulunamadı.");
    }
  } else {
    alert("Görev zaten tamamlandı, başka bir aşamaya geçemez.");
  }
};
const edit = (event) => {
  const taskElement = event.target.closest(".card-title");
  const taskText = taskElement.querySelector("span").innerText;
  const currentCategory = categories[currentIndex];

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = taskText;
  inputField.classList.add("editInput");

  taskElement.innerHTML = "";
  taskElement.append(inputField);

  inputField.addEventListener("keydown", function handleEnter(event) {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      const updatedTask = event.target.value.trim();

      const taskIndex = tasks[currentCategory].indexOf(taskText);
      if (taskIndex > -1) {
        tasks[currentCategory][taskIndex] = updatedTask;
        updateLocalStorage();
        displayTasks(currentCategory);
      }

      event.target.removeEventListener("keydown", handleEnter);
    }
  });
};
const trash = (event) => {
  const taskElement = event.target.closest(".card-title");
  const taskText = taskElement.querySelector("span").innerText;
  const currentCategory = categories[currentIndex];
  const taskIndex = tasks[currentCategory].indexOf(taskText);
  if (taskIndex > -1) {
    tasks[currentCategory].splice(taskIndex, 1);
    displayTasks(currentCategory);
    updateLocalStorage();
    console.log(`Görev "${taskText}" başarıyla silindi.`);
  } else {
    console.error("Görev bulunamadı!");
  }
};
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
addTaskBtn.addEventListener("click", addTask);

link.forEach((a, index) => {
  a.addEventListener("click", () => {
    link.forEach((l) => l.classList.remove("active"));
    a.classList.add("active");
    headerSpan.innerText = a.innerText;
    currentIndex = index; // Tıklanan sekmeye göre index güncelle
    displayTasks(categories[currentIndex]);
  });
});

//MODE
document.addEventListener("DOMContentLoaded", () => {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark");
    mode.innerHTML = '<i class="fa-solid fa-sun"></i>';
    mode.id = "whiteMode";
  }
});

mode.addEventListener("click", () => {
  const isDarkMode = mode.id === "darkMode";
  localStorage.setItem("darkMode", isDarkMode ? "true" : "false");

  mode.innerHTML = isDarkMode
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  mode.id = isDarkMode ? "whiteMode" : "darkMode";
  document.body.classList.toggle("dark");
});
