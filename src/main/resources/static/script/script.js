document.addEventListener("DOMContentLoaded", function () {
    function createEmptyGrid(containerId) {
        const container = document.getElementById(containerId);
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            container.appendChild(cell);
        }
    }

    createEmptyGrid('player-grid');
    createEmptyGrid('computer-grid');

    // Popola le navi del giocatore
    fetch('/api/popola-griglie')
        .then(response => response.json())
        .then(data => {
            data.player.forEach(index => {
                document.querySelector(`#player-grid .cell:nth-child(${index + 1})`).classList.add('ship');
            });
        })
        .catch(() => alert('Errore nel caricamento delle griglie!'));

    // Click sul campo del computer
    document.getElementById('computer-grid').addEventListener('click', function (e) {
        const target = e.target;
        if (!target.classList.contains('cell')) return;

        const index = parseInt(target.dataset.index);
        const cellComputer = target;

        // Evita colpi ripetuti
        if (cellComputer.classList.contains('colpita')) return;

        fetch(`/api/attacca/${index}`, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                cellComputer.classList.add('colpita');

                if (data.giocatore.includes("colpita") || data.giocatore.includes("affondata")) {
                    cellComputer.style.backgroundColor = 'red';
                } else {
                    cellComputer.style.backgroundColor = 'lightgrey';
                }

                alert("Giocatore: " + data.giocatore);

                if (data.fine) {
                    alert(data.fine);
                    document.getElementById('computer-grid').replaceWith(document.getElementById('computer-grid').cloneNode(true));
                    return;
                }

                // Attacco del computer
                fetch('/api/attacca-computer', { method: 'PUT' })
                    .then(response => response.json())
                    .then(computerData => {
                        const { x, y, risultato, fine } = computerData;
                        const indexPlayer = y * 10 + x;
                        const cellPlayer = document.querySelector(`#player-grid .cell:nth-child(${indexPlayer + 1})`);

                        if (risultato.includes("colpita") || risultato.includes("affondata")) {
                            cellPlayer.style.backgroundColor = 'red';
                        } else {
                            cellPlayer.style.backgroundColor = 'lightgrey';
                        }

                        alert("L'attacco del computer: " + risultato);

                        if (fine) {
                            alert(fine);
                            document.getElementById('computer-grid').replaceWith(document.getElementById('computer-grid').cloneNode(true));
                        }
                    })
                    .catch(() => alert('Errore nell\'attacco del computer!'));
            })
            .catch(() => alert('Errore nell\'attacco!'));
    });
});
