# Vue 3 Image Editor

Modern lightweight Vue 3 image editor component

<p>
  <a href="https://www.npmjs.com/package/vue3-image-editor"><img src="https://img.shields.io/npm/v/vue3-image-editor.svg" alt="npm"/></a>
</p>

## Demo
https://alireza013013.github.io/example-vue-image-editor/

## Features

-  Component user interface customization
-  Photo cropping
-  Painting On Image
-  No reduction in image quality
-  Image compression to reduce size without losing quality
-  Select desired width and height

## Getting started

### Installation

The first step is to install using `npm`:

```bash
npm i vue3-image-editor
```

### Basic Using

#### Global Using
you should import ViewPlugin And css file in the `main.ts` and use ViewPlugin.

```ts
import ViewerPlugin from "vue3-image-editor"
import "vue3-image-editor/styles.css"

app.use(ViewerPlugin)
```

#### Local Using
You must import the component and css file in the desired file as follows.

```ts
import { ImageEditor } from "vue3-image-editor"
import "vue3-image-editor/styles.css"
```

### Basic Example
Simple usage is given in the following example.

```vue
<template>
    <ImageEditor @finish-editing="finishEditImage" :max-height="400"   :max-width="400" ref="imageEditor" background-crop-div-color="white"
    border-crop-div-color="#4286f4" :color-brush="colorBrush" v-model:file-image="selectedFileImageForEdit" />

        <div class="options-div" v-if="!activeBrushing && !activeCroping">
            <button class="option" @click="callEnablePainting">
               Painting
            </button>
            <button class="option" @click="callEnableCroping">
               Crop
            </button>
            <button class="option" @click="callDownLoadImage">
               Download
            </button>
            <button class="option" @click="callFinishEditing">
               Finish
            </button>
        </div>
        <div class="options-paiting" v-if="activeBrushing">
            <input type="color" v-model="colorBrush">
        </div>
        <div class="submit-button-div" v-if="activeBrushing || activeCroping">
            <button @click="callCancelChanges">Cancel</button>
            <button @click="callSaveChanges">Save</button>
        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ImageEditor } from "vue3-image-editor"
import "vue3-image-editor/styles.css"

const colorBrush = ref<string>("")
const selectedFileImageForEdit = ref<File>()
const imageEditor = ref<any>(null)
const activeBrushing = ref<boolean>(false)
const activeCroping = ref<boolean>(false)

function callEnableCroping() {
    imageEditor.value.enableCroping()
    activeCroping.value = true
}

function callEnablePainting() {
    imageEditor.value.enablePainting()
    activeBrushing.value = true
}

function callFinishEditing() {
    imageEditor.value.finishEditing()
}

function finishEditImage(newFile: File) {
    console.log("Final File After Change",newFile)
}

function callDownLoadImage() {
    imageEditor.value.download()
}

function callSaveChanges() {
    imageEditor.value.saveChanges()
    activeBrushing.value = false
    activeCroping.value = false
}

function callCancelChanges() {
    imageEditor.value.cancelChanges()
    activeBrushing.value = false
    activeCroping.value = false
}

</script>
```
To access component functions, a variable must be defined and connected to the component through ref. In the above example, `imageEditor` variable is used, whose initial value is null. You have to put your photo file in a `selectedFileImageForEdit` variable so that the photo will be displayed for you.
To change the blob to a file, you can do the following.

```ts
const finalFile: File = new File([blob], "nameFile", { type: "image/png" })
```
 

### Crop Feature
To use the photo cropping function, you must call `enableCroping`. For this purpose, you can define a button as in the example above and call `enableCroping` on the @click function button.
After calling `enableCroping`, the photo cropping square will appear. Now, to save the changes, you can call the `saveChanges` and to cancel the changes, you can call the `cancelChanges`.
You can change the square appearance of the photo by using `background-crop-div-color` and `border-crop-div-color`.

#### Notice
When the function of cutting and drawing is not yet activated, it is better not to show the buttons related to `saveChanges` and `cancelChanges` functions to the user so that the user cannot call them, because there is no need for this.
When one of the functions is active, it is better not to show the other.

### Paiting Feature
To use the feature of drawing on the image, you must call `enablePainting`. For this purpose, you can define a button as in the example above and call `enablePainting` on the @click function button.
Now, to save the changes, you can call the `saveChanges` and to cancel the changes, you can call the `cancelChanges`.
The default color of the pen is black. To change it, you can change `color-brush` variable. You can also put a input color like the example above so that the user can choose the color himself.

### Width And Height
You can specify the maximum width and maximum height of the photo. In the absence of these values, the photo will be loaded in its actual size. The recommended amount for these two is between 400 and 500.

### Finish Editing
After finishing the changes on the image, to access the final file, you must call `finishEditing`. Then you have to rewrite the `finishEditImage` function because this function returns the final file to us. These things can be seen in the above example.
