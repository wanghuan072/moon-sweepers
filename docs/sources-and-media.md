# 来源与媒体清单

核查日期：2026-11-03。游戏版本只是来源上下文，不代表独立实机验收。

## 事实来源

- 官方商店：https://store.steampowered.com/app/5335510/Moon_Sweepers/
- 官方消息 API：https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=5335510&count=12&maxlength=0&feeds=steam_community_announcements
- 官方新闻列表：https://store.steampowered.com/news/app/5335510
- 社区机器索引：https://wikily.gg/moon-sweepers/machines/

商店用于核对名称、开发商、收集/出售/升级玩法、单人及最多16人联机。官方 API 返回的公告用于核对补丁日期、共享升级、传送带售卖、移动建造、机器修复与机器人接收规则。页面链接采用 API 返回的原始 `url`，未猜测公告地址。

API 核对的发布时刻（UTC）：

| 公告 | 时间 | gid |
|---|---|---|
| 1.0.3 | 2026-10-24 09:03:52 | 1847286114039175 |
| 1.0.4 | 2026-10-25 20:47:26 | 1847286114042960 |
| 1.0.5 | 2026-10-28 07:41:11 | 1847920302229973 |
| 600,000 / 1.1 预告 | 2026-10-30 14:00:43 | 1847920302238715 |

公告页面使用 UTC 公告日期，避免访问者时区改变排序。预告中的 1.1 计划为 2026 年12月，未发布且计划可能变化。

本轮已继续读取社区独立详情与参数表，补入价格、周期、功率、配方、工具/车辆/升级数值，并统一标记为社区来源。没有复制竞品正文或图片，未声称这些数值由本站独立实测。详细冲突和来源见 `research-review-2026-11-03.md`。

## 图片清单

初版概念图源：用户提供的 `1fab6f08-acff-4730-8d9c-3a21dd55c8b9.png`。仅将其中无网站文字的场景区域裁成概念插画，并在前台标注；不能称为官方素材、实机截图或真实设备外观。用户提供参考图并不等于已经取得第三方游戏媒体的转载许可。

生成资源：`home/lunar-hero.webp`、`guides/editorial-1.webp` 至 `editorial-3.webp`、`automation/factory-concept.webp`、`common/social.webp`。

重复生成：`node scripts/data/prepare-artwork.mjs "原始参考图的绝对路径"`。依赖 Sharp。原始文件不在项目公开目录，不直接发布完整设计图。社交图添加了本站标题和概念插画说明。

Lucide 图标：lucide-react，ISC 许可，包内包含许可证；它们是界面/示意图标，不是机器图片。Favicon 为本站自行编写的行星矢量标志，不冒充官方 Logo。

## 仍需站长提供

正式域名、可公开的联系渠道、许可清晰的实际游戏截图/机器图片、与具体版本对应的实测机器数值和解锁条件。接收素材后应记录来源、许可、署名要求、条目对应关系，再替换概念图。没有数据支持的新增深度选题不发布空白页面。

新增14张本站原创参数图位于 `public/images/machines/*-data.svg`，由 `prepare-data-diagrams.mjs` 从同一份机器数据生成。它们是成本、配方、功率等信息图，不是无意义设备占位或假实物图。15张官方截图来源已整理到 `src/data/wiki/official-media.json` 和站内 `/wiki/mechanics/official-media`；2026-11-03尚未下载，2026-11-04按用户许可接入本地开发预览，公开授权仍待确认。

## 2026-11-04 本地开发配图

用户明确选择“允许在本地开发版使用官方截图作游戏介绍配图，上线前再确认版权”。已下载登记的15张Steam官方截图，保存原始JPEG、优化WebP、缩略图以及SHA-256来源记录到`.local-media/`。该目录被Git忽略，位于public之外，并从Next生产文件追踪中排除。

`python scripts/data/download-dev-media.py`下载已登记的官方源，`node scripts/data/optimize-dev-media.mjs`生成1600px WebP及480px缩略图。运行不会启动项目服务。

开发模式通过`/api/local-media/[id]`读取白名单截图，使用private/no-store、noindex/noimageindex响应头。production/test模式返回404。开发环境选择真实截图，production自动保留原有概念图和参数图；正式公开授权确认前不提供生产开启选项。

已目视核对截图内容：0宇航员与扫帚；1清扫工具/基地；2多人宇航员与车辆；3车辆与站点；4牙刷与地面；5/6传送带基地；7手推清扫车；8大型清扫车辆；9宇航员与太阳能设备；10太阳能板；11基地外景；12/13基地内景；14月球。场景图只用于游戏介绍，不冒充未出现的Packager或加工机特写。

页面署名为“Official Steam screenshot · © DragDrop Games”。本站所有者的本地使用许可不等于发行商转载许可；上线前仍需确认公开使用范围。
