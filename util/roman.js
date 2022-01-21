const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}

// https://stackoverflow.com/a/32851198/13817471
/**
 * 
 * @param {number} num 
 * @returns 
 */
function roman(num) {
  if (num > 1e5) return num;

  let roman = '',i;
  for ( i in lookup ) {
    while ( num >= lookup[i] ) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export default roman;
