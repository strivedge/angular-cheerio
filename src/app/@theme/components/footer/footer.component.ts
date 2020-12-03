import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      @2020 <b><a href="Javascript:void(0)" target="_blank">Cheerio.com</a></b> All rights resevered.
    </span>
  `,
})
export class FooterComponent {
}
