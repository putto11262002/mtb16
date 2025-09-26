import path from "path";
import { fileURLToPath } from "url";
import { ensureExists } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.resolve(__dirname, "../temp");

ensureExists(TEMP_DIR);
export { TEMP_DIR };
