<template>
  <div class="imageZoom">
    <el-dialog
      title="查看图片"
      center
      :visible.sync="imgLists.showDialog"
      :close-on-click-modal="false"
      :fullscreen="isFullScreen"
      width="60%"
    >
      <div class="footerBtn btnPosition">
        <i
          v-if="!isFullScreen"
          class="el-icon-full-screen"
          title="全屏"
          @click="clickFullScreen"
        />
        <i
          v-else
          class="el-icon-copy-document"
          title="还原"
          @click="clickFullScreen"
        />
      </div>
      <div class="block">
        <el-carousel
          ref="carousel"
          trigger="click"
          :autoplay="false"
          indicator-position="none"
          :initial-index="imgLists.currentIn"
          class="imgWrapper"
          :height="fullHeight"
          @change="carouselChange"
        >
          <el-carousel-item
            v-for="(item, index) in imgLists.list"
            :key="index"
            class="carouselWrapper"
            name="index"
          >
            <img
              :class="{
                imgItem: !item.wheel,
                imgItemWheelUp: item.wheelUp,
                imgItemWheelDes: item.wheelDes,
                imgItemMove: item.move
              }"
              :style="`${transform}:${item.transfrom}`"
              :src="`${item.fileUrl}`"
              @DOMMouseScroll.prevent="mousewheel(index)"
              @mousewheel.prevent="mousewheel(index)"
              @mousedown.prevent="mousedown(index)"
              @mousemove.prevent="mousemove(index)"
              @mouseup.prevent="mouseup(index)"
              @mouseleave.prevent="mouseup(index)"
            >
          </el-carousel-item>
        </el-carousel>
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <span>{{ currentIndex }}</span>
          <span>/</span>
          <span>{{ imgLists.list.length }}</span>
        </div>
        <div class="footerBtn">
          <i
            class="el-icon-zoom-in"
            title="放大"
            @click="clickInOrOut(false)"
          />
          <i
            class="el-icon-zoom-out"
            title="缩小"
            @click="clickInOrOut(true)"
          />
          <i
            class="el-icon-refresh-left"
            title="旋转"
            @click="rotateLeftOrRight('left')"
          />
          <i
            class="el-icon-refresh-right"
            title="旋转"
            @click="rotateLeftOrRight('right')"
          />
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { prefixStyle } from '@/common/js/dom' // 获取浏览器支持的transform
const DEFAULTHT = '300px' // carousel默认高度
export default {
  name: 'ImageZoom',
  props: {
    imgLists: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      transform: prefixStyle('transform'), // 获取浏览器支持的transform
      currentIndex: 0, // 当前下标加一
      isFullScreen: false, // 是否全屏
      fullHeight: DEFAULTHT, // carousel高度
      imgTranslateTop: 0, // 中间变量，暂存元素点击时的translate
      imgTranslateLeft: 0, // 中间变量，暂存元素点击时的translate
      zoomSize: 0.1, // 缩放大小阶梯
      scaleDt: 1 // 缩放初始值1
    }
  },
  watch: {
    // 当前图片下标变化时，对图片初始化
    'imgLists.currentIn': function(newInd) {
      this.$nextTick(function() {
        this.$refs.carousel.setActiveItem(newInd)
        if (!this.imgLists.list[newInd].hasInit) {
          // 初始化对象
          this.initFun(this.imgLists.list[newInd])
        }
      })
    }
  },
  methods: {
    // 滚轮缩放
    mousewheel(idx, isDec) {
      const listItem = this.imgLists.list[idx]
      listItem.wheel = true
      if (listItem.scale === undefined) {
        this.scaleDt = 1
      } else {
        this.scaleDt = listItem.scale
      }
      if (event.wheelDelta > 0 || event.detail < 0) {
        listItem.wheelUp = true
        listItem.wheelDes = false
        this.scaleDt -= this.zoomSize
      } else {
        if (isDec) {
          listItem.wheelUp = true
          listItem.wheelDes = false
          this.scaleDt -= this.zoomSize
        } else {
          listItem.wheelUp = false
          listItem.wheelDes = true
          this.scaleDt += this.zoomSize
        }
      }
      this.scaleDt.toFixed(1)
      listItem.scale = this.scaleDt
      this.setTransform()
      if (this.imgLists.list[idx].scale < 0.2) {
        this.scaleDt = 0.2
        this.scaleDt.toFixed(1)
        listItem.scale = this.scaleDt
        this.setTransform()
      }
    },
    // 鼠标按下
    mousedown(idx) {
      // 清除滚轮的样式
      const listItem = this.imgLists.list[idx]
      listItem.wheelUp = false
      listItem.wheelDes = false
      this.imgTranslateTop = listItem.translateY
        ? listItem.translateY
        : 0
      this.imgTranslateLeft = listItem.translateX
        ? listItem.translateX
        : 0
      listItem.downPositionTop = event.screenY
      listItem.downPositionLeft = event.screenX
      listItem.move = true
    },
    // 鼠标移动
    mousemove(idx) {
      const listItem = this.imgLists.list[idx]
      if (listItem.move) {
        listItem.translateY =
          event.screenY -
          listItem.downPositionTop +
          this.imgTranslateTop
        listItem.translateX =
          event.screenX -
          listItem.downPositionLeft +
          this.imgTranslateLeft
        this.setTransform()
      }
    },
    // 鼠标抬起
    mouseup(idx) {
      const listItem = this.imgLists.list[idx]
      listItem.move = false
    },
    // 点击放大or点击缩小
    clickInOrOut(bool) {
      const idx = this.$refs.carousel.activeIndex
      this.mousewheel(idx, bool)
    },
    // 左旋转or右旋转
    rotateLeftOrRight(dir) {
      const idx = this.$refs.carousel.activeIndex
      const listItem = this.imgLists.list[idx]
      const direction = dir === 'left' ? -90 : 90
      const Rotate = listItem.rotate
        ? listItem.rotate + direction
        : direction
      listItem.rotate = Rotate
      this.setTransform()
    },
    // 全屏
    clickFullScreen() {
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen) {
        this.fullHeight = `${window.innerHeight - 180}px`
      } else {
        this.fullHeight = DEFAULTHT
      }
    },
    // carouse左右按钮点击事件
    carouselChange(index) {
      if (this.imgLists.list.length > 0) {
        this.currentIndex = index + 1
        // 防止点不同图片出现图片滑动消失的效果
        this.imgLists.currentIn = index
        this.$refs.carousel.setActiveItem(index)
      } else {
        this.currentIndex = 0
      }
    },
    // 设置css3 transfrom
    setTransform() {
      const idx = this.$refs.carousel.activeIndex
      const listItem = this.imgLists.list[idx]
      listItem.transfrom = `translate(${listItem.translateX}px, ${listItem.translateY}px) scale(${listItem.scale}, ${listItem.scale}) rotate(${listItem.rotate}deg)`
    },
    // 初始化对象
    initFun(item) {
      this.$set(item, 'hasInit', true)
      this.$set(item, 'move', false)
      this.$set(item, 'wheel', false)
      this.$set(item, 'wheelDes', false)
      this.$set(item, 'wheelUp', false)
      this.$set(item, 'scale', 1) // 缩放
      this.$set(item, 'rotate', 0) // 旋转
      this.$set(item, 'translateX', 0) // X轴移动距离
      this.$set(item, 'translateY', 0) // Y轴移动距离
      this.$set(item, 'transfrom', null) // css组合样式
    }
  }
}
</script>

<style lang="less" scoped>
.imageZoom {
  .btnPosition {
    position: absolute;
    top: 20px;
    right: 45px;
    i {
      padding: 0 !important;
    }
  }
  .imgWrapper {
    text-align: center;
    .carouselWrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .img {
    transition: all 0.3s linear;
  }
  .imgItem {
    height: auto !important;
    max-width: 100%;
    max-height: 100%;
  }
  .imgItemWheelUp {
    cursor: zoom-out;
    // cursor: all-scroll;
  }
  .imgItemWheelDes {
    cursor: zoom-in;
    // cursor: all-scroll;
  }
  .imgItemMove {
    cursor: all-scroll;
  }
  .footerBtn {
    i {
      padding: 5px;
    }
    i:hover {
      color: #5cb6ff;
      cursor: pointer;
    }
  }
}
</style>
