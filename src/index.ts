import App from "./app";
import { PORT } from "./env";
new App(Number(PORT)).listen();
