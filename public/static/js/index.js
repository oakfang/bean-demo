import { createRouter } from "/vendor/bean/router.js";

const router = createRouter(({ pathname }) => {
  switch (pathname) {
    case "/": {
      return import("./home-page.js");
    }
    case "/queries": {
      return import("./query-page.js");
    }
    default: {
      return import("./404.js");
    }
  }
});

document.body.appendChild(router);
