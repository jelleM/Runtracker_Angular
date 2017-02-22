import {User} from "./user";
export class CoreInfo{
  avgDistance: number;
  avgSpeed: number;
  maxDistance: number;
  maxSpeed: number;
  nrOfCompetitionsWon: number;
  nrOfCompetitionsDone: number;
  ranMarathon: boolean;
  ranTenKm: boolean;
  ranTwentyKm: boolean;
  totalDistance: number;

  constructor(user: User){
    this.avgDistance = user.avgDistance / 1000;
    this.avgSpeed = user.avgSpeed;
    this.maxDistance = user.maxDistance / 1000;
    this.maxSpeed = user.maxSpeed;
    user.competitionsWon != null ? this.nrOfCompetitionsWon = user.competitionsWon.length : this.nrOfCompetitionsWon = 0 ;
    user.competitionsRun != null ? this.nrOfCompetitionsDone = user.competitionsRun.length : this.nrOfCompetitionsDone = 0;
    this.totalDistance = user.totalDistance / 1000;
    this.ranMarathon = user.maxDistance >= 42194.988;
    this.ranTenKm = user.maxDistance >= 10000;
    this.ranTwentyKm = user.maxDistance >= 20000;
  }
}
