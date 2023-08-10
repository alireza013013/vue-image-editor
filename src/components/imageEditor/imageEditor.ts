export interface ImageEditorProps {
    fileImage?: File;
    colorBrush: string,
    borderCropDivColor: string,
    backgroundCropDivColor: string,
    maxHeight? : number
    maxWidth? : number
}