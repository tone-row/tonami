const benchmark = (() => {
  const store: Record<string, number[]> = {};
  const active = {};

  function addToStore(name: string, time: number) {
    setTimeout(() => {
      if (name in store) {
        store[name].push(time);
      } else {
        store[name] = [time];
      }
    });
  }

  function time(name: string) {
    let now = performance.now();
    if (name in active) {
      let total = now - active[name];
      addToStore(name, total);
      delete active[name];
    } else {
      active[name] = now;
    }
  }

  class TimeInfo {
    times: number;
    average: number;
    stdDeviation: number;

    constructor(average: number, stdDeviation: number, times: number) {
      this.times = times;
      this.average = average;
      this.stdDeviation = stdDeviation;
    }
  }

  function info() {
    const _info = Object.keys(store).reduce<
      Record<string, { average: number; stdDeviation: number }>
    >((info, key) => {
      const average =
        store[key].reduce<number>((count, time) => {
          return count + time;
        }, 0) / store[key].length;

      const stdDeviation = Math.sqrt(
        store[key].reduce<number>((count, time) => {
          return count + Math.pow(time - average, 2);
        }, 0) / store[key].length
      );

      info[key] = new TimeInfo(average, stdDeviation, store[key].length);

      return info;
    }, {});

    console.table(_info);
  }

  return {
    store,
    active,
    time,
    info,
  };
})();

export { benchmark };
