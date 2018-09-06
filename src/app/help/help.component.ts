import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor() { }

  links = [
    {url: 'https://www.asperasoft.com', name: 'Aspera Homepage', detail: 'move the world’s data at maximum speed'},
    {url: 'https://demo.asperasoft.com', name: 'Aspera Demoserver', detail: 'official Site for the Asper Demoserver used in this example'},
    {url: 'https://github.com/m67hoff/aspera-browser', name: 'AsperaBrowser @ GitHub', detail: 'Source and Docu for this Application (for Developers & Admins)'},
    {url: 'https://www.rubydoc.info/gems/asperalm', name: 'Laurents Aspera Command Line Interface', detail: 'aslmcli - command line interface to Aspera Applications and Rest API'}
  ];


  ngOnInit() {
  }

}
