package battaglia.navale.web.battaglia_navale_web.controller;

import battaglia.navale.web.battaglia_navale_web.model.Field;
import battaglia.navale.web.battaglia_navale_web.model.Nave;
import battaglia.navale.web.battaglia_navale_web.model.Punto;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class FieldController {

    private Field playerField = new Field();
    private Field computerField = new Field();
    private boolean gameStarted = false;

    @GetMapping("/popola-griglie")
    public Map<String, ArrayList<Integer>> popolaGriglie() {
        if (!gameStarted) {
            playerField.piazzaNavi();
            computerField.piazzaNavi();
            gameStarted = true;
        }

        Map<String, ArrayList<Integer>> griglie = new HashMap<>();
        griglie.put("player", convertiCoordinate(playerField));
        return griglie;
    }

    @PutMapping("/attacca/{index}")
    public Map<String, String> attacca(@PathVariable int index) {
        int x = index % 10;
        int y = index / 10;

        String esitoGiocatore = computerField.attacca(x, y);
        Map<String, String> risultato = new HashMap<>();
        risultato.put("giocatore", esitoGiocatore);

        if (computerField.tutteAffondate()) {
            risultato.put("fine", "Hai vinto!");
        }

        return risultato;
    }

    @PutMapping("/attacca-computer")
    public Map<String, Object> attaccaComputer() {
        Map<String, Object> risultato = playerField.attaccoComputer();
        if (playerField.tutteAffondate()) {
            risultato.put("fine", "Hai perso.");
        }
        return risultato;
    }

    private ArrayList<Integer> convertiCoordinate(Field field) {
        ArrayList<Integer> posizioni = new ArrayList<>();
        for (Nave nave : field.navi) {
            for (Punto p : nave.punti) {
                posizioni.add(p.y * 10 + p.x);
            }
        }
        return posizioni;
    }

    @PostMapping("/reset")
    public void reset() {
        playerField = new Field();
        computerField = new Field();
        gameStarted = false;
    }

}
