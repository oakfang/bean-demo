import { WebComponent } from "/vendor/bean/base.js";
import "./ui/app-page.js";

class PageNotFound extends WebComponent {
  static tagName = "null-page";
  static html = `
    <app-page>
      <h1>Page not found :(</h1>
    </app-page>
  `;
}

PageNotFound.setup();

export default PageNotFound;
