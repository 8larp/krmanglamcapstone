// jshint esversion: 6

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body["num2"]);
  let operator;

  switch (req.body.operator) {
    case "+":
      operator = add;
      break;
    case "x":
      operator = multiply;
      break;
    case "-":
      operator = subtract;
      break;
    case "/":
      operator = divide;
      break;
    default:
      return res.status(400).send("Unsupported operator");
  }

  console.log(calculator(num1, num2, operator));
  res.send(`
    <h2>
     That was easy, your result is: ${calculator(num1, num2, operator)}
    </h2>
    <img src="https://image-repo-buraku.s3.eu-west-1.amazonaws.com/EC2.png" alt="EC2-Icon"class="center" width="10%" style="vertical-align:middle;margin:0px 100px">
    <p>
    There's no need for compliments </p>
    <p>I already know i'm the smartest app in the world hahaha ;)</p>
    <p>
    By the way I'm running on a single EC2 Instance
    </p>
    <p><a href="/">BACK TO CALCULATOR...</a></p>
  `);
});

app.listen(port, function () {
  console.log(`server started on port ${port}`);
});

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}
function divide(num1, num2) {
  return num1 / num2;
}
function calculator(num1, num2, operator) {
  return operator(num1, num2);
}

