<template>
  <div id="pdf-editor">

  </div>
</template>

<script lang="ts">

import { toRefs, reactive, defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'pdfMerger',
  setup() {
    const state = reactive({

    });

    onMounted(() => {
    }
    );

    return {
      ...toRefs(state)
    };
  }
});
</script>

<style>
#pdf-editor {
  height: 100%;
  border: 1em solid #000;
  border: none;
}
</style>
