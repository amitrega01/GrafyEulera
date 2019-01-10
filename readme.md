## Akademia Techniczno - Humanistyczna w Bielsku-Białej

## Algorytmiczne ujęcie teorii grafów

# Grafy Eulera - aplikacja


## Wstęp teoretyczny

### Opis zagadnienia

**Graf Eulera** ​– rodzaj grafu rozpatrywany w teorii grafów. Graf eulerowski odznacza się tym,
że da się w nim skonstruować cykl Eulera, czyli cykl, który przechodzi przez każdą jego
krawędź dokładnie raz.
Pierwszy raz problem poszukiwania cyklów w grafach został podniesiony przez
szwajcarskiego matematyka, Leonharda Eulera w roku 1736, który chciał rozwiązać
zagadnienie mostów królewieckich.

Warunkami istnienia cyklu są:
* spójność grafu,
* dla grafu skierowanego należy sprawdzić czy do każdego wierzchołka wchodzi tyle samo krawędzi co wychodzi,
* dla grafu nieskierowanego z każdego wierzchołka musi wychodzić parzysta liczba krawędzi.
* W naszym przypadku zajmować się będziemy grafami nieskierowanymi.


### Generowanie grafu Eulera

Należy sprawdzać kolejno dla wierzchołków od 1 do n-1, gdzie n - liczba wierzchołków, czy spełnione są podane powyżej warunki. Jeżeli są spełnione to przechodzimy do sprawdzania następnego wierzchołka, jeżeli nie to wybieramy wierzchołek o indeksie większym od aktualnie sprawdzanego i dodajemy bądź usuwamy dowolnie krawędź wchodzącą lub wychodzącą.


## Kod źródłowy

