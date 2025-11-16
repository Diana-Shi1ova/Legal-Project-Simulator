function hideButtons(){
    document.querySelectorAll("#buttons button").forEach(im => {
        im.style.display = "none";
    });
}

// Открытие диалога
function openDialog(message, onConfirm = null) {
    const dialog = document.getElementById("dialog");
    dialog.innerHTML = "";

    const text = document.createElement("p");
    text.textContent = message;

    const btn = document.createElement("button");
    btn.textContent = "Continuar";
    btn.onclick = () => {
        dialog.close();
        if (onConfirm) onConfirm();
    };

    dialog.appendChild(text);
    dialog.appendChild(btn);
    dialog.showModal();
}

// Обработка действий JSON
function performAction(action) {
    // ---------- 1. СМЕНА ИЗОБРАЖЕНИЯ ----------
    if (action.type === "changeImage") {
        switchImage(action.from, action.to);
    }


    // ---------- 2. ИЗМЕНЕНИЕ СТАТОВ ----------
    if (action.stats) {
        for (let key in action.stats) {
            Stats.add(key, action.stats[key]);
        }
    }


    // ---------- 3. ОКНО-ДИАЛОГ ----------
    if (action.openDialog) {
        const message = action.text;

        openDialog(message);
    }


    // ---------- 4. ОТМЕТКА "credits" ----------
    if (action.credits) {
        sessionStorage.setItem("credits", "true");
    }
    if (action.author) {
        sessionStorage.setItem("author", action.author);
    }



    // ---------- 5. РЕЖИМ WEB (кнопка Назад) ----------
    if (action.volver) {
        // sessionStorage.setItem("actual", action.from);
        hideButtons();
        document.getElementById("back").style.display = "block";
    }

    if (action.legal) {
        sessionStorage.setItem("legal", true);
    }
}

