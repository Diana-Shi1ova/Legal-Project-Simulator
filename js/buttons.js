function hideAllButtons(){
    document.querySelectorAll("#buttons button").forEach(im => {
        im.style.display = "none";
    });
}

function statsChange(stat, value, text=null){
    sessionStorage[stat] = Number(sessionStorage[stat] || 0) + value;
    document.getElementById(stat).textContent = sessionStorage[stat];

    /*if(image){
        sessionStorage.setItem('image', 'CC0');
        console.log('set item');
    }*/
    if(text) openModal(text, value);
}

function openModal(text, value) {
    let dialog = document.getElementById("dialog");
    let p = document.createElement('p');
    let but = document.createElement('button');
    but.onclick=closeDialog;
    but.textContent='Continuar';
    p.textContent = `${text}${value}`;
    dialog.appendChild(p);
    dialog.appendChild(but);
    dialog.showModal();
}

function closeDialog() {
    document.getElementById("dialog").close();
}




window.buttonRegistry = window.buttonRegistry || {};

window.buttonRegistry.search_image = function(level, btn) {
    hideAllButtons();
    if(sessionStorage['legal']) {
        switchImage('search-men2-clicked', 'cc0-image');
        document.getElementById('use').style.display = 'block';
    }
    else{
        switchImage('search-menu2-clicked', 'c-image');
        document.getElementById('other').style.display = 'block';
        document.getElementById('use').style.display = 'block';
    }
};

window.buttonRegistry.use_image = function(level, btn){
    console.log("Usar imagen clicked");
    if(!sessionStorage['legal']) {
        statsChange('risk', 30);
    }
    else{
        if(!sessionStorage['credits']){
            statsChange('risk', 5);
        }
    }

    sessionStorage.removeItem('legal');
    sessionStorage.removeItem('credits');
    window.location.href = "selection.html?level=1";
};

window.buttonRegistry.other_image = function(level, btn){
    console.log("Buscar otra imagen clicked");
    hideAllButtons();
    sessionStorage['legal']=true;
    statsChange('time', 1, '¡Tardaste mucho en buscar! Tiempo: +');
    switchImage('search-men2-clicked', 'cc0-image');
    document.getElementById('use').style.display = 'block';
};

window.buttonRegistry.back_image = function(level, btn){
    hideAllButtons();
    console.log("Volver clicked");
    if(sessionStorage['legal']){
        switchImage('search-men2-clicked', 'cc0-image');
        document.getElementById('use').style.display = 'block';
    }
    else{
        switchImage('search-men2-clicked', 'c-image');
        document.getElementById('other').style.display = 'block';
        document.getElementById('use').style.display = 'block';
    }
};

window.buttonRegistry.generate_ia = function(level, btn) {
    hideAllButtons();
    switchImage('ia', 'ia-generated');
    document.getElementById('use').style.display = 'block';
};

window.buttonRegistry.use_ia = function(level, btn) {
    if(!sessionStorage['credits']) statsChange('risk', 5);
    if(!sessionStorage['attribute']) statsChange('risk', 10);
    statsChange('quality', -1);
    sessionStorage.removeItem('credits');
    sessionStorage.removeItem('attribute');
    window.location.href = "selection.html?level=1";
};

window.buttonRegistry.back_library = function(level, btn) {
    hideAllButtons();
    switchImage('library-licence', 'library');
    document.getElementById('use').style.display = 'block';
};

window.buttonRegistry.use_library = function(level, btn) {
    if(!sessionStorage['credits']) statsChange('risk', 5);
    if(!sessionStorage['attribute']) statsChange('risk', 10);
    sessionStorage.removeItem('credits');
    sessionStorage.removeItem('attribute');
    window.location.href = "selection.html?level=2";
};

