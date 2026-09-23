# GATES — IG 视频区: 正确展示 + iPhone/安卓可播 + 易读

- [x] V1: 六条视频全部 H.264 + yuv420p + faststart（iOS/Android 通吃的唯一安全组合）
  CHECK: node seo/check-video.mjs codec
  EXPECT: CODEC PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=f4ca17eef40baed362102aea313e4f2b9208192015e8e26caef2c234f3534f01; output-bytes=41
- [x] V2: 每条视频无黑边帧（封面帧与全片采样均无 letterbox）
  CHECK: node seo/check-video.mjs letterbox
  EXPECT: LETTERBOX PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=a51aa3ad31b6738e74baeb7c47dd2558601c0d0a73b69a8bdc3a01146b8505b1; output-bytes=44
- [x] V3: 每条视频有 webp 封面且封面取自干净帧（非片头水印帧）
  CHECK: node seo/check-video.mjs poster
  EXPECT: POSTER PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=db6fea3bec428c8de859e2ccbe63a360ba7ae8a181cd82d1fca5523104439f61; output-bytes=49
- [x] V4: 视频标签具备四个移动端必需属性 playsInline/muted/loop/preload=none + poster
  CHECK: node seo/check-video.mjs attrs
  EXPECT: ATTRS PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=ea32f2d17e27f5460e5f8046a0d5928e986a7fc09e67d9c6fae074b5453b8a74; output-bytes=55
- [x] V5: 手机端不自动播放三条（省流量+绕开iOS省电模式失效）——存在显式播放按钮
  CHECK: node seo/check-video.mjs mobile
  EXPECT: MOBILE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=32bb8da3fe6d97c75b9b8b9a3e0bd93825f6d68d9625d1a175743d2deb4eb92f; output-bytes=63
- [x] V6: 字幕可读——每条字幕下方有不低于卡片高度 35% 的遮罩渐变,且字幕不超过两行
  CHECK: node seo/check-video.mjs caption
  EXPECT: CAPTION PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=85ff17d97dc1b33dc3939062229a864f0f690a702f5ad6e65125dd3b10e5862f; output-bytes=60
- [x] V7: 播放量低于 1000 的不显示数字（避免公开低数据）
  CHECK: node seo/check-video.mjs plays
  EXPECT: PLAYS PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=a5fe0a4ad3acc3454ed6399acb9c49b916e4e6b97b0c1640eca000d9fda852d2; output-bytes=38
- [x] V8: 两个页面视频区版式不同（About 不与首页逐像素相同）
  CHECK: node seo/check-video.mjs layout
  EXPECT: LAYOUT PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=5f523fe8ae4c51983798ee120feb52166c71ef9e2a0c2f977be851e28c3d5ac9; output-bytes=49
- [x] V9: 区块标题不被吸顶 header 遮挡（scroll-margin 已设）
  CHECK: node seo/check-video.mjs anchor
  EXPECT: ANCHOR PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=37660c5f8cd64c4bf6de576e6fdbafa44adba709b2dc2f3bfdef4d0c6e228354; output-bytes=12
- [x] V10: iPhone 与 Android 双设备模拟下视频均可成功起播（真实 play() 成功）
  CHECK: node seo/check-video.mjs playback
  EXPECT: PLAYBACK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=8e24800abec1e47cb46f9e1cd298efb1ea1b178e4fbafda5d2cd59fe58a547b9; output-bytes=81
- [x] V11: 构建/测试/SEO 全绿
  CHECK: npm test 2>&1 | tail -1
  EXPECT: 8 passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=9134b3f26a9659e9899cad7ad2beaf6847c91d5cb41567441d0fa425d8b68d2c; output-bytes=18
