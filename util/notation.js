import Decimal from "../lib/decimal.min.js";

const ten = Decimal(10);

function notation(x=0, p=2) {
  x = Decimal(x);
  const sign = Decimal.sign(x);
  x = x.abs();
  const OOM = Decimal.max(0, x.log(10)).floor();
  const P = ten.pow(p);

  let output = "";
  if (OOM.lt(6)) {
    output = x.toFixed(p);
  } else {
    output = `${x.div(ten.pow(OOM.sub(p))).floor().div(P).toFixed(p)}e${OOM.toString()}`;
  }

  if (sign === -1) sign = "-" + output;

  return output;
}

export default notation;
