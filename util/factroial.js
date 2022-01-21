import Decimal from "../lib/decimal.min.js";

const twoPi = Decimal(2).mul(Math.PI);
const reverseE = Decimal(1).div(Math.E);

function gamma(z) {
  z = Decimal(z);
  return Decimal.sqrt(twoPi.div(z)).mul(Decimal.pow(reverseE.mul(z.add(Decimal(1).div(z.mul(12).sub(Decimal(1).div(z.mul(10)))))), z));
}


function factroial(z) {
  z = Decimal(z);
  return gamma(z.add(1));
}

export default factroial;
