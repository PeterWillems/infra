export class TimeIntervalSelection {
  active = {
    start: true,
    end: true,
  };
  start: Date;
  end: Date;

  constructor() {
    this.start = new Date(2010, 0, 1, 2);
    this.end = new Date();
  }
}
