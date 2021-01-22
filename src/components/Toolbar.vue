<template>
  <section class="editor-toolbar-wrapper">Toolbar</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Toolbar',
});
</script>

<style lang="less">
.editor-toolbar {
  &-wrapper {
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
