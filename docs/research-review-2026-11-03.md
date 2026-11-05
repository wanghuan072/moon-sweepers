# 2026-11-03 数据补全与冲突记录

这轮采用可追溯的社区数据补全具体参数，保留官方补丁与社区实测/转述之间的区别。没有复制竞品正文或图片，没有声称独立实机验收。

## 覆盖结果

| 集合 | 当前内容 |
|---|---|
| 机器数据库 | 11 个基础机器 + 3 个机器人，共14条 |
| 工具 | 6 种清洁工具 + Building Tool；价格、清扫宽度、基础容量 |
| 容量升级 | 6种工具各3级容量与价格，累计成本由代码计算 |
| 车辆 | 5辆；价格、巡航/加速速度、清扫宽度、料斗、胶囊槽、座位 |
| 升级矩阵 | 23个升级（含6个容器分支条目），另列初始 Collector Uplink |
| 宇航服装备 | 5种，分级费用与效果 |
| 材料 | Dust、Sand、Stone 的基础售价、形态与生产关系 |
| Wiki | 51条，含概览、具体设备/升级及媒体来源页 |
| 攻略 | 12篇，增加 Packager、传送带、两种加工机、供电及机器人接收教程 |
| 自动化 | 3个布局；新增沙石生产线的物料与功率预算 |
| 工具预设 | 2个生产配方、34个单级升级价格 |
| 图片 | 14张原创参数图；15张官方截图的来源目录，未下载转载 |

## 查阅的竞品及采用范围

- https://moonsweepers.org/ ：新手、赚钱及 Packager 操作路径的交叉参考。发现具体句子内的预算/比较不一致时没有照搬结论。
- https://www.moonsweeperswiki.com/ ：Packager、机器清单、赚钱与配方，作为价格与机制的交叉参考。
- https://wikily.gg/moon-sweepers/machines/ ：设备分类及价格；继续读取独立机器、清洁工具、容器、车辆、升级、材料和生产配方页面，提取事实字段。
- https://www.moonsweepers.wiki/ ：核查栏目覆盖；部分内容保留发售前措辞，不用其旧版本判断替代官方补丁。
- https://moonsweepersgame.wiki/ ：核查主题及攻略可信度；Packager 页面存在未购买设备的猜测，不采用其“可能是缓冲仓”的推测。
- https://www.moonsweeperswiki.cc/guides ：核查攻略主题与版本问题覆盖，具体升级数值优先选有表格的来源。

## 重点具体来源

- https://wikily.gg/moon-sweepers/machines/pressure-chamber
- https://wikily.gg/moon-sweepers/machines/stone-press
- https://wikily.gg/moon-sweepers/machines/conveyor-belt
- https://wikily.gg/moon-sweepers/machines/solar-post-s
- https://wikily.gg/moon-sweepers/machines/solar-twin-m
- https://wikily.gg/moon-sweepers/machines/solar-tracker-l
- https://wikily.gg/moon-sweepers/machines/garage
- https://wikily.gg/moon-sweepers/machines/capsule-catcher
- https://wikily.gg/moon-sweepers/cleaning-tools
- https://wikily.gg/moon-sweepers/containers
- https://wikily.gg/moon-sweepers/vehicles
- https://wikily.gg/moon-sweepers/joonas-robots
- https://wikily.gg/moon-sweepers/upgrade-matrix
- https://wikily.gg/moon-sweepers/upgrade-matrix/wide-heads
- https://wikily.gg/moon-sweepers/upgrade-matrix/market-contracts
- https://wikily.gg/moon-sweepers/upgrade-matrix/supplier-network
- https://wikily.gg/moon-sweepers/upgrade-matrix/dust-compactor
- https://wikily.gg/moon-sweepers/upgrade-matrix/auto-packer
- https://wikily.gg/moon-sweepers/upgrade-matrix/lunar-exchange
- https://wikily.gg/moon-sweepers/suit-gear
- https://wikily.gg/moon-sweepers/resources-and-capsules
- https://wikily.gg/moon-sweepers/production-chains
- https://www.moonsweeperswiki.com/machines/packager/
- https://moonsweepersdb.com/reference/packager/

具体页面在条目、参数表及计算器预设旁保留来源链接。来源自称的1.0.5上下文不等于本站实测。所有社区数值标为 community。

## 冲突与处理