window.buttonRegistry.search_sound = function(level, btn) {
    if(sessionStorage['count']){
        hideAllButtons();
        switchImage('library-licence', 'sound-click');
        sessionStorage.removeItem('count');
        document.getElementById('use').style.display = 'block';
    }
    else{
        sessionStorage['count']=true;
        switchImage('library-licence', 'search-sound');
    }
};

window.buttonRegistry.back_sound = function(level, btn) {
    hideAllButtons();
    switchImage('library-licence', 'sound-click');
    document.getElementById('use').style.display = 'block';
};

window.buttonRegistry.use_sound = function(level, btn) {
    if(!sessionStorage['credits']) statsChange('risk', 5);
    if(!sessionStorage['attribute']) statsChange('risk', 10);
    sessionStorage.removeItem('credits');
    sessionStorage.removeItem('attribute');
    window.location.href = "selection.html?level=4";
};

window.buttonRegistry.search_3d = function(level, btn) {
    if(sessionStorage['count']){
        hideAllButtons();
        switchImage('library-licence', '3d-tierra');
        sessionStorage.removeItem('count');
        document.getElementById('use').style.display = 'block';
    }
    else{
        sessionStorage['count']=true;
        switchImage('library-licence', '3d-search');
    }
};

window.buttonRegistry.use_3d = function(level, btn) {
    if(!sessionStorage['credits']) statsChange('risk', 5);
    if(!sessionStorage['attribute']) statsChange('risk', 10);
    sessionStorage.removeItem('credits');
    sessionStorage.removeItem('attribute');
    window.location.href = "selection.html?level=3";
};

window.buttonRegistry.back_3d = function(level, btn) {
    hideAllButtons();
    switchImage('library-licence', '3d-tierra');
    document.getElementById('use').style.display = 'block';
};

window.buttonRegistry.search_icon = function(level, btn) {
    hideAllButtons();
    switchImage('library-licence', 'icon-luna');
    sessionStorage.removeItem('count');
    document.getElementById('use').style.display = 'block';
};

window.buttonRegistry.use_icon = function(level, btn) {
    if(!sessionStorage['credits']) statsChange('risk', 5);
    if(!sessionStorage['attribute']) statsChange('risk', 10);
    sessionStorage.removeItem('credits');
    sessionStorage.removeItem('attribute');
    window.location.href = "final.html";
};

/*// Управление кнопками уровня

function hideAllButtons() {
    ["search", "other", "use", "-back"]
        .forEach(id => document.getElementById(id).style.display = "none");
}

// Логика "Buscar imagen"
document.getElementById("search").onclick = () => {
    hideAllButtons();

    let firstChoice = sessionStorage.getItem("image") || "C";

    if (firstChoice === "C") {
        switchImage("search", "c-image");
        document.getElementById("other").style.display = "block";
        document.getElementById("use").style.display = "block";
        sessionStorage.setItem("image", "C");
    } else {
        switchImage("search", "cc0-image");
        document.getElementById("use").style.display = "block";
    }
};

// Логика "Buscar otra"
document.getElementById("other").onclick = () => {
    Stats.add("time", 1);
    switchImage("c-image", "cc0-image");
    document.getElementById("use").style.display = "block";
    hideAllButtons();
    document.getElementById("use").style.display = "block";
    sessionStorage.setItem("image", "CC0");
};

// Логика "Usar imagen"
document.getElementById("use").onclick = () => {
    if (sessionStorage.getItem("image") === "C") {
        Stats.add("risk", 30);
    }
    window.location.href = "levels.html";
};

// Логика "Volver"
document.getElementById("back").onclick = () => {
    hideAllButtons();

    const last = sessionStorage.getItem("actual");

    if (sessionStorage.getItem("image") === "CC0") {
        switchImage(last, "cc0-image");
        document.getElementById("use").style.display = "block";
    } else {
        switchImage(last, "c-image");
        document.getElementById("other").style.display = "block";
        document.getElementById("use").style.display = "block";
    }

    sessionStorage.removeItem("actual");
};*/
