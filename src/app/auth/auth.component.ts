import { Component } from '@angular/core';
import { NbAuthComponent } from '@nebular/auth';
@Component({
  selector: 'ngx-auth',
  styleUrls: ['auth.component.scss'],
  template: `
    <ngx-one-column-layout>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class AuthComponent extends NbAuthComponent {
}
