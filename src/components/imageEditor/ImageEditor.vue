<template>
    <div class="main-editor-div" id="MainEditorId">
        <!-- <div class="title-div">
            <h1 class="title-modal">ویرایش تصویر</h1>
        </div> -->
        <div class="blur-div">
            <div class="canvas-resize-div" id="CanvasImageCropRectangleIdDiv">
                <canvas class="canvas-style" @touchmove="cursorMove" @touchend="cursorEndClick"
                    @touchstart="cursorStartClick" @mousedown="cursorStartClick" @mouseup="cursorEndClick"
                    @mousemove="cursorMove" width="400" height="300" id="mainImageCanvasId"></canvas>
                <div v-show="activeCroping" id="CropRectangleIdDiv" class='resizable'>
                    <div class='resizers' :style="{
                        border : `3px solid ${borderCropDivColor}` 
                    }">
                        <div :style="{
                        border : `3px solid ${borderCropDivColor}`,
                        background : backgroundCropDivColor 
                    }" @touchstart="touchStartCornerCropRectangle($event, `top-left`)"
                            @mousedown="mouseDownCornerCropRectangle($event, `top-left`)" class='resizer top-left'></div>
                        <div :style="{
                        border : `3px solid ${borderCropDivColor}`,
                        background : backgroundCropDivColor 
                    }" @touchstart="touchStartCornerCropRectangle($event, `top-right`)"
                            @mousedown="mouseDownCornerCropRectangle($event, `top-right`)" class='resizer top-right'></div>
                        <div :style="{
                        border : `3px solid ${borderCropDivColor}`,
                        background : backgroundCropDivColor 
                    }" @touchstart="touchStartCornerCropRectangle($event, `bottom-left`)"
                            @mousedown="mouseDownCornerCropRectangle($event, `bottom-left`)" class='resizer bottom-left'>
                        </div>
                        <div :style="{
                        border : `3px solid ${borderCropDivColor}`,
                        background : backgroundCropDivColor 
                    }" @touchstart="touchStartCornerCropRectangle($event, `bottom-right`)"
                            @mousedown="mouseDownCornerCropRectangle($event, `bottom-right`)" class='resizer bottom-right'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="show-pre-div">
            <canvas width="200" height="200" id="canvasShowPreviewCropId"></canvas>
        </div>
        <!-- <div class="options-div" v-if="!activeBrushing && !activeCroping">
            <div class="option" @click="enablePainting">
                نقاشی
                <img :class="activeBrushing ? `active` : ``" class="icon-option"
                     src="@/assets/images/icons/paintbrush-solid.svg" alt="Brush">
            </div>
            <div class="option" @click="enableCroping">
                بریدن
                <img :class="activeCroping ? `active` : ``" class="icon-option"
                     src="@/assets/images/icons/expand-solid.svg"
                     alt="Crop">
            </div>
            <div class="option" @click="finishEditing">
                اتمام
                <img class="icon-option" src="@/assets/images/icons/check-solid.svg" alt="Finish">
            </div>

            <div class="option" @click="download">
                دانلود
            </div>

            <div class="option" @click="addFilter">
                فیلتر
            </div>
        </div> -->
        <!-- <div class="options-paiting" v-if="activeBrushing">
            <input type="color" v-model="colorBrush">
        </div> -->
        <!-- <div class="submit-button-div" v-if="activeBrushing || activeCroping">
            <button @click="cancelChanges">لغو</button>
            <button @click="saveChanges">ذخیره</button>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Compressor from 'compressorjs';

interface ImageEditorProps {
    fileImage?: File;
    colorBrush : string,
    borderCropDivColor : string,
    backgroundCropDivColor : string
}

onMounted(async () => {
    await loadImageGetFromProp()
    CropRectangleElement.value = document.getElementById("CropRectangleIdDiv") as HTMLElement
    distanceCanvasFromTopPage.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().top as number
    distanceCanvasFromLeftPage.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().left as number
})

watch(() => props.fileImage, async () => {
    await loadImageGetFromProp()
    CropRectangleElement.value = document.getElementById("CropRectangleIdDiv") as HTMLElement
    distanceCanvasFromTopPage.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().top as number
    distanceCanvasFromLeftPage.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().left as number
})



