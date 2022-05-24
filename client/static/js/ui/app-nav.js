import { WebComponent, prop } from "/vendor/bean/base.js";

class NavItem extends WebComponent {
  static tagName = "nav-item";
  static defaultAttributes = {
    role: "listitem",
  };
  static html = `
    <style>
        a {
            color: var(--text, white);
            text-decoration: none;
        }
        a:visited {
            color: currentColor;
        }
    </style>
    <a></a>
  `;

  static handles = {
    anchor: (dom) => dom.querySelector("a"),
  };

  get router() {
    return this.closestElement("app-router");
  }

  [prop("text")](_, [text]) {
    this.anchor.textContent = text;
  }

  [prop("to")](_, [link]) {
    this.anchor.href = this.router.type === "browser" ? link : `#${link}`;
  }
}

NavItem.setup();

class AppNav extends WebComponent {
  static tagName = "app-nav";
  static html = `
    <style>
        ul {
            display: flex;
            gap: 10px;
            list-style-type: none;
        }
    </style>
    <ul>
        <slot></slot>
    </ul>
  `;
}

AppNav.setup();
