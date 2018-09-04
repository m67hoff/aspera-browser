import { Component } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {

  links = [
    {url: 'https://www.asperasoft.com', name: 'Aspera Homepage', detail: 'move the world’s data at maximum speed'},
    {url: 'https://demo.asperasoft.com', name: 'Aspera Demoserver', detail: 'official Site for the Asper Demoserver used in this example'},
    {url: 'https://github.com/m67hoff/aspera-browser', name: 'AsperaBrowser @ GitHub', detail: 'Source and Docu for this Application (for Developers & Admins)'},
    {url: 'https://www.rubydoc.info/gems/asperalm', name: 'Laurents Aspera Command Line Interface', detail: 'aslmcli - command line interface to Aspera Applications and Rest API'}
  ];

  constructor() { }

}