| 问题 | 处理 |
|---|---|
| 机器总数11、14、19 | 分开统计11个基础机器、3个机器人、5辆车；机器栏目14条，车辆放Wiki，不复制正式机器详情。 |
| “3倍沙子、7倍石头” | 采用价格倍率口径。5kg尘→5kg沙；1kg尘+1kg沙→2kg石。不得据此制造3倍/7倍质量。 |
| Packager 是否是自动清扫器 | 多个社区来源支持手动卸尘到传送带的转运功能。与 Auto-Packer 和清扫机器人区分。 |
| Packager 是否耗电 | 来源面板未列功率，不填虚构的0kW实测值，显示“来源未列需求”。 |
| Catcher 无输出带时的支付时刻 | 来源在“立即支付”和“随下一次发射”之间不一致；正文明确记录，不作保证。 |
| 拆除返还75% /100% | 当前说明采用官方1.0.5的全额返还；75%只属于旧版本背景。 |
| 16kW Tracker 能否独供18kW Press | 否，额定峰值已不足。发电功率与储能kWh分别展示。 |
| 48kW峰值覆盖46kW负载能否整夜运行 | 无法单凭峰值确认。需充电余量、储能、日照及游戏时间比例；不宣称已验证全天配置。 |
| $75/$140每分钟是否净利润 | 是理想满功率的产出售卖总额。扣除原料可售价值后，加工增值分别$50/$100每分钟。 |
| 完整流水线是否重复扣沙子成本 | 全线只扣原始投入，内部中间品不能再次扣成购买费用。 |

## 计算器与预设

生产配方：Pressure Chamber / Stone Press，可编辑周期、产量、基础售价、数量、开工率及投资。载入时默认扣除原料的替代出售价值，并明确称为“加工增值”。关闭该选项可以研究总销售额口径；它不是游戏税费。基础投资只包括相应机器，供电和物流需要用户按实际成本补入。

升级预设：只载入已读取的单级价格，不猜测没有逐级表的分摊费用。前后收入保持用户测量输入，不把宽度/容量的提升直接当作收入提升。容器折扣未自动套用，可按自己的 Supplier Network 状态修改。

## 图片研究

已调用 Steam appdetails 收集15个官方截图的完整地址、缩略图地址、出处与版权说明：`src/data/wiki/official-media.json`。这是来源元数据，不是转载许可。

查到开发者在 Games Press 发布的新闻稿：
https://www.gamespress.com/uk-UA/Moon-Sweepers-Launches-on-Steam-This-October-Sending-Up-to-16-Players-

其附件需要登录。未注册账号、未绕过登录、未联系外部人员。平台的素材FAQ也不提供无条件转载保证：
https://www.gamespress.com/FAQ---Use-of-Assets

截至本轮，没有获得用户对本地临时使用官方截图的选择，因此默认仅提供来源目录，未下载或在前台重载这些截图。14张参数图为本站自行生成，显示成本/配方/供电等真实参考数据，明确不是设备实物图。概念场景仍标为概念插画。

## 更新方法

`scripts/data/researched-specs.mjs` 保存人工核查后的事实字段；`guide-setups.mjs` 保存原创操作建议；`enrich-content.mjs` 将这些字段整合进原有数据生成过程。运行 `npm run data` 同步 JSON、搜索索引、预设和原创参数图。不要直接手改生成的JSON。

`python scripts/data/collect-official-media.py` 只刷新官方媒体地址元数据，不下载图片文件。增加实图时必须单独记录来源、使用范围和署名。

## 浏览器验收记录

未启动或重启项目服务；复用用户已经运行的 `http://localhost:3002`。

- 桌面1400px：Pressure Chamber 预设载入后显示25kg/min、$75/min总销售额、$50/min加工增值，单机成本500、模型回本10min。
- 机器对比：默认比较 Pressure Chamber 与 Stone Press，能展示500/1000价格、10/18kW和12/6秒。
- 手机390px视口（扣除滚动条后375px内容宽）：机器详情、机器列表及首页 document.scrollWidth 未超过 clientWidth，设备图无损坏。
- 1024px：首页无横向溢出。
- 移动菜单能进入机器库；Power筛选返回3条，按价格排序为75、150、300。
- 升级价格选择 Market Contracts I 自动填120；使用仅供验收的前后收入100/106，得到增量6/min、回本20min；这些输入未写入发布默认数据。
- 搜索 moon sand 能进入新增材料详情，显示3/kg与1.28倍率下3.84/kg。
- CDP记录确认跨页链接触发 `Network.requestWillBeSent` 类型Document。
- 检查期间捕获的控制台错误列表为空。并非所有页面或所有设备均已逐一实机验收。
- 浏览器临时视口已恢复。桌面计算器截图保存在 `.cache/production-preset-desktop.png`（仅验收产物）。
