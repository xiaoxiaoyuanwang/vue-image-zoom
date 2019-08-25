<template>
  <div class="imageZoom">
    <el-dialog
      title="查看图片"
      center
      :visible.sync="imgLists.showDialog"
      :close-on-click-modal="false"
      :before-close="dialogClose"
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
              class="img"
              :class="{
                imgItem: !item.wheel,
                imgItemWheelUp: item.wheelUp,
                imgItemWheelDes: item.wheelDes,
                imgItemMove: item.move
              }"
              :style="
                `
              margin-left:${item.moveLeft}px;
              margin-top:${item.moveTop}px;
              height:${item.height}px;
              transform:rotate(${item.rotate}deg);
              `
              "
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
      currentIndex: 0,
      isFullScreen: false, // 是否全屏
      fullHeight: '300px', // carousel高度
      marginLeft: 0, // 中间变量，暂存元素移动时的margin
      marginTop: 0, // 中间变量，暂存元素移动时的margin
      imgMarginTop: 0, // 中间变量，暂存元素点击时的margin
      imgMarginLeft: 0, // 中间变量，暂存元素点击时的margin
      Height: 0, // 中间变量
      Rotate: 0, // 中间变量
      zoomSize: 50 // 缩放大小尺寸
    }
  },
  watch: {
    'imgLists.currentIn': function(newInd) {
      this.$nextTick(function() {
        this.$refs.carousel.setActiveItem(newInd)
      })
    }
  },
  mounted() {},
  methods: {
    // 滚轮缩放
    mousewheel(idx, isDec) {
      this.$set(this.imgLists.list[idx], 'wheel', true)
      if (this.imgLists.list[idx].height === undefined) {
        const h = document.getElementsByClassName('img')[idx].offsetHeight
        this.Height = h
      }
      if (event.wheelDelta < 0 || event.detail < 0) {
        this.$set(this.imgLists.list[idx], 'wheelUp', true)
        this.$set(this.imgLists.list[idx], 'wheelDes', false)
        this.Height -= this.zoomSize
      } else {
        if (isDec) {
          this.$set(this.imgLists.list[idx], 'wheelUp', true)
          this.$set(this.imgLists.list[idx], 'wheelDes', false)
          this.Height -= this.zoomSize
        } else {
          this.$set(this.imgLists.list[idx], 'wheelUp', false)
          this.$set(this.imgLists.list[idx], 'wheelDes', true)
          this.Height += this.zoomSize
        }
      }
      this.$set(this.imgLists.list[idx], 'height', this.Height)
      if (this.imgLists.list[idx].height < 50) {
        this.Height = 50
        this.$set(this.imgLists.list[idx], 'height', 50)
      }
    },
    // 鼠标按下
    mousedown(idx) {
      // 清除滚轮的样式
      this.$set(this.imgLists.list[idx], 'wheelUp', false)
      this.$set(this.imgLists.list[idx], 'wheelDes', false)
      this.imgMarginTop = this.imgLists.list[idx].moveTop
        ? this.imgLists.list[idx].moveTop
        : 0
      this.imgMarginLeft = this.imgLists.list[idx].moveLeft
        ? this.imgLists.list[idx].moveLeft
        : 0
      this.$set(this.imgLists.list[idx], 'downPositionTop', event.screenY)
      this.$set(this.imgLists.list[idx], 'downPositionLeft', event.screenX)
      this.$set(this.imgLists.list[idx], 'move', true)
    },
    // 鼠标移动
    mousemove(idx) {
      if (this.imgLists.list[idx].move) {
        this.marginTop =
          event.screenY -
          this.imgLists.list[idx].downPositionTop +
          this.imgMarginTop
        this.marginLeft =
          event.screenX -
          this.imgLists.list[idx].downPositionLeft +
          this.imgMarginLeft
        this.$set(this.imgLists.list[idx], 'moveTop', this.marginTop)
        this.$set(this.imgLists.list[idx], 'moveLeft', this.marginLeft)
      }
    },
    // 鼠标抬起
    mouseup(idx) {
      this.$set(this.imgLists.list[idx], 'move', false)
    },
    // 点击放大or点击缩小
    clickInOrOut(bool) {
      const idx = this.$refs.carousel.activeIndex
      this.mousewheel(idx, bool)
    },
    // 左旋转or右旋转
    rotateLeftOrRight(dir) {
      const idx = this.$refs.carousel.activeIndex
      const direction = dir === 'left' ? -90 : 90
      this.Rotate = this.imgLists.list[idx].rotate
        ? this.imgLists.list[idx].rotate + direction
        : direction
      this.$set(this.imgLists.list[idx], 'rotate', this.Rotate)
    },
    // 全屏
    clickFullScreen() {
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen) {
        this.fullHeight = `${window.innerHeight - 180}px`
      } else {
        this.fullHeight = `300px`
      }
    },
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
    // 弹框关闭前回复状态
    dialogClose(done) {
      this.imgLists.list.map(item => {
        this.$set(item, 'move', false)
        this.$set(item, 'wheel', false)
        this.$set(item, 'wheelDes', false)
        this.$set(item, 'wheelUp', false)
        this.$set(item, 'rotate', 0)
        this.$set(item, 'moveLeft', 0)
        this.$set(item, 'moveTop', 0)
      })
      done()
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
  .imgItem {
    transition: transform 0.3s, height 0.3s linear;
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
