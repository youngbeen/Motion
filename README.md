# test_motion

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


NOTE: z -- alpha, x -- beta, y -- gamma

events:
notifyOrientationSupport { true | false } -- 设备支持重力感应orientation
notifyRotateUp { degree: 0 } -- 设备往上翻动 { 翻动角度 }
notifyRotateUpSlightly { degree: 0 }  -- 设备稍微往上翻动 { 翻动角度 }
notifyRotateUpMediumly { degree: 0 }  -- 设备中等往上翻动 { 翻动角度 }
notifyRotateUpHeavily { degree: 0 }  -- 设备大幅度往上翻动 { 翻动角度 }
notifyRotateDown { degree: 0 } -- 设备往下翻动 { 翻动角度 }
notifyRotateDownSlightly { degree: 0 }  -- 设备稍微往下翻动 { 翻动角度 }
notifyRotateDownMediumly { degree: 0 }  -- 设备中等往下翻动 { 翻动角度 }
notifyRotateDownHeavily { degree: 0 }  -- 设备大幅度往下翻动 { 翻动角度 }
notifyRotateLeft { degree: 0 } -- 设备往左翻动 { 翻动角度 }
notifyRotateLeftSlightly { degree: 0 }  -- 设备稍微往左翻动 { 翻动角度 }
notifyRotateLeftMediumly { degree: 0 }  -- 设备中等往左翻动 { 翻动角度 }
notifyRotateLeftHeavily { degree: 0 }  -- 设备大幅度往左翻动 { 翻动角度 }
notifyRotateRight { degree: 0 } -- 设备往右翻动 { 翻动角度 }
notifyRotateRightSlightly { degree: 0 }  -- 设备稍微往右翻动 { 翻动角度 }
notifyRotateRightMediumly { degree: 0 }  -- 设备中等往右翻动 { 翻动角度 }
notifyRotateRightHeavily { degree: 0 }  -- 设备大幅度往右翻动 { 翻动角度 }
notifyMotionSupport { true | false } -- 设备支持重力感应motion
notifyShake -- 设备摇动
