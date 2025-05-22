package battaglia.navale.web.battaglia_navale_web.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class Field {
    public final static int DIMENSIONE = 10;
    public ArrayList<Nave> navi;
    private ArrayList<Punto> attacchi;
    private Random rand;

    public Field() {
        this.navi = new ArrayList<>();
        this.attacchi = new ArrayList<>();
        this.rand = new Random();
    }

    public boolean posizioneValida(Nave nave) {
        for (Nave n : navi) {
            for (Punto p : n.punti) {
                if (nave.contiene(p)) {
                    return false;
                }
            }
        }
        return true;
    }

    public ArrayList<Nave> piazzaNavi() {
        int[] lunghezze = { 4, 3, 3, 3, 2, 2, 2, 1, 1 };

        for (int lunghezza : lunghezze) {
            boolean posizionata = false;

            while (!posizionata) {
                int x = rand.nextInt(DIMENSIONE);
                int y = rand.nextInt(DIMENSIONE);
                boolean orizzontale = rand.nextBoolean();

                if ((orizzontale && x + lunghezza > DIMENSIONE) || (!orizzontale && y + lunghezza > DIMENSIONE)) {
                    continue;
                }

                Nave nuovaNave = new Nave(x, y, lunghezza, orizzontale);

                if (posizioneValida(nuovaNave)) {
                    navi.add(nuovaNave);
                    posizionata = true;
                }
            }
        }
        return navi;
    }

    public String attacca(int x, int y) {
        Punto attacco = new Punto(x, y);
        if (attacchi.contains(attacco)) {
            return "Colpo già effettuato";
        }
        if (x >= 10 || x < 0 || y >= 10 || y < 0) {
            return "Colpo fuori dal campo";
        }

        attacchi.add(attacco);

        for (Nave nave : navi) {
            if (nave.contiene(attacco)) {
                nave.colpisci(attacco);
                return nave.affondata ? "Nave affondata!" : "Nave colpita!";
            }
        }
        return "Hai colpito acqua";
    }

    public Map<String, Object> attaccoComputer() {
        int x, y;
        Punto attacco;
        do {
            x = rand.nextInt(DIMENSIONE);
            y = rand.nextInt(DIMENSIONE);
            attacco = new Punto(x, y);
        } while (attacchi.contains(attacco));

        String risultato = attacca(x, y);

        Map<String, Object> result = new HashMap<>();
        result.put("x", x);
        result.put("y", y);
        result.put("risultato", risultato);

        return result;
    }

    public boolean tutteAffondate() {
        return navi.stream().allMatch(n -> n.affondata);
    }
    
}
