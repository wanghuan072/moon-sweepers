# 架构和维护

## 目录约定

- `src/app`：精简路由、框架布局、静态参数、404、Robots、Sitemap。
- `src/page`：按 home、wiki、machines、guides、automation、tools、updates、legal、search 组织页面实现。
- `src/components`：全局外壳、导航、资料卡、文章布局等跨栏目 UI。
- `src/style`：全部手写 CSS；全局文件仅负责变量、Reset、基础标签与容器。
- `src/data`：按真实栏目保存生成后的纯 JSON，不含业务代码。
- `src/types`、`src/lib`、`src/config`、`src/seo`：分别维护类型、数据访问/搜索/计算、网站配置及 SEO 行为。

## 数据更新

`scripts/data/build-content.mjs` 是生成入口，`researched-specs.mjs` 保存这轮人工核查的数值，`guide-setups.mjs` 保存原创操作建议，`enrich-content.mjs` 整合成条目。JSON 为生成物，禁止直接编辑。修改对应编辑数据源后执行：

```bash
npm run data
```

脚本会同时生成轻量搜索索引，Header 不携带完整文章正文。首页、详情、列表、机器对比均消费同一数据集。攻略相关链接使用 slug，机器详情的唯一正式地址为 `/machines/[slug]`。

新增条目要补齐可用正文、来源、状态和核查日期。数值缺失用 null，不用零。现有长篇攻略属于原创规划/测量建议，官方机制引用与编辑建议在页面中说明；未完成的选题不生成占位详情。

## 交互与导航

独立 URL 之间使用普通 `<a>`，没有 Next Link、router.push 或视图替换。锚点、菜单、主题、筛选和计算留在当前文档。主题只作用于当前页面，不持久存储。搜索建议在本地运行，提交后的 `/search?q=` 使用服务端渲染，真实静态内容仍可抓取。

利润公式位于 `src/lib/tools/calculators.ts`，不依赖 React。支持并行机器数、周期、产量、单价、实际消耗成本、初始投资和开工率。模型不模拟共享传送带瓶颈。升级回本使用增量收入。所有计算器结果都是自定义情景。

## 发布检查

1. 设置实际 `NEXT_PUBLIC_SITE_URL`，确认没有 `.example` 域名。
2. 运行 Lint、类型检查、测试、构建、静态审计。
3. 用户启动项目后，在 1400、1024、768、390px 检查视觉、溢出、菜单、主题、搜索、筛选和计算器。
4. 浏览器 Network 验证跨页产生 Document 请求，后退恢复正确 URL，未知 slug 返回 HTTP 404。
5. 验证生产 `/sitemap.xml`、`/robots.txt`、Canonical 和社交图片。根据实际平台补齐隐私政策及站长联系方式。

本轮未启动或重启任何常驻服务。后续发现用户已有服务运行于3002端口，已复用该服务验收计算器预设、筛选排序、搜索、移动导航、部分响应式布局与真实Document请求。`npm run audit` 只针对构建产物检查 H1、独立元数据、链接、图片、JSON-LD、CSS 引用及 404 配置。

生产工具现提供2个社区配方和34个单级价格预设；原料的替代出售价值属于机会成本，不是游戏内收费。相关边界已纳入跨模块测试。官方图片目录由 `collect-official-media.py` 读取Steam元数据生成，不下载图片文件。
