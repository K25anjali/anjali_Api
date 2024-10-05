const express = require("express");
const data = require("./weather.json");
const app = express();

const port = 5000;

app.use(express.static("dist"));
app.use(express.json());

const user = [];

// 1. User API
app.post("/api/user", (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: user.length + 1, name, email };
  user.push(newUser);
  res.json(newUser);
});

app.get("/api/getuser", (req, res) => {
  res.json(user);
});

//2.pi value calculator
app.get("/api/pi", (req, res) => {
  const digits = parseFloat(req.query.digits);
  const decimalPlaces = parseFloat(req.query.decimalPlaces);

  if (isNaN(digits) || digits < 1 || digits > 1000) {
    return res.status(400).json({
      error: "Please provide a valid number between 1 and 1000.",
    });
  }

  if (
    isNaN(decimalPlaces) ||
    decimalPlaces < 0 ||
    decimalPlaces > 10 ||
    !Number.isInteger(decimalPlaces)
  ) {
    return res.status(400).json({
      error: "Please provide valid integer decimal places between 0 and 10.",
    });
  }

  const piValue = Math.PI * digits;
  const decimalnum = piValue.toFixed(decimalPlaces);

  console.log(decimalPlaces);
  res.json({ pi: decimalnum });
});

//3.protected api with api_key
const checkApiKey = (req, res, next) => {
  const api_key = req.query.api_key || req.headers["your-api-key"];
  if (!api_key || api_key !== "IamAnjali") {
    return res.status(400).json({ errpr: "Forbidden: Invalid API Key" });
  }
  next();
};

app.get("/api/weatherData", checkApiKey, (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
