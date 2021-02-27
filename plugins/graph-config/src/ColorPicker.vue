<template>
  <ADropdown :trigger="['click']" class="editor-color-picker">
    <AInput :value="displayText">
      <template #prefix>
        <div class="editor-color-picker-preview" :style="{ background: color }"></div>
      </template>
    </AInput>
    <template #overlay>
      <div :tabindex="-1" class="editor-color-picker-panel">
        <VColorPicker :color="color" :theme="theme" @change-color="changeColor" />
      </div>
    </template>
  </ADropdown>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ColorPicker as VColorPicker } from 'vue-color-kit';

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const TRANSPARENT = 'transparent';

const rgbaToString = (rgba: Rgba) => {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
};

export default defineComponent({
  name: 'ColorPicker',
  components: {
    VColorPicker,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const { value: color } = toRefs(props);
    const theme = 'light';

    const changeColor = ({ rgba }: { rgba: Rgba }) => {
      emit('update:value', rgbaToString(rgba));
    };

    const displayText = computed(() => {
      if (!color.value || color.value === TRANSPARENT) return '未设置';
      return color.value;
    });

    return { color, theme, changeColor, displayText };
  },
});
</script>

<style lang="less">
@import 'vue-color-kit/dist/vue-color-kit.css';

.editor {
  .editor-color-picker {
    &-panel {
      > .hu-color-picker {
        min-width: 218px;

        > .color-show {
          display: none;
        }
      }
    }

    &-preview {
      width: 18px;
      height: 18px;
      border-radius: 2px;
      border: 1px solid var(--border-color);
    }
  }
}
</style>
