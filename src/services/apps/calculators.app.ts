class CalculatorsApp {

  static randomNumberBetween(min: number, max: number, options = { round: false }): number {
    const result: number = Math.random() * (max - min + 1) + min;

    if (options.round) {
      return Math.round(Math.floor(result))
    }

    return result
  };

  static randomNumberBetweenExcluding(min: number, max: number, exMin: number, exMax: number) {
    let random = this.randomNumberBetween(min, max);

    while (random > exMin && random < exMax) {
      random = Math.random() * (max - min + 1) + min;
    }

    return random;
  };
}

export default CalculatorsApp
