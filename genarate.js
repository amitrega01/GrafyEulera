let graf = null;
let edges = null;
let nodes = null;
let egdesCount = 0;
function newGraph() {
  var n = parseInt(document.getElementById("count").value);
  let showAlone = document.getElementById("showAlone").checked;
  var p = parseInt(document.getElementById("perc").value);
  graf = Generator(n, p);
  let tab = [];
  // create an array with edges
  egdesCount = 0;
  edges = new vis.DataSet([]);
  for (let i = 0; i < graf.length; i++) {
    const row = graf[i];
    for (let j = i; j < row.length; j++) {
      const element = row[j];

      if (element == 1) {
        edges.add({
          id: egdesCount,
          from: i,
          to: j
        });
        egdesCount++, tab.push(i);
        tab.push(j);
      }
    }
  }
  nodes = new vis.DataSet();
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
  // create a network
  var container = document.getElementById("mynetwork");

  // provide the data in the vis format
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    autoResize: true,
    layout: {},
    edges: {
      color: {
        highlight: "#ff0000"
      }
    },
    physics: {
      enabled: document.getElementById("physics").checked,
      solver: "repulsion",
      repulsion: { centralGravity: 0.2, damping: 0.2 }
    },
    nodes: {
      shape: "ellipse",
      widthConstraint: {
        minimum: parseInt(document.getElementById("size").value)
      },
      heightConstraint: {
        minimum: parseInt(document.getElementById("size").value)
      },
      size: 20,
      mass: parseFloat(document.getElementById("mass").value),
      margin: 15,
      color: {
        border: "#46565e",
        background: "#23262e",
        highlight: {
          background: "#ff0000",
          border: "#ff0000"
        },
        highlight: {
          background: "#ff0000",
          border: "#ff0000"
        }
      },
      font: {
        size: 20,
        color: "#fff",
        align: "center"
      },
      shadow: {
        enabled: true,
        color: "rgba(0,0,0,0.5)",
        size: 10,
        x: 0,
        y: 5
      }
    }
  };
  // initialize your network!
  var network = new vis.Network(container, data, options);
  let output = "";
  output += "Prawdopodobieństwo: " + p + "%<br/>";
  output += "\n\rIlość wierzchołków: " + n + "<br/>";

  output += "\nIlość krawędzi: " + egdesCount + "<br/>";
  graf.forEach(element => {
    let deg = 0;
    element.forEach(i => {
      deg += i;
    });
    output += "<br />" + element.toString() + "\tDEG: " + deg;
  });
  document.getElementById("infoText").innerHTML = output;
  //aktualizowanie krawiedzi
}

function SymulujSciezke() {
  //ukrywanie starych krawedzi
  for (let i = 0; i < egdesCount; i++) {
    edges.remove(i);
  }
  let tempGraf = graf.slice();
  let sciezkaEuler = [];
  let i = tempGraf.length - 1;
  let j = tempGraf.length - 1;
  let dalej = 0;
  let b = true;
  let limit = tempGraf.length * tempGraf.length;
  console.log(tempGraf);

  while (b) {
    if (tempGraf[i][j] == 1 && tempGraf[j][i] == 1) {
      if (sumRow(tempGraf, j) > 1 || dalej + 1 == egdesCount) {
        sciezkaEuler.push({
          id: dalej,
          from: i,
          to: j,
          arrows: "middle"
        });
        tempGraf[i][j] = 0;
        tempGraf[j][i] = 0;
        dalej++;
        console.log("Z: " + (i + 1));
        console.log("Do: " + (j + 1));
        i = j;
        j = tempGraf.length - 1;
        if (dalej == egdesCount) b = false;
      } else j--;
    } else {
      j--;
    }
  }
  let output = "<br/>";
  sciezkaEuler.forEach(element => {
    output +=
      "Z: " +
      (element.from + 1) +
      "&nbsp;&nbsp;&nbsp;&nbsp;DO: " +
      (element.to + 1) +
      "<br/>";
  });

  document.getElementById("infoText").innerHTML =
    document.getElementById("infoText").innerHTML + output;
  let counter = 0;
  var interval = setInterval(() => {
    if (counter <= sciezkaEuler.length - 1)
      edges.update({
        id: sciezkaEuler[counter].id,
        from: sciezkaEuler[counter].from,
        to: sciezkaEuler[counter++].to,
        color: { color: "#ff0000" },
        width: 3
      });
    else clearInterval(interval);
  }, parseInt(document.getElementById("speed").value));
}

function sum(tab) {
  let res = 0;
  for (let i = 0; i < tab.length; i++) {
    for (let j = 0; j < tab.length; j++) {
      res += tab[i][j];
    }
  }
  return res;
}
function sumRow(tab, i) {
  let res = 0;
  for (let j = 0; j < tab.length; j++) {
    res += tab[i][j];
  }
  return res;
}
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
