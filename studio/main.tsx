import { createRoot } from "react-dom/client";
import "../src/index.css";
import "../src/style/fonts";
import "./workbench.css";
import { Workbench } from "./Workbench";

createRoot(document.getElementById("root")!).render(<Workbench />);
