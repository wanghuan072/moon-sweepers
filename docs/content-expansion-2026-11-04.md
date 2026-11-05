# 2026-11-04 内容补全记录

这轮针对 Wiki、Machines、Automation、Updates 的数据深度和页面呈现修改，保持原有 Next.js 项目结构与独立 URL。

## 页面覆盖

| 栏目 | 内容 |
| --- | --- |
| Wiki | 65 个条目；6 个分类总表；工具宽度、深度、触达、动作时长；18 个矩阵节点与逐级费用；6 种工具容器；5 种宇航服装备；7 类车辆升级的逐车逐级价格 |
| 世界机制 | 控制键、60分钟昼夜、区域完成与奖励、四座站点、建筑菜单和结构分类、探索奖励、全部26处遗址的日期与坐标 |
| Machines | 14台机器与机器人；总览规格表；价格、存储、功耗/发电、配方、周期、占地、端口等有来源的参数；单独链接5种车库车辆 |
| Automation | 6种方案：手动Packager入站、机器人接收网、1室2压机石材线、车库卸货线、专用制砂线、2室5压机线；独立链接的工艺图、预算和物料平衡 |
| Updates | 官方新闻API返回的5篇公告：1.0.3、开发者说明信、1.0.4、1.0.5、1.1预告；明确发布补丁、说明信与未来计划 |

## 来源与图片

- [Wikily设备与数值目录](https://wikily.gg/moon-sweepers/)：工具、升级矩阵、车辆升级、世界机制。逐条来源保留在 JSON，分类汇总表也提供来源链接。
- [MoonSweepersWiki机器表](https://www.moonsweeperswiki.com/machines/)：辅助核对设备目录。
- [MoonSweepersWiki自动化](https://www.moonsweeperswiki.com/automation/)：布局参考；本项目自行计算物料量和电力需求，区分理想上限与实际表现。
- [Steam官方公告](https://store.steampowered.com/news/app/5335510)：公告元数据快照在 `scripts/data/announcement-sources.json`，无需联网即可重建内容。

设备配图包含19张不同的独立设备图，来源为Wikily机器、机器人和车辆目录，各自对应一个具体条目；不再使用整张菜单截图。映射清单 `src/data/machines/equipment-visuals.json` 保留来源页、原始CDN图片、尺寸、校验和及本地使用范围。WebP保存在忽略目录 `.local-media/`；production无法访问，构建产物排除这些图片。

恢复设备参考图：

```powershell
python scripts/data/import-reference-equipment.py
node scripts/data/optimize-reference-equipment.mjs
```

官方15张Steam截图的独立恢复流程见 README。公开使用图片的版权确认仍未完成。

## 计算与边界

- 石材基础价值采用 $7/kg，即每个2kg块 $14；避免与其他未经核对的价格混用。
- 一室两压机：45kg/min原尘输入，40kg/min石材，5kg/min余砂，46kW需求。
- 两室五压机：100kg/min原尘输入，100kg/min石材，110kW需求。1kg胶囊单带理想88kg/min，不能保证整线满产。
- 7台Tracker的112kW是峰值，不是夜间供电保证。生产收入是满供料、满功率下的计算值，不是实测赚钱承诺。
- 结构总数来自社区目录，当前只列举结构价格，未声称覆盖全部84件结构的每个尺寸价格。旗帜页收录总数与奖励，尚未复制完整195个坐标。
- 社区参数没有独立游戏内实测；有出处的数值与官方补丁行为分别标明。没有构造不存在的1.0.1/1.0.2公告。

## 维护

修改数据源脚本后运行 `npm run data`，再运行 lint、typecheck、test、build、audit。图片隔离另运行 `node scripts/audit/local-media.mjs`。开发服务器按用户全局规则由用户启动，本轮未自行启动服务。

## 设备配图与样式修正（本轮追加）

之前使用整张设备菜单帧，未采用Wikily实际提供的独立设备图片；现已将19条设备全部替换为19张不同的独立透明背景设备图。`equipment-visuals.json`记录每张原始CDN图片和具体条目页。旧的菜单截图不再用于列表和详情。恢复脚本现在下载清单里的原始WebP，不会重新抓取菜单帧。

车辆页改为五张图文规格卡片，比较表独立列出巡航、加速、宽度、容量、胶囊、座位；详情列出每一级车辆升级价格、效果与计算结果。机器页卡片置前，下方分生产、太阳能、机器人、物流服务四类表。修复EntryFacts表格样式只在正文生效、导致分类页出现无样式紧凑表格的问题。

修正制砂预算中的Tracker单价为$300，整线$950；2室5压机+7Tracker预算为$8,100（不含收集源与传送带）。浏览器已验证本地3001端口上的19张设备图片、机器筛选、车辆与机器详情导航、桌面表格及390px手机布局。
