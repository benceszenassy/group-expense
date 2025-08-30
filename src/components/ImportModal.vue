<script setup lang="ts" generic="T">
import useImportModal from '@/composables/use-import-modal'
import BaseCallout from './BaseCallout.vue'
import { ref, useTemplateRef } from 'vue'
import { useEventsStore } from '@/stores/events'
import { QrcodeStream, type DetectedBarcode } from 'vue-qrcode-reader'

const importModal = useImportModal()
const eventsStore = useEventsStore()

const refFromFile = useTemplateRef('refFromFile')
function fromFile() {
  refFromFile.value?.click()
}
function onFromFileChange(event: Event) {
  const _target = event.target as HTMLInputElement
  if (_target?.files?.length) {
    const file = _target.files[0]
    if (!file.name.endsWith('.json')) {
      // TODO
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = function () {
      // @ts-expect-error, string | ArrayBuffer
      eventsStore.importEvents(fileReader.result ?? '')
      close()
    }
    fileReader.readAsText(file)
  }
}

const isQRCodeInUse = ref(false)
function fromQRCode() {
  isQRCodeInUse.value = true
}
function onQRCodeDetect(results: DetectedBarcode[]) {
  eventsStore.importEvents(results[0].rawValue)
  close()
}

const copiedData = ref('')
function fromClipboard() {
  eventsStore.importEvents(copiedData.value)
  close()
}

function close() {
  if (refFromFile.value) {
    refFromFile.value.files = null
  }
  isQRCodeInUse.value = false
  copiedData.value = ''
  importModal.close()
}
</script>

<template>
  <dialog :open="importModal.isOpen.value">
    <article>
      <header>
        <button aria-label="Close" rel="prev" @click="close"></button>
        <p>
          <strong>Import events</strong>
        </p>
      </header>
      <div v-show="!isQRCodeInUse">
        <BaseCallout type="warn" title="Import will erease all data!" />

        <label for="data">From clipboard</label>
        <fieldset role="group">
          <input type="text" name="data" v-model="copiedData" />
          <button class="outline" :disabled="!copiedData.length" @click="fromClipboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M7 4V2H17V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7ZM7 6H5V20H19V6H17V8H7V6ZM9 4V6H15V4H9Z"
              ></path>
            </svg>
          </button>
        </fieldset>

        <div role="group">
          <input
            ref="refFromFile"
            type="file"
            name="fromFile"
            id="fromFile"
            hidden
            @change="onFromFileChange"
            accept=".json"
          />
          <button class="outline" @click="fromFile">
            From file
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"
              ></path>
            </svg>
          </button>
          <button class="outline" @click="fromQRCode">
            From QRCode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M9.82843 5L7.82843 7H4V19H20V7H16.1716L14.1716 5H9.82843ZM9 3H15L17 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7L9 3ZM12 18C8.96243 18 6.5 15.5376 6.5 12.5C6.5 9.46243 8.96243 7 12 7C15.0376 7 17.5 9.46243 17.5 12.5C17.5 15.5376 15.0376 18 12 18ZM12 16C13.933 16 15.5 14.433 15.5 12.5C15.5 10.567 13.933 9 12 9C10.067 9 8.5 10.567 8.5 12.5C8.5 14.433 10.067 16 12 16Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <QrcodeStream v-if="isQRCodeInUse" @detect="onQRCodeDetect"></QrcodeStream>

      <footer>
        <button class="secondary" @click="close">Cancel</button>
      </footer>
    </article>
  </dialog>
</template>
