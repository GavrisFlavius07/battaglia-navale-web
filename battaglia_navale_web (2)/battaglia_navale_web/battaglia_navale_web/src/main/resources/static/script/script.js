$(document).ready(function () {
    function createEmptyGrid(container) {
        for (let i = 0; i < 100; i++) {
            $(container).append('<div class="cell" data-index="' + i + '"></div>');
        }
    }

    createEmptyGrid('#player-grid');
    createEmptyGrid('#computer-grid');

    $.ajax({
        url: '/api/popola-griglie',
        method: 'GET',
        success: function (response) {
            response.player.forEach(index => {
                $('#player-grid .cell').eq(index).addClass('ship');
            });
        },
        error: function () {
            alert('Errore nel caricamento delle griglie!');
        }
    });

    $('#computer-grid').on('click', '.cell', function () {
        const index = $(this).data('index');

        $.ajax({
            url: '/api/attacca/' + index,
            method: 'PUT',
            success: function (response) {
                alert("Giocatore: " + response.giocatore + 
                      "\nComputer: " + response.computer);
                const cell = $('#computer-grid .cell').eq(index);
                if (response.giocatore.includes("colpita") || response.giocatore.includes("affondata")) {
                    cell.css('background-color', 'red');
                } else {
                    cell.css('background-color', 'lightgrey');
                }
            },
            error: function () {
                alert('Errore nell\'attacco!');
            }
        });
    });
});