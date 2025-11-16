let currentLevel = null;

// Получение номера уровня из URL: game.html?level=1
function getLevelNumber() {
    const params = new URLSearchParams(window.location.search);
    return params.get("level") || "1";
}

// Очищаем контейнеры перед рендером
function clearLevelRoot() {
    const root = document.getElementById("level-root");
    root.innerHTML = "";
}

function clearButtonsContainer() {
    const c = document.getElementById("buttons");
    c.innerHTML = "";
}

// Показывает только те кнопки, что указаны в изображении
function updateButtonsForImage(imageId) {
    if (!currentLevel) return;
    const imgData = currentLevel.images.find(img => img.id === imageId);
    if (!imgData) return;

    // Если в уровне вообще нет описания кнопок — ничего не делаем
    if (!Array.isArray(currentLevel.buttons)) return;

    currentLevel.buttons.forEach(btn => {
        const el = document.getElementById(btn.id);
        if (!el) return;
        if (imgData.buttons && imgData.buttons.includes(btn.id)) {
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }
    });
}

// Универсальная смена изображения — скрывает все, показывает одно и обновляет кнопки
function switchImage(hideId, showId) {
    // скрываем все картинки в корне
    document.querySelectorAll("#level-root img").forEach(im => {
        im.style.display = "none";
        console.log('hide');
    });

    // показываем нужное
    const show = document.getElementById(showId);
    if (show) show.style.display = "block";

    // Обновляем кнопки для текущего изображения
    // updateButtonsForImage(showId);

    // Пересчитать карту (если библиотека подключена)
    /*if (typeof imageMapResize === "function") {
        // даём браузеру отрисовать изменения
        setTimeout(() => imageMapResize(), 30);
    }*/
    imageMapResize();
}

// Рендер изображений уровня
function renderImages(images) {
    const root = document.getElementById("level-root");

    // Убедимся, что контейнер имеет относительное позиционирование
    // root.style.position = root.style.position || "relative";

    images.forEach((imgData, idx) => {
        const img = document.createElement("img");
        img.id = imgData.id;
        img.src = imgData.src;
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = imgData.visible ? "block" : "none";
        // Сделаем их накладывающимися, чтобы переключение было чистым
        /*img.style.position = "absolute";
        img.style.top = "0";
        img.style.left = "0";
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = imgData.visible ? "block" : "none";
        img.style.zIndex = imgData.zIndex || (idx + 1);*/

        if (imgData.map) {
            img.useMap = `#${imgData.map}`;
        }

        root.appendChild(img);
    });
}

// Рендер HTML-карт зон клика
function renderMaps(maps) {
    const root = document.getElementById("level-root");

    // Удаляем старые <map>, чтобы не было дубликатов
    const existingMaps = root.querySelectorAll("map");
    existingMaps.forEach(m => m.remove());

    for (let mapName in maps) {
        const map = document.createElement("map");
        map.name = mapName;

        maps[mapName].forEach(areaData => {
            const area = document.createElement("area");
            area.shape = "rect";
            area.coords = areaData.coords;
            area.href = "javascript:void(0);";

            // навешиваем обработчик безопасно
            area.addEventListener("click", () => {
                try {
                    performAction(areaData.action);
                } catch (e) {
                    console.error("performAction failed:", e, areaData.action);
                }
            });

            map.appendChild(area);
        });

        root.appendChild(map);
    }
}

// Загрузка кнопок
function renderButtons(buttons) {
    const container = document.getElementById("buttons");
    container.innerHTML = ""; // очистим перед рендером

    if (!Array.isArray(buttons)) return;

    buttons.forEach(btn => {
        const el = document.createElement("button");
        el.id = btn.id;
        el.textContent = btn.name;
        el.style.display = btn.visible ? "block" : "none";
        // console.log(btn.function)
        // el.onclick=btn.function+"();";

        // привязать функцию (безопасно)
        el.addEventListener("click", () => {
            const fnName = btn.function;
            if (window.buttonRegistry && typeof window.buttonRegistry[fnName] === "function") {
                window.buttonRegistry[fnName](currentLevel, btn);
            } else {
                console.warn("buttonRegistry function not found:", fnName);
            }
        });

        container.appendChild(el);
    });
}

// Загрузка JSON уровня
async function loadLevel() {
    const levelNum = getLevelNumber();
    const url = `./levels/${levelNum}.json`;

    try {
        const response = await fetch(url);
        const level = await response.json();

        // Сохраняем глобально, чтобы другие функции могли к нему обращаться
        currentLevel = level;

        // Очистка перед рендером
        clearLevelRoot();
        clearButtonsContainer();

        renderImages(level.images);
        renderMaps(level.maps);
        renderButtons(level.buttons);

        imageMapResize();

        // Показать кнопки для стартового изображения (первого видимого)
        /*const firstImage = level.images.find(img => img.visible);
        if (firstImage) updateButtonsForImage(firstImage.id);

        if (typeof imageMapResize === "function") {
            setTimeout(() => imageMapResize(), 50);
        }*/
    } catch (err) {
        console.error("Error loading level:", err);
        const root = document.getElementById("level-root");
        if (root) root.innerHTML = "<p style='color:red;'>Error cargando el nivel.</p>";
    }
}

window.addEventListener("DOMContentLoaded", loadLevel);
