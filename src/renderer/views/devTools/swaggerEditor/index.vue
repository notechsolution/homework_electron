<template>
  <div id="swagger-editor">

  </div>
</template>

<script lang="ts">

import { toRefs, reactive, defineComponent, onMounted } from 'vue';
import 'swagger-editor-dist/swagger-editor.css'
import SwaggerEditorBundle from 'swagger-editor-dist/swagger-editor-bundle.js'
import SwaggerEditorStandalonePreset from 'swagger-editor-dist/swagger-editor-standalone-preset.js'

export default defineComponent({
  name: 'swaggerEditor',
  setup() {
    const state = reactive({

    });

    onMounted(() => {
      const editor = SwaggerEditorBundle({
        dom_id: '#swagger-editor',
        layout: 'StandaloneLayout',
        presets: [
          SwaggerEditorStandalonePreset
        ],
        queryConfigEnabled: true
      });

      (window as any).editor = editor;
    }
    );

    return {
      ...toRefs(state)
    };
  }
});
</script>

<style>
.Pane2 {
  overflow-y: scroll;
}

#editor-wrapper {
  height: calc(100vh-50px) !important;
  border: 1em solid #000;
  border: none;
}
</style>
