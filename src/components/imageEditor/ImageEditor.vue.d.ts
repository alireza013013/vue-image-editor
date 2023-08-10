declare function enableCroping(): void;
declare function enablePainting(): void;
declare function download(): void;
declare function saveChanges(): Promise<void>;
declare function cancelChanges(): Promise<void>;
declare function finishEditing(): void;
declare const _default: import("vue").DefineComponent<{
    fileImage: {
        type: import("vue").PropType<File>;
    };
    colorBrush: {
        type: import("vue").PropType<string>;
        required: true;
    };
    borderCropDivColor: {
        type: import("vue").PropType<string>;
        required: true;
    };
    backgroundCropDivColor: {
        type: import("vue").PropType<string>;
        required: true;
    };
    maxHeight: {
        type: import("vue").PropType<number>;
    };
    maxWidth: {
        type: import("vue").PropType<number>;
    };
}, {
    enablePainting: typeof enablePainting;
    enableCroping: typeof enableCroping;
    finishEditing: typeof finishEditing;
    download: typeof download;
    saveChanges: typeof saveChanges;
    cancelChanges: typeof cancelChanges;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "finishEditing"[], "finishEditing", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    fileImage: {
        type: import("vue").PropType<File>;
    };
    colorBrush: {
        type: import("vue").PropType<string>;
        required: true;
    };
    borderCropDivColor: {
        type: import("vue").PropType<string>;
        required: true;
    };
    backgroundCropDivColor: {
        type: import("vue").PropType<string>;
        required: true;
    };
    maxHeight: {
        type: import("vue").PropType<number>;
    };
    maxWidth: {
        type: import("vue").PropType<number>;
    };
}>> & {
    onFinishEditing?: ((...args: any[]) => any) | undefined;
}, {}, {}>;
export default _default;