const props = defineProps<ImageEditorProps>();
const emit = defineEmits(["finishEditing"]);
const mainCanvasImage = ref<HTMLCanvasElement>()
const layoutMainCanvasImage = ref<CanvasRenderingContext2D>()
const isPainting = ref<boolean>(false)
const radius = ref<number>(4)
const activeBrushing = ref<boolean>(false)
const minimumSizeCropRectangle = ref<number>(50);
const widthCropRectangle = ref<number>(0);
const heightCropRectangle = ref<number>(0);
const xPositionMouseClick = ref<number>(0);
const yPositionMouseClick = ref<number>(0);
const distanceCropRectangleFromTopCanvas = ref<number>(0)
const distanceCropRectangleFromLeftCanvas = ref<number>(0)
const distanceCanvasFromTopPage = ref<number>(0)
const distanceCanvasFromLeftPage = ref<number>(0)
const CropRectangleElement = ref<HTMLElement>(document.createElement("div"))
const cornerSelected = ref<string>("")
const activeCroping = ref<boolean>(false)
const scaledWidth = ref<number>(0)
const scaledHeight = ref<number>(0)
const aspectX = ref<number>(0)
const aspectY = ref<number>(0)
const mainImageForEdit = ref<Blob>()
const imageData = ref<any>()

function enableCroping() {
    if (props.fileImage) {
       activeCroping.value = true
    }
}

function mouseDownCornerCropRectangle(event: MouseEvent, position: string) {
    event.preventDefault()
    widthCropRectangle.value = parseFloat(getComputedStyle(CropRectangleElement.value, null).getPropertyValue('width').replace('px', ''));
    heightCropRectangle.value = parseFloat(getComputedStyle(CropRectangleElement.value, null).getPropertyValue('height').replace('px', ''));

    let scrollFromTop = document.getElementById("MainEditorId")?.scrollTop as number;
    console.log("are are", scrollFromTop);
    
    xPositionMouseClick.value = event.pageX;
    yPositionMouseClick.value = event.pageY + scrollFromTop;

    distanceCanvasFromLeftPage.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().left as number
    distanceCanvasFromTopPage.value = (document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().top as number) + window.scrollY

    distanceCropRectangleFromTopCanvas.value = yPositionMouseClick.value - distanceCanvasFromTopPage.value
    distanceCropRectangleFromLeftCanvas.value = xPositionMouseClick.value - distanceCanvasFromLeftPage.value;

    cornerSelected.value = position
    window.addEventListener('mousemove', cursorMoveCornerCropRectangle)
    window.addEventListener('mouseup', mouseUpCornerCropRectangle)
}

function touchStartCornerCropRectangle(event: TouchEvent, position: string) {
    event.preventDefault()
    widthCropRectangle.value = parseFloat(getComputedStyle(CropRectangleElement.value, null).getPropertyValue('width').replace('px', ''));
    heightCropRectangle.value = parseFloat(getComputedStyle(CropRectangleElement.value, null).getPropertyValue('height').replace('px', ''));

    let scrollFromTop = document.getElementById("MainEditorId")?.scrollTop as number;
    xPositionMouseClick.value = event.touches[0].pageX;
    yPositionMouseClick.value = event.touches[0].pageY + scrollFromTop;

    distanceCanvasFromLeftPage.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().left as number
    distanceCanvasFromTopPage.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().top as number

    distanceCropRectangleFromTopCanvas.value = yPositionMouseClick.value - distanceCanvasFromTopPage.value
    distanceCropRectangleFromLeftCanvas.value = xPositionMouseClick.value - distanceCanvasFromLeftPage.value;

    cornerSelected.value = position
    window.addEventListener('touchmove', cursorMoveCornerCropRectangle)
    window.addEventListener('touchend', touchEndCornerCropRectangle)
}

function mouseUpCornerCropRectangle(event: MouseEvent) {
    window.removeEventListener('mousemove', cursorMoveCornerCropRectangle)
}

