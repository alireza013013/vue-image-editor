import type { App } from "vue";
import { ImageEditor } from "./components/imageEditor";
import type {ImageEditorProps} from "./components/imageEditor/imageEditor"


export default {
    install: (app: App,option? : ImageEditorProps) => {
        app.component("ImageEditor", ImageEditor);
        app.provide("ImageEditor",option)
    },
};

export {ImageEditor};
