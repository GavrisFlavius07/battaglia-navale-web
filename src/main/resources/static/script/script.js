
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
    cell.classList.remove('colpita', 'miss', 'affondata');

    const res = result.toLowerCase();

    if (res.includes("acqua")) {
        cell.classList.add('miss');
    } else if (res.includes("affondata")) {
        cell.classList.add('affondata');
    } else if (res.includes("colpita")) {
        cell.classList.add('colpita');
    }
    cell.classList.add('disabled');
}



function piazzaNaviGiocatore() {
    fetch('/api/popola-griglie')
        .then(response => response.json())
        .then(data => {
            data.player.forEach(index => {
                document.querySelector(`#${PLAYER_GRID_ID} .cell:nth-child(${index + 1})`).classList.add('ship');
            });
            /*data.computer.forEach(index => {
                document.querySelector(`#${COMPUTER_GRID_ID} .cell:nth-child(${index + 1})`).classList.add('ship');
            });*/

            abilitaCelleComputer(true);
            setupComputerGridClickHandler();
            document.getElementById("pulsante-piazza-navi").disabled = true;
        }).catch(() => alert('Errore nel caricamento delle navi!'));
}

function abilitaCelleComputer(abilita) {
    const celle = document.querySelectorAll(`#${COMPUTER_GRID_ID} .cell`);
    celle.forEach(cell => {
        if (abilita) {
            cell.classList.remove('disabled');
        } else {
            cell.classList.add('disabled');
        }
    });
}



function resetGriglie() {
    fetch('/api/reset', { method: 'POST' })
        .then(() => {
            createEmptyGrid(PLAYER_GRID_ID);
            createEmptyGrid(COMPUTER_GRID_ID);
            abilitaCelleComputer(false); // Disabilita le celle finché non si piazzano le navi
            setupComputerGridClickHandler();
            document.getElementById("pulsante-piazza-navi").disabled = false;
            aggiornaMessaggi('', '');
        })
        .catch(() => aggiornaMessaggi('', "Errore durante il reset!"));
}



function attaccoGiocatore(index, cellComputer) {
    fetch(`/api/attacca/${index}`, { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            markCell(cellComputer, data.giocatore);
            aggiornaMessaggi(`Giocatore: ${data.giocatore}`, '');

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
                document.getElementById('player-message').textContent,
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


function setupComputerGridClickHandler() {
    const grid = document.getElementById(COMPUTER_GRID_ID);
    const newGrid = grid.cloneNode(true);
    grid.replaceWith(newGrid);
    newGrid.addEventListener('click', function (e) {
        const target = e.target;
        if (!target.classList.contains('cell')) return;

        if (target.classList.contains('disabled')) return;

        const index = parseInt(target.dataset.index);
        attaccoGiocatore(index, target);
    });
}

function aggiornaMessaggi(messaggioGiocatore, messaggioComputer) {
    document.getElementById('player-message').textContent = messaggioGiocatore || "";
    document.getElementById('computer-message').textContent = messaggioComputer || "";
}

document.addEventListener("DOMContentLoaded", () => {
    createEmptyGrid(PLAYER_GRID_ID);
    createEmptyGrid(COMPUTER_GRID_ID);
    abilitaCelleComputer(false);
    setupComputerGridClickHandler();

    document.getElementById("pulsante-piazza-navi").addEventListener("click", piazzaNaviGiocatore);
    document.getElementById("pulsante-reset").addEventListener("click", resetGriglie);
});

