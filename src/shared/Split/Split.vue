<template>
  <div class="editor-split">
    <div class="editor-split-sash-container">
      <template v-for="(style, index) in styleList" :key="index">
        <div
          v-if="index"
          class="editor-split-sash"
          :class="{ 'editor-split-sash-highlight': active && moveIndex === index }"
          :style="{ left: `${style.left}px` }"
          @mousedown="start($event, index)"
        />
      </template>
    </div>
    <div ref="container" class="editor-split-container" :class="{ 'editor-split-disabled': active }">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  shallowRef,
  unref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  Ref,
} from 'vue';
import ResizeObserver from 'resize-observer-polyfill';
import { throttle, addEvent, removeEvent, setProperty } from '@/utils';
import { useInject } from '@/use';
import { INJECT_KEY } from './contants';

const useResizeObserver = (handler: ResizeObserverCallback, container: Ref<HTMLElement | undefined>) => {
  const observer = shallowRef(new ResizeObserver(handler));
  onMounted(() => {
    const el = unref(container)!;
    observer.value.observe(el);
  });

  onBeforeUnmount(() => {
    observer.value?.unobserve(container.value!);
  });

  return observer;
};

const useSplit = (callback: (offsetX: number, totalX: number, index: number) => void) => {
  const active = ref(false);
  let moveIndex = ref(0);
  let startOffsetX = 0;
  let offsetX = 0;

  const handleMove = throttle((event: MouseEvent) => {
    const x = event.pageX - offsetX;
    const totalX = event.pageX - startOffsetX;
    // 本次偏移量，累计偏移量，当前移动的轴的索引
    callback(x, totalX, moveIndex.value);
    offsetX = event.pageX;
  }, 60);

  const handleUp = () => {
    active.value = false;
    removeEvent(document, 'mousemove', handleMove);
    removeEvent(document, 'mouseup', handleUp);
  };

  const start = (event: MouseEvent, index: number) => {
    active.value = true;
    startOffsetX = event.pageX;
    offsetX = event.pageX;
    moveIndex.value = index;
    addEvent(document, 'mousemove', handleMove);
    addEvent(document, 'mouseup', handleUp);
  };

  return { start, active, moveIndex };
};

export default defineComponent({
  name: 'Split',
  props: {
    // 阈值
    threshold: {
      type: Number,
      default: 160,
    },
  },
  setup(props) {
    const container = shallowRef<HTMLElement>();
    const panelList = computed<HTMLElement[]>(() => [...(unref(container)?.children as any)]);
    const styleList = ref<{ left: number; width: number }[]>([]);
    const childrenMeta = reactive<Map<HTMLElement, { flexible: boolean; left: number; width: number }>>(new Map());
    useInject(INJECT_KEY, childrenMeta);

    const weights = computed(() => [...childrenMeta.values()].filter(v => v.flexible).length);

    // 计算自动伸缩元素所需的补偿距离
    const calculateMakeup = (entries: ResizeObserverEntry[], rectList: any[]): number => {
      if (!weights.value) return 0;
      const totalWidth = entries[0].contentRect.width;
      const childWidth = rectList.reduce((prev, current) => prev + current.width, 0);
      return (totalWidth - childWidth) / weights.value;
    };

    const getResizeRect = (makeup: number, rectList: DOMRect[]) => {
      return rectList.reduce<{ left: number; width: number }[]>((total, rect, index) => {
        const flexible = childrenMeta.get(unref(panelList)[index])?.flexible;
        const prev = total[index - 1];
        const left = prev ? prev.left + prev.width : rect.left;
        const width = flexible ? rect.width + makeup : rect.width;
        total.push({ left, width });
        return total;
      }, []);
    };

    const handler: ResizeObserverCallback = entries => {
      const rectList = unref(panelList).map(child => child.getBoundingClientRect());
      const makeup = calculateMakeup(entries, rectList);
      styleList.value = getResizeRect(makeup, rectList);
    };

    watch(
      styleList,
      list => {
        unref(panelList).forEach((child, i) => {
          const style = list[i];
          setProperty(child, 'left', `${style.left}px`);
          setProperty(child, 'width', `${style.width}px`);
        });
      },
      { deep: true, flush: 'post' }
    );

    useResizeObserver(throttle(handler, 200), container);

    const { start, active, moveIndex } = useSplit((offsetX, totalX, index) => {
      const threshold = props.threshold;
      const list = unref(styleList);
      const prevStyle = list[index - 1];
      const nextStyle = list[index];
      let x = offsetX;
      // 如果向右移动且右侧面板宽度低于阈值， 或者向右移动且右侧面板宽度低于阈值
      if ((x > 0 && prevStyle.width < threshold) || (x < 0 && nextStyle.width < threshold)) {
        // 如果累计位移低于阈值, 则不移动; 相反，移动已累计的距离
        if (Math.abs(totalX) < threshold) return;
        else x = totalX;
      }
      // 向左移动，左侧已经低于阈值, 则隐藏左侧面板
      if (x < 0 && prevStyle.width < threshold) {
        const boundary = index === 1 ? 4 : 8;
        x = -(prevStyle.width - boundary);
      }
      // 向右移动，右侧已经低于阈值，则隐藏右侧面板
      if (x > 0 && nextStyle.width < threshold) {
        const boundary = index === list.length - 1 ? 4 : 8;
        x = nextStyle.width - boundary;
      }

      prevStyle.width += x;
      nextStyle.width -= x;
      nextStyle.left += x;
    });

    return { container, styleList, start, active, moveIndex };
  },
});
</script>

<style lang="less">
.editor-split {
  position: absolute;

  &-container {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
  }

  &-sash-container {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: col-resize;
    overflow: hidden;
  }

  &-sash {
    position: absolute;
    height: 100%;
    width: var(--sash-size);
    transform: translateX(calc(0px - var(--sash-size) / 2));
    z-index: 100;
    touch-action: none;
    cursor: col-resize;

    &-highlight,
    &:hover {
      background: var(--border-color);
    }
  }

  &-disabled {
    pointer-events: none;
  }
}
</style>
