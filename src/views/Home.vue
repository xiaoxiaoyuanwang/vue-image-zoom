<template>
  <div class="home">
    <div v-for="(item, index) in imgArr.list" :key="index" class="img-wrapper">
      <img class="img-item" :src="item.fileUrl" @click="handleClick(index)">
    </div>
    <ImageZoom :img-lists="imgArr" msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import ImageZoom from '@/components/ImageZoom.vue'

export default {
  name: 'Home',
  components: {
    ImageZoom
  },
  data() {
    return {
      imgArr: {
        showDialog: false,
        currentIn: 0,
        list: [
          { fileUrl: require('@/assets/1.jpg') },
          { fileUrl: require('@/assets/2.jpg') },
          { fileUrl: require('@/assets/3.jpg') },
          { fileUrl: require('@/assets/4.jpg') },
          { fileUrl: require('@/assets/5.jpg') },
          { fileUrl: require('@/assets/6.jpg') },
          { fileUrl: require('@/assets/7.jpg') },
          { fileUrl: require('@/assets/8.gif') },
          { fileUrl: require('@/assets/9.gif') },
          { fileUrl: require('@/assets/10.gif') }
        ]
      }
    }
  },
  methods: {
    handleClick(index) {
      this.imgArr.currentIn = index
      this.imgArr.showDialog = true
    }
  }
}
</script>
<style lang="less" scoped>
.img-wrapper {
  display: inline-block;
  padding: 15px;
  .img-item {
    height: 150px;
  }
}
</style>
