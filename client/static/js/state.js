import { ValueStream } from "../../vendor/bean/vstream.js";

const stateManager = new ValueStream({
  todos: null,
});

export default stateManager;
