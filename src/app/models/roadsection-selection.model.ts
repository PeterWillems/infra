export class RoadsectionSelection {
  active = {
    road: true,
    direction: true,
    beginKm: true,
    endKm: true,
    drivewaySubtype: true
  };
  road: string;
  direction: boolean;
  beginKm: number;
  endKm: number;
  drivewaySubtype: string;

  constructor() {
    this.road = '001';
    this.direction = false;
    this.beginKm = 0.0;
    this.endKm = 50.0;
    this.drivewaySubtype = 'HR';
  }
}
