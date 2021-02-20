<template>
  <section class="editor-toolbar-wrapper">
    <div class="editor-toolbar-content">
      <div class="editor-toolbar-inner">
        <template v-for="[key, item] in toolbarList" :key="key">
          <ToolItem :item="item" @click="executeCommand(key)" />
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import { lazyTask } from '@diagram-editor/shared';
import { useEditor } from '@/use';
import type { ToolbarItem } from '@/toolbar';
import ToolItem from './ToolItem.vue';

type ToolbarList = Map<string, ToolbarItem>;

const useToolbarList = () => {
  const { toolbar } = useEditor();
  const statusbarList = ref<ToolbarList>(new Map([...toolbar]));
  const disposable = toolbar.onDidLoad(
    lazyTask(() => {
      statusbarList.value = new Map([...toolbar]);
    })
  );

  onBeforeUnmount(() => disposable.dispose());

  return statusbarList;
};

export default defineComponent({
  name: 'Toolbar',
  components: { ToolItem },
  setup() {
    const toolbarList = useToolbarList();
    const { toolbar, commands } = useEditor();

    const executeCommand = async (key: string) => {
      const item = toolbar.get(key);
      if (item?.command) await commands.execute(item.command, item);
    };

    return { toolbarList, executeCommand };
  },
});
</script>

<style lang="less">
.editor-toolbar {
  &-wrapper {
    height: 100%;
    overflow: hidden;
    background: var(--widget-color);
    border-bottom: 1px solid var(--border-color);
  }

  &-content {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &-inner {
    display: flex;
    align-items: center;
    margin-right: auto;
    height: 100%;
    padding: 0 var(--padding-sm);
    cursor: default;
  }
}
</style>
