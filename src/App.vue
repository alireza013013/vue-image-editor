<template>
  <div>
    <input type="file" @change="loadFile">
    <div class="option" @click="enablePainting">
      نقاشی
    </div>
    <div class="option" @click="enableCroping">
      بریدن
    </div>
    <div class="option" @click="finishEditing">
      اتمام
    </div>

    <div class="option" @click="download">
      دانلود
    </div>

    <div class="option" @click="saveChanges">
      ذخیره تغییرات
    </div>

    <div class="option" @click="cancelChanges">
      لغو تغییرات
    </div>
    <div class="options-paiting">
        <input type="color" v-model="colorBrush">
    </div>


    <div class="control">
      <ImageEditor :max-height="400" :max-width="200" ref="imageEditor" background-crop-div-color="white" border-crop-div-color="#4286f4" :color-brush="colorBrush" v-model:file-image="selectedFileImageForEdit" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from "vue"
import ImageEditor from '@/components/imageEditor/ImageEditor.vue';


const selectedFileImageForEdit = ref<File>()
const imageEditor = ref<any>(null)
const colorBrush = ref<string>("")

function loadFile(e: any) {
  selectedFileImageForEdit.value = e.target.files[0]
}

function enablePainting(){
  imageEditor.value.enablePainting()
}

function enableCroping(){
  imageEditor.value.enableCroping()
}
function finishEditing(){
  imageEditor.value.finishEditing()
}
function download(){
  imageEditor.value.download()
}

function saveChanges(){
  imageEditor.value.saveChanges()
}


function cancelChanges(){
  imageEditor.value.cancelChanges()
}



</script>


<style scoped lang="scss">
@import "App.scss";
</style>
