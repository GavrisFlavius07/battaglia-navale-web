
const PLAYER_GRID_ID = 'player-grid';
const COMPUTER_GRID_ID = 'computer-grid';


function createEmptyGrid(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; 

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        container.appendChild(cell);
    }
}

function markCell(cell, result) {
    cell.classList.add('colpita');
    if (result.includes("colpita") || result.includes("affondata")) {
        cell.style.backgroundColor = 'red';
    } else {
        cell.style.backgroundColor = 'lightgrey';
    }
}

// ==== NAVI ====
function piazzaNaviGiocatore() {
    fetch('/api/popola-griglie')
        .then(response => response.json())
        .then(data => {
            data.player.forEach(index => {
                document.querySelector(`#${PLAYER_GRID_ID} .cell:nth-child(${index + 1})`).classList.add('ship');
            });
            document.getElementById("pulsante-piazza-navi").disabled = true;
        })
        .catch(() => alert('Errore nel caricamento delle navi!'));
}

// ==== RESET ====
function resetGriglie() {
    fetch('/api/reset', { method: 'POST' })
        .then(() => {
            createEmptyGrid(PLAYER_GRID_ID);
            createEmptyGrid(COMPUTER_GRID_ID);
            setupComputerGridClickHandler();
            document.getElementById("pulsante-piazza-navi").disabled = false;
            aggiornaMessaggi('', ''); // pulisce i messaggi
        })
        .catch(() => aggiornaMessaggi('', "Errore durante il reset!"));
}

// ==== ATTACCHI ====
function attaccoGiocatore(index, cellComputer) {
    fetch(`/api/attacca/${index}`, { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            markCell(cellComputer, data.giocatore);
            aggiornaMessaggi(`Giocatore: ${data.giocatore}`, ''); // Solo messaggio giocatore per ora

            if (data.fine) {
                aggiornaMessaggi(`Giocatore: ${data.giocatore}`, data.fine);
                return;
            }

            attaccoComputer();
        })
        .catch(() => aggiornaMessaggi('Errore nell\'attacco del giocatore!', ''));
}

function attaccoComputer() {
    fetch('/api/attacca-computer', { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            const { x, y, risultato, fine } = data;
            const index = y * 10 + x;
            const cell = document.querySelector(`#${PLAYER_GRID_ID} .cell:nth-child(${index + 1})`);
            markCell(cell, risultato);

            aggiornaMessaggi(
                document.getElementById('player-message').textContent, // mantiene messaggio giocatore
                `Computer: ${risultato}`
            );

            if (fine) {
                aggiornaMessaggi(
                    document.getElementById('player-message').textContent,
                    fine
                );
            }
        })
        .catch(() => aggiornaMessaggi('', "Errore nell'attacco del computer!"));
}

// ==== EVENTI ====
function setupComputerGridClickHandler() {
    const grid = document.getElementById(COMPUTER_GRID_ID);
    const newGrid = grid.cloneNode(true);
    grid.replaceWith(newGrid); // Rimuove tutti i vecchi eventi
    newGrid.addEventListener('click', function (e) {
        const target = e.target;
        if (!target.classList.contains('cell')) return;

        const index = parseInt(target.dataset.index);
        if (target.classList.contains('colpita')) return;

        attaccoGiocatore(index, target);
    });
}

function aggiornaMessaggi(messaggioGiocatore, messaggioComputer) {
    document.getElementById('player-message').textContent = messaggioGiocatore || "";
    document.getElementById('computer-message').textContent = messaggioComputer || "";
}
// ==== INIZIALIZZAZIONE ====
document.addEventListener("DOMContentLoaded", () => {
    createEmptyGrid(PLAYER_GRID_ID);
    createEmptyGrid(COMPUTER_GRID_ID);
    setupComputerGridClickHandler();

    document.getElementById("pulsante-piazza-navi").addEventListener("click", piazzaNaviGiocatore);
    document.getElementById("pulsante-reset").addEventListener("click", resetGriglie);
});