Aplikacja wykorzystuje ​ **HTML** ​oraz ​ **JavaScript.** ​Do wygenerowania graficznej reprezentacji grafu, używamy framework ​ **Vis.js.** ​(​http://visjs.org/​). Całość może zostać uruchomiona na serwerze i działać jako strona internetowa do generowania grafów Eulera.

### Funkcja generująca graf Eulera:
```
function Generator(n, p) {
 let res = new Array(n);
 for (var i = 0; i < res.length; i++) {
   res[i] = new Array(n);
 }
 for (i = 0; i < n; i++) for (j = 0; j < n; j++) res[i][j] = 0;
 for (i = 1; i < n; i++)
   for (j = 0; j < i; j++)
     if (getRandomInt(0, 100) <= p) {
       res[i][j] = 1;
       res[j][i] = 1;
     }
 for (i = 0; i < n - 1; i++) {
   //calculate degree
   let deg = 0;
   for (j = 0; j < n; j++) if (res[i][j] > 0) deg++;
   //check if degree is even
   if (deg % 2 != 0) {
     let x = getRandomInt(0, n - i - 2) + i + 1;
     if (res[i][x] > 0) {
       res[i][x] = 0;
       res[x][i] = 0;
     } else {
       res[i][x] = 1;
       res[x][i] = 1;
     }
   }
 }
 return res;
}
```
Funkcja ​ Generator(n,p) ​ otrzymuje parametry:

* n - ​ liczba wierzchołków grafu
* p - ​ prawdopodobieństwo występowania krawędzi

Następnie generowana jest pusta macierz w rozmiarze ​ n ​ na ​ n ​ i zostaje wypełniona zerami.
```
let res = new Array(n);
 for (var i = 0; i < res.length; i++) {
   res[i] = new Array(n);
 }
for (i = 0; i < n; i++) for (j = 0; j < n; j++) res[i][j] = 0;
```
Kolejnym krokiem jest losowe generowanie grafu w postaci macierzowej.
```
for (i = 1; i < n; i++)
   for (j = 0; j < i; j++)
     if (getRandomInt(0, 100) <= p) {
       res[i][j] = 1;
       res[j][i] = 1;
     }

```
Aby spełnić warunek dotyczący parzystej liczby krawędzi przy każdym wierzchołku, obliczany jest stopień wierzchołka i jeśli to konieczne, dokonywane są zmiany na losowym indeksie.
```
for (i = 0; i < n - 1; i++) {
   //calculate degree
   let deg = 0;
   for (j = 0; j < n; j++) if (res[i][j] > 0) deg++;
   //check if degree is even
   if (deg % 2 != 0) {
     let x = getRandomInt(0, n - i - 2) + i + 1;
     if (res[i][x] > 0) {
       res[i][x] = 0;
       res[x][i] = 0;
     } else {
       res[i][x] = 1;
       res[x][i] = 1;
     }
   }
 }

```
Funkcja zwraca dwuwymiarową tablicę z grafem w postaci macierzy.
```
​return​ ​res​;
```

### Funkcja główna - rysująca
```
function newGraph() {
 let n = parseInt(document.getElementById("count").value);
 let showAlone = document.getElementById("showAlone").checked;
 let p = parseInt(document.getElementById("perc").value);
 let graf = this.Generator(n, p);
 console.log(graf.toString());
 let tab = [];

 let egdesCount = 0;
 var edges = new vis.DataSet([]);
 for (let i = 0; i < graf.length; i++) {
   const row = graf[i];
   for (let j = i; j < row.length; j++) {
     const element = row[j];
     if (element == 1) {
       edges.add({
         from: i,
         to: j
       });
       tab.push(i);
       tab.push(j);
       egdesCount++;
     }
   }
 }
 var nodes = new vis.DataSet();
 for (let i = 0; i < graf.length; i++) {
   const row = graf[i];
   if (!showAlone && tab.includes(i))
     nodes.add({
       id: i,
       label: (i + 1).toString()
       //label: i.toString()
     });
   else if (showAlone) {
     nodes.add({
       id: i,
       label: (i + 1).toString()
       //label: i.toString()
     });
   }
 }

 var container = document.getElementById("mynetwork");
 var data = {
   nodes: nodes,
   edges: edges
 };
 var options = {
.../opcje dla vis.js/... 
}
 };
var network = new vis.Network(container, data, options);
 let output = "";
 output += "Prawdopodobieństwo: " + p + "%<br/>";
 output += "\n\rIlość wierzchołków: " + n + "<br/>";

 output += "\nIlość krawędzi: " + egdesCount + "<br/>";
 graf.forEach(element => {
   output += "<br />" + element.toString();
 });
 document.getElementById("infoText").innerHTML = output;
}


```

Pierwszym etapem jest pobranie parametrów z formularza aplikacji.
```
​let ​n​ = ​parseInt​(​document​.​getElementById​(​"count"​).​value​);
​let​ ​showAlone​ = ​document​.​getElementById​(​"showAlone"​).​checked​;
​let ​p​ = ​parseInt​(​document​.​getElementById​(​"perc"​).​value​);
```

Parametry ​ n i ​ p ​, zostaną przekazane dalej do funkcji ​ Generator, natomiast ​**showAlone** służy do wyświetlania wierzchołków które nie mają żadnych krawędzi, co zdarza sie gdy użytkownik ustawia niskie **p**. Zostaje wygenerowany graf Eulera
```
let​ ​graf​ = ​this​.​Generator​(​n​, ​p​);
```
Następnie, aby móc pózniej wyrysować graf z użyciem Vis.js należy utworzyć obiekt, przechowujący informacje o krawędziach naszego grafu.
```
let egdesCount = 0;
 var edges = new vis.DataSet([]); 
 for (let i = 0; i < graf.length; i++) {
   const row = graf[i];
   for (let j = i; j < row.length; j++) {
     const element = row[j];
     if (element == 1) {
       edges.add({
         from: i,
         to: j
       });
       tab.push(i);
       tab.push(j);
       egdesCount++;
     }
   }
 }

```
Analogicznie postępujemy z wierzchołkami grafu. Tu pojawia się parametr **showAlone**, który odznaczony, wyklucza pojedyncze wierzchołki bez krawędzi.
```
var nodes = new vis.DataSet();
 for (let i = 0; i < graf.length; i++) {
   const row = graf[i];
   if (!showAlone && tab.includes(i))
     nodes.add({
       id: i,
       label: (i + 1).toString()
       //label: i.toString()
     });
   else if (showAlone) {
     nodes.add({
       id: i,
       label: (i + 1).toString()
       //label: i.toString()
     });
   }
 }

```
Pozostaje tylko przekazać obiekty **nodes** i **edges** jako dane dla frameworku **Vis.js**, dostosować opcje wyświetlania w obiekcie **_options_** oraz wyświetlić dodatkowe dane pomocnicze w oknie na stronie HTML.
```
var container = document.getElementById("mynetwork");
 var data = {
   nodes: nodes,
   edges: edges
 };
 var options = {
.../opcje dla vis.js/... 
}
 };
var network = new vis.Network(container, data, options);
 let output = "";
 output += "Prawdopodobieństwo: " + p + "%<br/>";
 output += "\n\rIlość wierzchołków: " + n + "<br/>";

 output += "\nIlość krawędzi: " + egdesCount + "<br/>";
 graf.forEach(element => {
   output += "<br />" + element.toString();
 });
 document.getElementById("infoText").innerHTML = output;


```

## Prezentacja działania

Przykład dla grafu z **n = 11** i **p=100%**:
![](https://i.imgur.com/ZMFY3w4.png)

Po kliknięciu na dowolny wierzchołek, podświetlone zostają wszystkie jego krawędzie:
![](https://i.imgur.com/Q37iNiG.png)

Dodatkowo całość jest interaktywna, możemy przemieszczać wierzchołki które sa pod wpływem symulacji fizycznej, posiadają swoją masę i wielkość którą także możemy modyfikować poprzez interfejs użytkownika.

Graf **n=120 p=2:**
![](https://i.imgur.com/qImNMDy.png)


