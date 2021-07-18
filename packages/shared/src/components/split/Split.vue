<template>
  <div class="editor-split">
    <div :style="{ '--sash-size': `${sashSize}px` }" class="editor-split-sash-container">
      <template v-for="(style, index) in styleList" :key="index">
        <div
          v-if="index"
          class="editor-split-sash"
          :class="{ 'editor-split-sash-highlight': active && axisIndex === index }"
          :style="{ '--left': `${style.left}px` }"
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
  watch,
  onMounted,
  onBeforeUnmount,
  Ref,
  provide,
} from 'vue';
import { throttle, lazyTask, addEvent, removeEvent, setProperty } from '../../utils';
import { INJECT_KEY } from './contants';

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];
const useResizeObserver = (callback: ResizeObserverCallback, container: Ref<HTMLElement | undefined>) => {
  const observer = shallowRef<ResizeObserver | undefined>();
  onMounted(() => {
    observer.value = new ResizeObserver(callback);
    const el = unref(container)!;
    observer.value!.observe(el);
  });

  onBeforeUnmount(() => {
    observer.value?.disconnect();
    observer.value = undefined;
  });

  return observer;
};

type MoveFunc = (event: MouseEvent) => void;

const useSplit = (callback: (offsetX: number, totalX: number) => void) => {
  const active = ref(false);
  const axisIndex = ref(0);
  let startOffsetX = 0;
  let offsetX = 0;

  const handleMove = throttle<MoveFunc>(event => {
    const x = event.pageX - offsetX;
    if (x === 0) return;
    const totalX = event.pageX - startOffsetX;
    // 本次偏移量，累计偏移量，当前移动的轴的索引
    callback(x, totalX);
    offsetX = event.pageX;
  }, 60) as MoveFunc;

  const handleUp = () => {
    active.value = false;
    removeEvent(document, 'mousemove', handleMove);
    removeEvent(document, 'mouseup', handleUp);
  };

  const start = (event: MouseEvent, index: number) => {
    active.value = true;
    startOffsetX = event.pageX;
    offsetX = event.pageX;
    axisIndex.value = index;
    addEvent(document, 'mousemove', handleMove);
    addEvent(document, 'mouseup', handleUp);
  };

  return { start, active, axisIndex };
};
/**
 * 面板自动分割
 * 仅支持水平方向
 */
export default defineComponent({
  name: 'Split',
  props: {
    // 阈值
    threshold: {
      type: Number,
      default: 120,
    },
    sashSize: {
      type: Number,
      default: 6,
    },
  },
  setup(props) {
    const container = shallowRef<HTMLElement>();
    const styleList = ref<{ left: number; width: number }[]>([]);
    const childrenMeta = reactive<Map<HTMLElement, { flexible: boolean; left: number; width: number }>>(new Map());
    provide<typeof childrenMeta>(INJECT_KEY, childrenMeta);

    const getChildren = (): HTMLElement[] => Array.prototype.slice.call(unref(container)?.children, 0);

    // 计算自动伸缩元素所需的补偿距离
    const calculateMakeup = (rectList: DOMRect[]): number => {
      // 权重
      const weights = [...childrenMeta.values()].filter(v => v.flexible).length;
      if (!weights) return 0;
      const rect = unref(container)!.getBoundingClientRect();
      const childWidth = rectList.reduce((prev, current) => prev + current.width, 0);
      return Math.floor((rect.width - childWidth) / weights);
    };
    // 计算出新的布局样式
    const getResizeRect = (rectList: DOMRect[], makeup = 0) => {
      const children = getChildren();
      return rectList.reduce<{ left: number; width: number }[]>((total, rect, index) => {
        const flexible = childrenMeta.get(children[index])?.flexible;
        const prev = total[index - 1];
        const left = prev ? prev.left + prev.width : 0;
        const width = flexible ? rect.width + makeup : rect.width;
        total.push({ left, width });
        return total;
      }, []);
    };

    // 自动更新布局
    const update = () => {
      if (!unref(container)) return;
      const children = getChildren();
      // 获取现有的布局样式
      const rectList = children.map(child => child.getBoundingClientRect());
      // 可分配的剩余空间
      const makeup = calculateMakeup(rectList);
      // 设置新的布局
      styleList.value = getResizeRect(rectList, makeup);
    };

    useResizeObserver(throttle(update, 200), container);
    // 监听面板元素变化，以触发布局的改变
    watch(childrenMeta, lazyTask(update), { flush: 'post' });

    // 手动操纵面板的移动策略
    const moveStrategy = (offsetX: number, totalX: number) => {
      const list = unref(styleList);
      // 当前在移动的轴的索引
      const axis = axisIndex.value;
      const [prev, next] = [list[axis - 1], list[axis]];
      const { threshold, sashSize } = props;

      let x = offsetX;
      // 如果向右移动且右侧面板宽度低于阈值， 或者向右移动且右侧面板宽度低于阈值
      if ((x > 0 && prev.width < threshold) || (x < 0 && next.width < threshold)) {
        // 如果累计位移低于阈值, 则不移动; 相反，移动已累计的距离
        if (Math.abs(totalX) < threshold) return;
        x = totalX;
      }
      // 向左移动，左侧已经低于阈值, 则隐藏左侧面板
      if (x < 0 && prev.width < threshold) {
        const sash = axis === 1 ? sashSize / 2 : sashSize;
        x = -(prev.width - sash);
      }
      // 向右移动，右侧已经低于阈值，则隐藏右侧面板
      if (x > 0 && next.width < threshold) {
        const sash = axis === list.length - 1 ? sashSize / 2 : sashSize;
        x = next.width - sash;
      }

      prev.width += x;
      next.width -= x;
      next.left += x;
    };
    const { start, active, axisIndex } = useSplit(moveStrategy);

    // 监听 styleList 变化，设置面板样式
    watch(
      styleList,
      list => {
        const children = getChildren();
        children.forEach((child, index) => {
          const { left, width } = list[index];
          setProperty(child, 'left', `${left}px`);
          setProperty(child, 'width', `${width}px`);
        });
      },
      { deep: true, flush: 'post' }
    );

    return { container, styleList, start, active, axisIndex };
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
    left: calc(var(--left) - var(--sash-size) / 2);
    width: var(--sash-size);
    z-index: 1050;
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
