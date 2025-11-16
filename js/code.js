function openInventory() {
    const dialog = document.getElementById("inventory");
    const ul = document.getElementById("inventory-list");
    const attr = document.getElementById("inv-attribute");

    // Получаем массив из sessionStorage
    const data = JSON.parse(sessionStorage.getItem('list')) || [];

    ul.innerHTML='';
    // Проходимся по массиву и создаём li
    data.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
    });

    // если можно атрибутировать — показываем кнопку
    if (sessionStorage['author']) {
        attr.style.display = "block";
    }

    dialog.showModal();
}


function closeInventory(){
    const items = document.querySelectorAll('#inventory-list li');   // выбираем все li
    const texts = [];

    items.forEach(li => {
        texts.push(li.textContent.trim());
    });

    sessionStorage.setItem('list', JSON.stringify(texts));
    document.getElementById("inventory").close();
}

function attribute(self){
    // Достаём массив
    const arr = JSON.parse(sessionStorage.getItem('list')) || [];

    // Добавляем новый элемент
    arr.push(sessionStorage['author']);  // <-- сюда вставляй нужный текст

    // Записываем обратно
    sessionStorage.setItem('list', JSON.stringify(arr));

    // Добавить визуально
    const ul = document.getElementById("inventory-list");
    const el = document.createElement('li');
    el.textContent=sessionStorage['author'];
    ul.appendChild(el);
    self.style.display = "none";

    sessionStorage.removeItem('author');

}