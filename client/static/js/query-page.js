import { WebComponent } from "/vendor/bean/base.js";
import "./ui/app-page.js";

class QueryPage extends WebComponent {
  static tagName = "query-page";
  static html = `
    <style>
      app-page {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #310363;
      }
      h1 {
        color: white;
        align-self: center;
      }
      section {
        color: white;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: auto;
        height: 100%;
        align-items: center;
      }

      pre {
        background-color: rgba(0, 0, 0, 0.6);
        width: fit-content;
      }

      form #query-values {
          display: flex;
          flex-direction: column;
      }
    </style>
    <app-page>
      <h1>Query Toggles</h1>
      <section>
        <pre>
            <code>
            </code>
        </pre>
        <form>
            <div id="query-values"></div>
            <button>Submit</button>
        </form>
      </section>
    </app-page>
  `;

  static handles = {
    queryValues: (dom) => dom.querySelector("code"),
    form: (dom) => dom.querySelector("form #query-values"),
  };

  get queryParams() {
    return Object.fromEntries(this.params.searchParams.entries());
  }

  createField(name, value) {
    const field = document.createElement("input");
    field.type = "text";
    field.name = name;
    field.value = value;
    const label = document.createElement("label");
    label.textContent = `${name}:`;
    label.appendChild(field);
    return label;
  }

  onAfterMount() {
    this.queryValues.textContent = JSON.stringify(
      this.queryParams,
      null,
      2
    ).trim();
    this.form.replaceChildren(
      ...Object.entries(this.queryParams).map(([name, value]) =>
        this.createField(name, value)
      )
    );
  }
}

QueryPage.setup();

export default QueryPage;
