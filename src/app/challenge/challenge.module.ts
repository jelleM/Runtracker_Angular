import {NgModule} from "@angular/core";
import {ChallengeRoutingModule} from "./challenge-routing.module";
import {ChallengeComponent} from "./challenge.component";
import {ChallengeService} from "./challenge.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ChallengeItemComponent} from "./challenge-item/challenge-item.component";

@NgModule({
  imports: [CommonModule, FormsModule, ChallengeRoutingModule],
  providers: [ChallengeService],
  declarations: [ChallengeComponent, ChallengeItemComponent],
})

export class ChallengeModule {

}