function touchEndCornerCropRectangle(event: TouchEvent) {
    window.removeEventListener('touchmove', cursorMoveCornerCropRectangle)
}

function handleCursorOutOfImage(width: number, height: number, pageX: number, pageY: number, direction: string) {
    let widthCanvas = mainCanvasImage.value?.getBoundingClientRect().width as number
    let heightCanvas = mainCanvasImage.value?.getBoundingClientRect().height as number

    console.log("width",width);
    console.log("height",height);
    console.log("pageX",pageX);
    console.log("pageY",pageY);
    console.log("widthCanvas",widthCanvas);
    console.log("heightCanvas",heightCanvas);
    console.log("distanceCanvasFromTopPage",distanceCanvasFromTopPage.value);
    

    if (pageX > distanceCanvasFromLeftPage.value + widthCanvas && direction.includes("right")) {
        CropRectangleElement.value.style.width = widthCanvas - CropRectangleElement.value.offsetLeft + 'px'
    }
    if (pageX < distanceCanvasFromLeftPage.value && direction.includes("left")) {
        CropRectangleElement.value.style.left = 0 + 'px'
    }
    if (pageY > distanceCanvasFromTopPage.value + heightCanvas && direction.includes("bottom")) {
        console.log(1);
        // console.log(window.scrollY);
        // console.log("pagey",pageY);
        // console.log("distanceCanvasFromTopPage",distanceCanvasFromTopPage.value);
        // console.log("heightCanvas",heightCanvas);
        
        CropRectangleElement.value.style.height = heightCanvas - CropRectangleElement.value.offsetTop + "px"
    }
    if (pageY < distanceCanvasFromTopPage.value && direction.includes("top")) {
        console.log(2);
        
        CropRectangleElement.value.style.top = 0 + 'px'
    }
    if (pageY + height > distanceCanvasFromTopPage.value + heightCanvas && direction.includes("top")) {
        console.log(3);
        CropRectangleElement.value.style.top = ''
        CropRectangleElement.value.style.bottom = '0px'
    }
}

function calculateWidth(pageX: number, direction: string) {
    if (direction == "right") {
        return widthCropRectangle.value + (pageX - xPositionMouseClick.value)
    } else {
        return widthCropRectangle.value - (pageX - xPositionMouseClick.value)
    }
}

function calculateHeight(pageY: number, direction: string) {
    if (direction == "top") {
        return heightCropRectangle.value - (pageY - yPositionMouseClick.value)
    } else {
        return heightCropRectangle.value + (pageY - yPositionMouseClick.value)
    }
}

function setWidthForRightSide(pageX: number, width: number) {
    let widthCanvas = mainCanvasImage.value?.getBoundingClientRect().width as number
    if (width > minimumSizeCropRectangle.value && pageX < distanceCanvasFromLeftPage.value + widthCanvas) {
        CropRectangleElement.value.style.width = width + 'px'
    }
}

function setWidthAndLeftPossitionForLeftSide(pageX: number, width: number) {
    if (width > minimumSizeCropRectangle.value && pageX > distanceCanvasFromLeftPage.value) {
        CropRectangleElement.value.style.left = distanceCropRectangleFromLeftCanvas.value + (pageX - xPositionMouseClick.value) + 'px'
        CropRectangleElement.value.style.width = width + 'px'
    }
}

function setHeightForBottomSide(pageY: number, height: number) {
    let heightCanvas = mainCanvasImage.value?.getBoundingClientRect().height as number
    if (height > minimumSizeCropRectangle.value && pageY < distanceCanvasFromTopPage.value + heightCanvas) {
        console.log(17);
        
        CropRectangleElement.value.style.height = height + 'px'
        if (parseFloat(getComputedStyle(CropRectangleElement.value, null).getPropertyValue('top').replace('px', '')) == 0) {
            console.log(16);
            console.log("cc",CropRectangleElement.value.getBoundingClientRect().top);
            console.log("dis",distanceCanvasFromTopPage.value);
            
            CropRectangleElement.value.style.top = CropRectangleElement.value.getBoundingClientRect().top - distanceCanvasFromTopPage.value + "px"
        }
        CropRectangleElement.value.style.bottom = ''
    }
}

