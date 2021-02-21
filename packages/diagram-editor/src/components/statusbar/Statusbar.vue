<template>
  <section class="editor-statusbar-wrapper">
    <div class="editor-statusbar-content">
      <div class="editor-statusbar-inner">
        <template v-for="[key, item] in statusbarList" :key="key">
          <StatusItem :item="item" @click="executeCommand(key)" />
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import { useEditor } from '../../use';
import { lazyTask } from '@diagram-editor/shared';
import type { StatusbarItem } from '../../statusbar';
import StatusItem from './StatusItem.vue';

type MenubarList = Map<string, StatusbarItem>;

const useStatusbarList = () => {
  const { statusbar } = useEditor();
  const statusbarList = ref<MenubarList>(new Map([...statusbar]));
  const disposable = statusbar.onDidLoad(
    lazyTask(() => {
      statusbarList.value = new Map([...statusbar]);
    })
  );

  onBeforeUnmount(() => disposable.dispose());

  return statusbarList;
};

export default defineComponent({
  name: 'Statusbar',
  components: { StatusItem },
  setup() {
    const statusbarList = useStatusbarList();
    const { statusbar, commands } = useEditor();

    const executeCommand = async (key: string) => {
      const item = statusbar.get(key);
      if (item?.command) await commands.execute(item.command, item);
    };

    return { statusbarList, executeCommand };
  },
});
</script>

<style lang="less">
.editor-statusbar {
  &-wrapper {
    height: 100%;
    overflow: hidden;
    background: var(--widget-color);
    border-top: 1px solid var(--border-color);
  }

  &-content {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &-inner {
    display: flex;
    align-items: center;
    // 向左优先级更高
    flex-direction: row-reverse;
    margin-left: auto;
    height: 100%;
    padding: 0 var(--padding-xs);
    cursor: default;
  }
}
</style>
