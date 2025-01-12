// Define and export the Random class
export class Random {
  constructor(hash) {
    let result = "0x";
    if (hash === undefined) {
      const chars = "0123456789abcdef";
      for (let i = 64; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      console.log("random hash result: " + result);
    } else {
      result = hash;
    }
    this.seed = parseInt(result.slice(0, 16), 16);
  }

  random_dec() {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
  }

  random_between(a, b) {
    return a + (b - a) * this.random_dec();
  }

  random_int(a, b) {
    return Math.floor(this.random_between(a, b + 1));
  }

  random_choice(x) {
    return x[Math.floor(this.random_between(0, x.length * 0.99))];
  }
}