function setHeightAndTopPossitionForBottomSide(pageY: number, height: number) {
    let heightCanvas = mainCanvasImage.value?.getBoundingClientRect().height as number
    console.log(11);
    
    if (height > minimumSizeCropRectangle.value && pageY > distanceCanvasFromTopPage.value) {
        if (pageY + height > distanceCanvasFromTopPage.value + heightCanvas) {
            console.log(12);
            
            CropRectangleElement.value.style.top = ''
            CropRectangleElement.value.style.bottom = '0px'
        } else {
            console.log(13);
            CropRectangleElement.value.style.top = distanceCropRectangleFromTopCanvas.value + pageY - yPositionMouseClick.value - window.scrollY + 'px'
        }
        CropRectangleElement.value.style.height = height + 'px'
    }
}

async function cursorMoveCornerCropRectangle(event: MouseEvent | TouchEvent) {
    let width: number;
    let height: number;
    let pageX = getPageXFromEvent(event)
    let pageY = getPageYFromEvent(event)

    switch (cornerSelected.value) {
        case "bottom-right":
            width = calculateWidth(pageX, "right");
            height = calculateHeight(pageY, "bottom")
            handleCursorOutOfImage(width, height, pageX, pageY, "bottom-right")
            setWidthForRightSide(pageX, width)
            setHeightForBottomSide(pageY, height)
            break;
        case "bottom-left":
            width = calculateWidth(pageX, "left")
            height = calculateHeight(pageY, "bottom")
            handleCursorOutOfImage(width, height, pageX, pageY, "bottom-left")
            setWidthAndLeftPossitionForLeftSide(pageX, width)
            setHeightForBottomSide(pageY, height)
            break;
        case "top-right":
            width = calculateWidth(pageX, "right")
            height = calculateHeight(pageY, "top")
            handleCursorOutOfImage(width, height, pageX, pageY, "top-right")
            setWidthForRightSide(pageX, width)
            setHeightAndTopPossitionForBottomSide(pageY, height)
            break;
        case "top-left":
            width = calculateWidth(pageX, "left")
            height = calculateHeight(pageY, "top")
            handleCursorOutOfImage(width, height, pageX, pageY, "top-left")
            setWidthAndLeftPossitionForLeftSide(pageX, width)
            setHeightAndTopPossitionForBottomSide(pageY, height)
            break;
    }
    // const x = await showPreviewCropCanvas()
    // console.log("x", x);
}

function getPageYFromEvent(event: any) {
    let pageY = event.pageY ? event.pageY : event.touches[0].pageY
    let scrollFromTop = document.getElementById("MainEditorId")?.scrollTop;
    return pageY + scrollFromTop
}

function getPageXFromEvent(event: any) {
    let pageX = event.pageX ? event.pageX : event.touches[0].pageX
    return pageX
}

async function showPreviewCropCanvas() {
    let canvasPreviewCrop = document.getElementById("canvasShowPreviewCropId") as HTMLCanvasElement
    if (canvasPreviewCrop.getContext && canvasPreviewCrop) {
        let layoutCanvasPreviewCrop = canvasPreviewCrop.getContext('2d') as CanvasRenderingContext2D
        let image = new Image()
        image.src = URL.createObjectURL(mainImageForEdit.value!);
        return new Promise((resolve, reject) => {
            image.onload = () => {
                let left = parseFloat(getComputedStyle(CropRectangleElement.value, null).getPropertyValue('left').replace('px', ''))
                let top = parseFloat(getComputedStyle(CropRectangleElement.value, null).getPropertyValue('top').replace('px', ''))
                let scaledWidth = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().width as number;
                let scaledHeight = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().height as number;
                let aspectX = image.naturalWidth / scaledWidth
                let aspectY = image.naturalHeight / scaledHeight
                canvasPreviewCrop.width = Math.ceil(CropRectangleElement.value.getBoundingClientRect().width * aspectX);
                canvasPreviewCrop.height = Math.ceil(CropRectangleElement.value.getBoundingClientRect().height * aspectY);
                layoutCanvasPreviewCrop.drawImage(
                    image,
                    left * aspectX,
                    top * aspectY,
                    CropRectangleElement.value.getBoundingClientRect().width * aspectX,
                    CropRectangleElement.value.getBoundingClientRect().height * aspectY,
                    0,
                    0,
                    CropRectangleElement.value.getBoundingClientRect().width * aspectX,
                    CropRectangleElement.value.getBoundingClientRect().height * aspectY,
                );
                resolve(image.naturalWidth)
            }
            image.onerror = reject
        })
    }
}

