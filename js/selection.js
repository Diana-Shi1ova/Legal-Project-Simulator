window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const levelIndex = Number(urlParams.get("level")) || 0;

  const response = await fetch("questions/questions.json");
  const levels = await response.json();

  const level = levels[levelIndex];

  document.getElementById("level-name").textContent = level.name;
  document.getElementById("level-question").textContent = level.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  level.options.forEach(optionObj => {
    const btn = document.createElement("button");
    btn.textContent = optionObj.option;

    btn.onclick = () => handleActions(optionObj.actions, level);

    optionsDiv.appendChild(btn);
  });
});

function handleActions(actions, level) {
  const modalActionIndex = actions.findIndex(a => a.action === "modal");
  if (modalActionIndex >= 0) {
    const modalAction = actions[modalActionIndex];
    const remainingActions = actions.slice(modalActionIndex + 1);
    openModal(modalAction, remainingActions, level);
  } else {
    actions.forEach(action => executeAction(action, level));
  }
}

function executeAction(action, level) {
  switch (action.action) {
    case "level":
      window.location.href = `game.html?level=${action.level}`;
      break;
    case "coins":
    case "quality":
    case "time":
    case "risk":
      const key = action.action;
      const val = Number(action.value);
      if (action.type === "+") Stats.add(key, val);
      else if (action.type === "-") Stats.add(key, -val);
      break;
    case "list":
      // Используем type и name из level для записи в sessionStorage
      sessionStorage.setItem(level.type, "legal");
      // Переход к списку уровней
      //window.location.href = "../levels.html";

      // Получаем текущий URL
      const params = new URLSearchParams(window.location.search);
      // Получаем конкретный параметр
      const l = params.get('level');  // "John"
      window.location.href = "selection.html?level="+(Number(l)+1);

      break;
    default:
      console.warn("Неизвестное действие:", action);
  }
}

function openModal(modalData, remainingActions = [], level) {
  const dialog = document.getElementById("dialog");
  dialog.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = modalData.text;
  dialog.appendChild(p);

  modalData.buttons.forEach(btnData => {
    const btn = document.createElement("button");
    btn.textContent = btnData.button;

    btn.onclick = () => {
      if (btnData.action === "close") {
        dialog.close();
      } else if (btnData.action === "actions") {
        dialog.close();
        remainingActions.forEach(action => executeAction(action, level));
      }
    };

    dialog.appendChild(btn);
  });

  dialog.showModal();
}
