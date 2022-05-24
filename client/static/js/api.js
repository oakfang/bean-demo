export class ApiClient {
  static dataSources = {
    Remote: Symbol("Remote"),
    Local(dataProvider) {
      return dataProvider;
    },
  };
  static baseUrl = "";
  static wire = false;
  audienceId = null;

  constructor(dataSource = ApiClient.dataSources.Remote) {
    this.dataSource = dataSource;
    if (this.constructor.wire && this.isRemote) {
      this.#setupWebsocket();
    }
  }

  get isRemote() {
    return this.dataSource === ApiClient.dataSources.Remote;
  }

  #setupWebsocket() {
    this.socket = new WebSocket(
      `ws://${location.host}${this.constructor.baseUrl}/wire`
    );
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.#handleMessage(message);
    };
  }

  #handleMessage(message) {
    switch (message.type) {
      case "audience": {
        this.audienceId = message.audienceId;
        return;
      }
      default: {
        this.handleMessage(message);
      }
    }
  }

  get headers() {
    return {
      "Content-Type": "application/json",
      "x-audience-id": this.audienceId,
    };
  }

  stop() {
    this.socket?.close();
  }

  handleMessage(message) {
    console.warn("Unhandled message:", message);
  }

  async #fetch(method, url, { headers = {}, ...options } = {}) {
    if (!this.isRemote) {
      return this.dataSource({ method, url, ...options });
    }
    const response = await fetch(`${this.constructor.baseUrl}${url}`, {
      method,
      headers: {
        ...this.headers,
        ...headers,
      },
      ...options,
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }

  async get(url, options) {
    return this.#fetch("GET", url, options);
  }

  async delete(url, options) {
    return this.#fetch("DELETE", url, options);
  }

  async post(url, body, options = {}) {
    return this.#fetch("POST", url, {
      ...options,
      body: this.isRemote ? JSON.stringify(body) : body,
    });
  }

  async put(url, body, options = {}) {
    return this.#fetch("PUT", url, {
      ...options,
      body: this.isRemote ? JSON.stringify(body) : body,
    });
  }

  async patch(url, body, options = {}) {
    return this.#fetch("PATCH", url, {
      ...options,
      body: JSON.stringify(body),
    });
  }
}