async function compressFile(file: File) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            strict: true,
            convertTypes: "image/png",
            convertSize: 5000000,
            minHeight: 0,
            minWidth: 0,
            quality: 0.6,
            success: resolve,
            error: reject,
        });
    })
}

async function loadImageGetFromProp() {
    if (props.fileImage) {
        const file = props.fileImage
        const compressedBlob: any = await compressFile(file);
        mainImageForEdit.value = compressedBlob
        loadImageInCanvas(compressedBlob)
    }
}

function loadImageInCanvas(blobImage: Blob) {
    mainCanvasImage.value = document.getElementById("mainImageCanvasId") as HTMLCanvasElement
    if (mainCanvasImage.value.getContext && mainCanvasImage.value) {
        layoutMainCanvasImage.value = mainCanvasImage.value.getContext('2d') as CanvasRenderingContext2D
        let image = new Image()
        image.src = URL.createObjectURL(blobImage)
        image.onload = function () {
            let width = image.naturalWidth;
            let height = image.naturalHeight;
            mainCanvasImage.value!.width = width
            mainCanvasImage.value!.height = height
            layoutMainCanvasImage.value?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, width, height)
            imageData.value = layoutMainCanvasImage.value?.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
        }
        CropRectangleElement.value.style.left = 0 + "px"
        CropRectangleElement.value.style.top = 0 + "px"
        CropRectangleElement.value.style.width = minimumSizeCropRectangle.value + "px"
        CropRectangleElement.value.style.height = minimumSizeCropRectangle.value + "px"
    }
}

async function getPositionYCursorFromEvent(event: any) {
    let distanceFromTopCanvas = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().top as number
    let pageY = event.offsetY ? event.offsetY : event.touches[0].clientY - distanceFromTopCanvas
    return pageY
}

async function getPositionXCursorFromEvent(event: any) {
    let distanceFromLeftCanvas = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().left as number
    let pageX = event.offsetX ? event.offsetX : event.touches[0].clientX - distanceFromLeftCanvas
    return pageX
}

async function cursorStartClick(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    if (activeBrushing.value) {
        isPainting.value = true
        scaledWidth.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().width as number;
        scaledHeight.value = document.getElementById("CanvasImageCropRectangleIdDiv")?.getBoundingClientRect().height as number;
        aspectX.value = (mainCanvasImage.value?.width as number) / scaledWidth.value
        aspectY.value = (mainCanvasImage.value?.height as number) / scaledHeight.value
        let pageX = await getPositionXCursorFromEvent(event) * aspectX.value
        let pageY = await getPositionYCursorFromEvent(event) * aspectY.value;
        (layoutMainCanvasImage.value as CanvasRenderingContext2D).lineWidth = radius.value * aspectX.value;
        (layoutMainCanvasImage.value as CanvasRenderingContext2D).lineCap = "round";
        (layoutMainCanvasImage.value as CanvasRenderingContext2D).strokeStyle = props.colorBrush == "" ? `#000000`:props.colorBrush;
        layoutMainCanvasImage.value?.beginPath()
        layoutMainCanvasImage.value?.moveTo(pageX, pageY)
    }
}

function cursorEndClick(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    isPainting.value = false
}

async function cursorMove(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    if (!isPainting.value) {
        return
    }
    let pageX = Math.ceil(await getPositionXCursorFromEvent(event) * aspectX.value)
    let pageY = Math.ceil(await getPositionYCursorFromEvent(event) * aspectY.value)
    layoutMainCanvasImage.value?.lineTo(pageX, pageY)
    layoutMainCanvasImage.value?.stroke()
}

