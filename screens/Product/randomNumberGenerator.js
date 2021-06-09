export const randomNumberGenerator = (n) => {
  var text = "";
  var charset = "0123456789";
  for (var i = 0; i < n; i++) {
    var temp = Math.floor(Math.random() * charset.length);
    text += i > 0 && temp == i ? "0" : charset.charAt(temp);
  }
  return Number(text);
}

// console.log(`SHOT${randomNumberGenerator(10).toString()}`)