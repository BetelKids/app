# Rama pentru „Recapitulare · Școala duminicală”

Pagină găzduită gratuit pe GitHub Pages care încadrează aplicația publicată din Google Apps Script.
Copiii primesc o adresă scurtă și curată, fără bara „Această aplicație a fost creată de un utilizator
care folosește scriptul Google Apps”, iar pagina se poate instala pe telefon ca o aplicație obișnuită.

```
index.html             pagina care încadrează aplicația (ecran de pornire, instalare, mesaj fără internet)
config.js              SINGURUL fișier de modificat: adresa /exec a aplicației
manifest.webmanifest   datele de instalare pe telefon (nume, pictograme, culoare)
sw.js                  pornește pagina și fără internet; nu păstrează niciodată răspunsurile copiilor
offline.html           mesajul afișat când nu există conexiune
icons/                 pictogramele aplicației
.nojekyll              îi spune lui GitHub Pages să publice fișierele ca atare
```

---

## 1. Publică aplicația din Apps Script

În proiectul Apps Script: **Implementare → Implementare nouă → Aplicație web**

| Câmp | Valoare |
|---|---|
| Execută ca | **Eu** |
| Cine are acces | **Oricine** |

Copiază „Adresa URL a aplicației web” — se termină în `/exec`.

> „Oricine” este obligatoriu. Dacă pui „Oricine cu un cont Google”, Google cere autentificare în
> interiorul ramei și pagina rămâne goală.

## 2. Creează depozitul pe GitHub

1. github.com → **New repository**
2. Nume: `scoala-duminicala` · **Public** · fără README (îl aducem noi)
3. **Create repository**
4. În depozitul gol: **uploading an existing file** → trage toate fișierele din această arhivă,
   **inclusiv folderul `icons` și fișierul `.nojekyll`** → **Commit changes**

Din terminal (Bazzite), varianta echivalentă:

```bash
cd scoala-duminicala
git init && git add . && git commit -m "Rama pentru aplicația de școală duminicală"
git branch -M main
git remote add origin https://github.com/NUMELE-TAU/scoala-duminicala.git
git push -u origin main
```

## 3. Pornește GitHub Pages

**Settings → Pages →** Source: *Deploy from a branch* → Branch: **main** / **/ (root)** → **Save**

După un minut-două adresa este:

```
https://NUMELE-TAU.github.io/scoala-duminicala/
```

## 4. Pune adresa aplicației în `config.js`

În depozit: `config.js` → creionul de editare → înlocuiește adresa din `url` cu cea copiată la pasul 1
→ **Commit changes**. În 1–2 minute pagina funcționează.

## 5. Spune-i aplicației care e adresa ei publică

În `Code.gs`, la începutul fișierului:

```js
URL_PUBLIC: 'https://NUMELE-TAU.github.io/scoala-duminicala/',
```

Apoi **Implementare → Gestionează implementările → ✏️ → Versiune: Nouă → Implementare**.

Fără acest pas, codul QR de pe ecranul de clasă trimite copiii la adresa lungă `script.google.com`.

---

## Cum se folosește

| Ce vrei | Adresa |
|---|---|
| Copiii, pe telefon | `https://NUMELE-TAU.github.io/scoala-duminicala/` |
| Ecranul proiectat în clasă | `https://NUMELE-TAU.github.io/scoala-duminicala/?ecran` |

**Instalarea pe telefon.** Pe Android apare singură o bară cu „Instalează”. Pe iPhone: butonul
*Distribuie* → *Adaugă la ecranul principal*. După instalare, aplicația se deschide pe tot ecranul,
fără bara browserului.

## Când schimbi ceva

- **Modifici aplicația în Apps Script** → *Gestionează implementările → ✏️ → Versiune: Nouă*.
  Adresa `/exec` rămâne aceeași, deci nu atingi nimic pe GitHub.
  (Atenție: „Implementare nouă” creează o adresă nouă — atunci trebuie actualizat și `config.js`.)
- **Modifici fișierele de aici** → schimbă `VERSIUNE` din `sw.js` (`sd-v2` → `sd-v3`),
  altfel telefoanele care au instalat deja aplicația păstrează versiunea veche.
- **Ai un domeniu propriu** → adaugă un fișier `CNAME` cu domeniul și configurează-l în *Settings → Pages*.

## De știut

- Rama merge cu versiunea aplicației livrată odată cu ea: la pornire, aplicația îi trimite ramei un
  semnal „am pornit”. Așa știe pagina să ascundă ecranul de încărcare și, dacă semnalul nu vine în
  12 secunde, să afișeze un mesaj în loc de un ecran alb. Dacă pui rama peste o versiune mai veche a
  aplicației, totul funcționează, dar mesajul de eroare apare degeaba după 12 secunde.

- Rama nu stochează nimic: răspunsurile, numele și PIN-urile copiilor rămân în foaia ta de calcul,
  iar `sw.js` păstrează local doar pagina goală, ca să pornească și fără semnal.
- Depozitul este public — fișierele de aici nu conțin date despre copii, doar adresa aplicației.
- Pe iPhone, Safari poate șterge memoria locală a unui conținut încadrat; atunci copilul își alege
  din nou numele și scrie PIN-ul, nimic mai mult.