function enablePainting() {
    if (props.fileImage) {
       activeBrushing.value = true
    }
}

function addFilter() {
    // let src = [...imageData.value.data];
    // let dst = [...imageData.value.data];

    // const kernel = [
    //     1 / 16, 2 / 16, 1 / 16,
    //     2 / 16, 4 / 16, 2 / 16,
    //     1 / 16, 2 / 16, 1 / 16
    // ]

    // const srcWidth = imageData.value.width;
    // const srcHeight = imageData.value.height;

    // const side = Math.round(Math.sqrt(kernel.length));
    // const halfSide = Math.floor(side / 2);

    // // padding the output by the convolution kernel
    // const w = srcWidth;
    // const h = srcHeight;

    // console.log("height",h);
    // console.log("width",w);
    // console.log("cy",side);
    // console.log("cx",side);


    // iterating through the output image pixels
    // for (let y = 0; y < h; y++) {
    //     for (let x = 0; x < w; x++) {
    //         let r = 0, g = 0, b = 0, a = 0;

    //         // calculating the weighed sum of the source image pixels that
    //         // fall under the convolution kernel
    //         for (let cy = 0; cy < side; cy++) {
    //             for (let cx = 0; cx < side; cx++) {
    //                 const scy = y + cy - halfSide;
    //                 const scx = x + cx - halfSide;

    //                 if (scy >= 0 && scy < srcHeight && scx >= 0 && scx < srcWidth) {
    //                     let srcOffset = (scy * srcWidth + scx) * 4;
    //                     let wt = kernel[cy * side + cx];
    //                     r += src[srcOffset] * wt;
    //                     g += src[srcOffset + 1] * wt;
    //                     b += src[srcOffset + 2] * wt;
    //                     a += src[srcOffset + 3] * wt;
    //                 }
    //             }
    //         }

    //         const dstOffset = (y * w + x) * 4;
    //         console.log(dstOffset);

    //         dst[dstOffset] = r;
    //         dst[dstOffset + 1] = g;
    //         dst[dstOffset + 2] = b;
    //         dst[dstOffset + 3] = a;
    //     }
    // }
    // layoutMainCanvasImage.value?.putImageData(imageData.value, 0, 0)
    // layoutMainCanvasImage.value?.putImageData(imageData.value, 0, 0)
    // return sourceImageData;


    // for (let i = 0; i < imageData.value.data.length; i += 4) {
    //     const r = imageData.value.data[i];
    //     const g = imageData.value.data[i + 1];
    //     const b = imageData.value.data[i + 2];
    //     const v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 127) ? 255 : 0;
    //     imageData.value.data[i] = imageData.value.data[i + 1] = imageData.value.data[i + 2] = v
    // }
    // layoutMainCanvasImage.value?.putImageData(imageData.value, 0, 0)

}

function download() {
    if (props.fileImage) {
        mainCanvasImage.value?.toBlob(blob => {
            const url = URL.createObjectURL(blob!)
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "test");
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }
}

async function saveChanges() {
    if (activeCroping.value) {
        await showPreviewCropCanvas()
        let canvasPreviewCrop = document.getElementById("canvasShowPreviewCropId") as HTMLCanvasElement
        canvasPreviewCrop.toBlob(blob => {
            mainImageForEdit.value = blob!
            loadImageInCanvas(mainImageForEdit.value)
            activeCroping.value = false
        });
    } else if (activeBrushing.value) {
        mainCanvasImage.value?.toBlob(blob => {
            mainImageForEdit.value = blob!
            loadImageInCanvas(mainImageForEdit.value)
            activeBrushing.value = false
        });
    }
}

async function cancelChanges() {
    activeBrushing.value = false
    activeCroping.value = false
}

function finishEditing() {
    const finalFile: File = new File([mainImageForEdit.value!], props.fileImage?.name.split(".")[0] + ".png", { type: "image/png" })
    emit("finishEditing", finalFile)
}


defineExpose({ enablePainting, enableCroping, finishEditing, download, saveChanges, cancelChanges});

</script>

<style scoped lang="scss">
@import "ImageEditor.scss";
</style>