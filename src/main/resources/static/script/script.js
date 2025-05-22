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
            alert("Giocatore: " + response.giocatore + "\nComputer: " + response.computer);
            
            const cellComputer = $('#computer-grid .cell').eq(index);
            if (response.giocatore.includes("colpita") || response.giocatore.includes("affondata")) {
                cellComputer.css('background-color', 'red');
            } else {
                cellComputer.css('background-color', 'lightgrey');
            }

            $.ajax({
                url: '/api/attacca-computer',
                method: 'PUT',
                success: function (computerAttackResponse) {
                    const computerX = computerAttackResponse.x;
                    const computerY = computerAttackResponse.y;
                    const risultato = computerAttackResponse.risultato;

                    const cellPlayer = $('#player-grid .cell').eq(computerY * 10 + computerX);
                    if (risultato.includes("colpita") || risultato.includes("affondata")) {
                        cellPlayer.css('background-color', 'red');
                    } else {
                        cellPlayer.css('background-color', 'lightgrey');
                    }
                    
                    alert("L'attacco del computer: " + risultato);
                },
                error: function () {
                    alert('Errore nell\'attacco del computer!');
                }
            });
        },
        error: function () {
            alert('Errore nell\'attacco!');
        }
    });
});

});