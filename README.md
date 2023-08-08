# Vue 3 Image Editor

Modern lightweight Vue 3 image editor component

<p>
  <a href="https://www.npmjs.com/package/vue3-image-editor"><img src="https://img.shields.io/npm/v/vue3-image-editor.svg" alt="npm"/></a>
</p>

## Features

-  Fully Custom UI For Image Editor
-  Crop Image
-  Painting On Image
-  It does not reduce the quality of the photo
-  Select desired width and length

## Getting started

### Installation

First step is to install it using `npm`:

```bash
npm i vue3-image-editor
```

### Basic Using

you should import ViewPlugin And css file in `main.ts` and use ViewPlugin.

```ts
import ViewerPlugin from "vue3-image-editor"
import "vue3-image-editor/styles.css"

app.use(ViewerPlugin)
```
or you can use component in special file but css file import in `main.ts`.

```vue
import { ImageEditor } from "vue3-image-editor"
```

example below show simple use.

```vue
<template>
    <ImageEditor @finish-editing="finishEditImage" :max-height="400"   :max-width="400" ref="imageEditor" background-crop-div-color="white"
    border-crop-div-color="#4286f4" :color-brush="colorBrush" v-model:file-image="selectedFileImageForEdit" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ImageEditor } from "vue3-image-editor"


const emit = defineEmits(["finishEditing"]);
const colorBrush = ref<string>("")
const selectedFileImageForEdit = ref<File>()
const imageEditor = ref<any>(null)


function enableCroping() {
    imageEditor.value.enableCroping()
}

function enablePainting() {
    imageEditor.value.enablePainting()
}

function finishEditingClick() {
    imageEditor.value.finishEditing()
}

function finishEditImage(newFile: File) {
    emit("finishEditing", newFile)
}

function download() {
    imageEditor.value.download()
}
function saveChanges() {
    imageEditor.value.saveChanges()
}
function cancelChanges() {
    imageEditor.value.cancelChanges()
}

</script>
```

you should declare variable that access to functions imageEditor component, in top example declare imageEditor variable that first amount null that ref to component. 