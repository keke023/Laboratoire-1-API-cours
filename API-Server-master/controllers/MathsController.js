const path = require("path");
const fs = require("fs");
module.exports = class MathsController extends require("./Controller") {
  constructor(HttpContext) {
    super(HttpContext);
    this.params = this.HttpContext.path.params;
    this.operatorsSupported = ["+", "-", "/", "*", "%", " ", "!", "p", "np"];
    this.binaryParams = [];
    this.unaryParam = undefined;
  }
  get() {
    // si la queryString n'a aucun param
    if (this.HttpContext.path.queryString == "?") {
      this.help();
    } else {
      // si le params op est utiliser et qu'il est supporter
      if (this.params.op && this.isOperatorSupported(this.params.op)) {
        this.doOperation();
      } else {
        this.error("Parameter 'op' is missing or 'op' is not supported.");
      }
    }
  }

  isOperatorSupported = (e) => this.operatorsSupported.includes(e);

  error(message) {
    this.HttpContext.path.params.error = message;
    this.HttpContext.response.JSON(this.HttpContext.path.params);
    return false;
  }

  getNumberParam(name) {
    if (name in this.params) {
      let n = this.params[name];
      let value = parseFloat(n);
      if (!isNaN(value)) {
        return value;
      }
      return undefined;
    }
  }

  isPositiveInteger(value) {
    if (Number.isInteger(value) && value > 0) {
      return true;
    }
    return false;
  }

  checkParamsCount(nbParams) {
    if (Object.keys(this.params).length > nbParams) {
      return this.error("too many parameters");
    }
    return true;
  }
  getUnaryParams() {
   
    this.unaryParam = this.getNumberParam("n");
    if (this.unaryParam === undefined) {
      return this.error("parameter is not a number or undefined");
    }
    return this.unaryParam;
  }
  getBinaryParams() {
    this.binaryParams[0] = this.getNumberParam("x");
    this.binaryParams[1] = this.getNumberParam("y");

   
    return this.binaryParams;
  }

  addition() {
    
    return this.binaryParams[0] + this.binaryParams[1];
  }
  substraction() {
   
    return this.binaryParams[0] - this.binaryParams[1];
  }
  multiplication() {
    
    return this.binaryParams[0] * this.binaryParams[1];
  }
  modulo()
  {
    return this.binaryParams[0] % this.binaryParams[1];
  }

  division() {
    return this.binaryParams[0] / this.binaryParams[1];
  }

  factorial(n) {
    if (n === 0 || n === 1) {
      return 1;
    }
    return n * this.factorial(n - 1);
  }
  isPrime(value) {
    for (var i = 2; i < value; i++) {
      if (value % i === 0) {
        return false;
      }
    }
    return value > 1;
  }
  findPrime(n) {
    let primeNumer = 0;
    for (let i = 0; i < n; i++) {
      primeNumer++;
      while (!this.isPrime(primeNumer)) {
        primeNumer++;
      }
    }
    return primeNumer;
  }
 
  doOperation() {
    //switch case;
    switch (this.params.op) {
      case " ":
        this.getBinaryParams();
        if (
          this.binaryParams[0] === undefined ||
          this.binaryParams[1] === undefined
        ) {
          return this.error(
            "one or two parameters of this binary operations is not a number"
          );
        }
        else{
          this.params.result = this.addition();
        this.HttpContext.response.JSON(this.HttpContext.path.params);
        }
        
        break;
      case "-":

        this.getBinaryParams();
        if (
          this.binaryParams[0] === undefined ||
          this.binaryParams[1] === undefined
        ) {
          return this.error(
            "one or two parameters of this binary operations is not a number"
          );
        }
        else{
          this.params.result = this.substraction();
        this.HttpContext.response.JSON(this.HttpContext.path.params);
        }
        
        break;
      case "*":
        this.getBinaryParams();
        if (
          this.binaryParams[0] === undefined ||
          this.binaryParams[1] === undefined
        ) {
          return this.error(
            "one or two parameters of this binary operations is not a number"
          );
        }else{
          this.params.result = this.multiplication();
          this.HttpContext.response.JSON(this.HttpContext.path.params);
        }
       
        break;
      case "/":
        this.getBinaryParams();
        if (!this.binaryParams.includes(0)) {
          this.params.result = this.division();
          this.HttpContext.response.JSON(this.HttpContext.path.params);
        } else {
          this.error("cannot divise by 0");
        }
        break;
      case "!":
        this.getUnaryParams();
        if (this.isPositiveInteger(this.unaryParam)) {
          this.params.result = this.factorial(this.unaryParam);
          this.HttpContext.response.JSON(this.HttpContext.path.params);
        } else {
          this.error("number is not a postive integer");
        }

        break;
      case "p":
        this.getUnaryParams();
        if (this.isPositiveInteger(this.unaryParam)) {
          this.params.result = this.isPrime(this.unaryParam);
          this.HttpContext.response.JSON(this.HttpContext.path.params);
        } else {
          this.error("number is not a postive integer");
        }

        break;
      case "np":
        this.getUnaryParams();
        if (this.isPositiveInteger(this.unaryParam)) {
          this.params.result = this.findPrime(this.unaryParam);
          this.HttpContext.response.JSON(this.HttpContext.path.params);
        } else {
          this.error("number is not a postive integer");
        }
        break;
        case "%":
          this.getBinaryParams();
          if (!this.binaryParams.includes(0)) {
            this.params.result = this.modulo();
            this.HttpContext.response.JSON(this.HttpContext.path.params);
          } else {
            this.error("cannot divise by 0");
          }

      default:
    }
  }

  help() {
    // Send help page
    let helpPagePath = path.join(
      process.cwd(),
      "wwwroot/helpPages/mathsServiceHelp.html"
    );
    let content = fs.readFileSync(helpPagePath);
    this.HttpContext.response.content("text/html", content);
  }
};
