# Zen Ramen 官网 · 参考站图片风格与结构借鉴清单

> 来源：Restaurant workspace session 找到的 10 个一线日料站 + `ugc-photo` skill 的实拍感规则。
> 用途：以后每次给官网出图/改版，先过这份清单，不许自由发挥。

## 一、图片风格铁律（10 个官方站共同点 + ugc 规则合并）

1. **一屏只拍一样东西**（KazuNori 手卷 / SUGARFISH 海面）——不摆满桌大拼盘；「多」用密集不用杂乱。
2. **暖钨丝光 + 浅景深 + 轻微颗粒**——拒绝影棚白光和 3D 渲染感（AI 玻璃感的主要来源）。
3. **拍空间也算拍菜**（NAMI NORI / KYURAMEN 首屏拍店内）——环境图和食物图 1:2 混排。
4. **食物写物理名词**：鱼肉肌理/米粒分明/酥壳碎屑/水珠/蒸汽；禁「realistic/high quality」这类形容词。
5. **禁清晰手指**——同伴只允许出现为虚化袖子/前臂/运动模糊的手（ugc 负向清单第一破绽源）。
6. **禁一切可读文字**：logo/包装印刷/菜单字/酒瓶标签（乱码标签=一眼假）。
7. **禁纸巾/残渣/用过的餐巾**——筷子搁陶瓷筷托；「有人在吃饭」的杂物（水杯/钥匙/手机）可以有。
8. **拍不好就不拍**（SUGARFISH 定律）——一张好材质+一句短话，强过一张平庸菜品图。
9. **编造菜品=事故**：写进 prompt 的每样食材/颜色，必须在本店真实菜单里有出处（本店无溏心蛋配粗面之类张冠李戴）。
10. 出图引擎：`gpt-image` skill（2.5-flare），`-q high`，prompt 末尾原样附 ugc-photo 的英文负向段。

## 二、结构借鉴（10 站 → Zen 的落法）

| # | 参考站 | 借什么 | 状态 |
|---|---|---|---|
| 1 | YANAGI (yanagi.nyc) | 红圆章 logo 一个符号说清两个品类 → 猫+面+鱼合成圆章 | 💡 待设计（品牌资产，需毛拍板） |
| 2 | DAIKAYA (daikaya.com) | 「二楼还有座」印进首屏；HOURS & LOCATION 放导航第一项 | 💡 待确认 Zen 是否有楼上座位问题 |
| 3 | TOTTO RAMEN | 首屏标题上压社会证明行 ★★★★★ | ✅ 已上线：4.5★ · 4,300+ Google reviews |
| 4 | NAMI NORI | CATERING 提为主导航项 | ✅ 已有 EVENTS/CATERING 导航项 |
| 5 | KAZUNORI | 顶部细条多品牌切换 | 📦 留给第二家店时用 |
| 6 | SUGARFISH | 首屏极简：一张好图+一句话 | ✅ 已按此改 hero（单碗挑面） |
| 7 | MOMOYA | 名字下并排门店按钮 | 📦 单店暂不需要，开店即加 |
| 8 | KYURAMEN | Rewards/APP 进主导航 | 💡 桌垫活动可升级为 rewards 入口，待毛定 |
| 9 | SILVERLAKE RAMEN | 午市 combo 要推，但不做弹窗 | 💡 建议做首页午市 banner（非弹窗） |
| 10 | KINBOSHI | 礼品卡/周边=官网第二条腿；改域名留跳转 | 📦 远期；域名切换时保留旧站跳转已在计划 |

## 三、本站图片台账（当前版本）

| 文件 | 用在哪 | 来源 |
|---|---|---|
| photo-0/3/9/10/13 | hero/菜单卡/图库 | 旧站真图 |
| photo-4 (+原图) | 首页 catering / events banner | 旧站真图 |
| photo-11 | Dinner 菜单卡 / 图库 FROM THE KITCHEN | 旧站真图（暗调棚拍） |
| zen-catering-a/b | Events 侧图 | gpt-2.5 生成（开席状态） |
| zen-sharing | 图库 FOR SHARING + 首页/About 图库条 | gpt-2.5 生成（ugc 负向清单版） |
| zen-happy-hour | 图库 HAPPY HOUR | gpt-2.5 生成 |
| zen-happy-hour-card | 首页 HH 菜单卡 | 上图裁切（同批质感） |
| zen-at-the-table | 图库 AT THE TABLE | photo-4 暖调压暗版 |

⚠️ 所有生成图仍属「占位素材」——店方实拍一到，同名替换即可，代码零改动。
