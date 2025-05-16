package battaglia.navale.web.battaglia_navale_web.model;

import java.util.ArrayList;

public class Nave {
    public ArrayList<Punto> punti;
    public boolean affondata;

    public Nave(int x, int y, int lunghezza, boolean orizzontale) {
        this.punti = new ArrayList<>();
        for (int i = 0; i < lunghezza; i++) {
            if (orizzontale) {
                punti.add(new Punto(x + i, y));
            } else {
                punti.add(new Punto(x, y + i));
            }
        }
        this.affondata = false;
    }

    public boolean contiene(Punto p) {
        return punti.contains(p);
    }

    public void colpisci(Punto p) {
        punti.remove(p);
        if (punti.isEmpty()) {
            affondata = true;
        }
    }
}
