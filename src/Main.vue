<template>
  <div><router-view keep-alive  transition="slide" ></router-view></div>
</template>

<script>
</script>

<style>
html {
  height: 100%;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color:#333;
}
ul{list-style: none}
header .title{
  overflow: hidden;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  white-space:nowrap;
  position: static;
  margin: 0 auto;
  width: 88%;
}
.fade-transition{
  transition: opacity .5s ease;
}
.fade-enter,.fade-leave{
  opacity: 0;
}
.slide-transition{
  display: inline-block;
}
.page-from-right-to-center,.slide-enter {
  opacity: 0;
  -webkit-animation: pageFromRightToCenter 400ms 100ms forwards;
  animation: pageFromRightToCenter 400ms 100ms forwards;
  z-index: 2002;
}
.page-from-center-to-right {
  -webkit-animation: pageFromCenterToRight 400ms forwards;
  animation: pageFromCenterToRight 400ms forwards;
  z-index: 2002;
}
@-webkit-keyframes pageFromRightToCenter {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    opacity: .9;
  }
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes pageFromRightToCenter {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    opacity: .9;
  }
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@-webkit-keyframes pageFromCenterToRight {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  to {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    opacity: .9;
  }
}
@keyframes pageFromCenterToRight {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  to {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    opacity: .9;
  }
}
.page-from-center-to-left,.slide-leave {
  -webkit-animation: pageFromCenterToLeft 400ms forwards;
  animation: pageFromCenterToLeft 400ms forwards;
  z-index: 2002;
}
.page-from-left-to-center {
  -webkit-animation: pageFromLeftToCenter 9000ms forwards;
  animation: pageFromLeftToCenter 9000ms forwards;
  z-index: 2002;
}
@-webkit-keyframes pageFromCenterToLeft {
  from {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    opacity: 0.5;
    -webkit-transform: translate3d(-20%, 0, 0);
    transform: translate3d(-20%, 0, 0);
  }
}
@keyframes pageFromCenterToLeft {
  from {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    opacity: 0.5;
    -webkit-transform: translate3d(-20%, 0, 0);
    transform: translate3d(-20%, 0, 0);
  }
}
@-webkit-keyframes pageFromLeftToCenter {
  from {
    opacity: .5;
    -webkit-transform: translate3d(-20%, 0, 0);
    transform: translate3d(-20%, 0, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes pageFromLeftToCenter {
  from {
    opacity: .5;
    -webkit-transform: translate3d(-20%, 0, 0);
    transform: translate3d(-20%, 0, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.bar a.icon.icon-cross{
  color: #333;
}
header.bar1{background: #fff;padding-left:30px;}
</style>
