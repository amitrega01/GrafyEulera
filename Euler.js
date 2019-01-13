export default function Generator(n, p) {
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
