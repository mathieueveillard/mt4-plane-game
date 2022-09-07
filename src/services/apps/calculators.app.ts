class CalculatorsApp {

  static randomNumberBetween(min: number, max: number, options = { round: false }): number {
    const result: number = Math.random() * (max - min + 1) + min;

    if (options.round) {
      return Math.round(Math.floor(result))
    }

    return result
  };
}

export default CalculatorsApp
