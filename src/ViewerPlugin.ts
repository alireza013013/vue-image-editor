import type { App } from "vue";
import { ImageEditor } from "./components/imageEditor";

export default {
    install: (app: App) => {
        app.component("ImageEditor", ImageEditor);
    },
};

export { ImageEditor };
