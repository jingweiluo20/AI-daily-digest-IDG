> ⚠️ 安装时务必使用下方命令(文件夹名必须是 `AI-daily-digest`,否则 Claude Code 会用错误的 skill 名注册)

# AI 行业中文日报

一个 AI 驱动的每日信息聚合工具，整合国内头部公众号和海外 AI builders 的最新动态，生成结构化的中文日报。


## 你会得到什么

一份结构清晰的中文日报，包含：

- 国内头部 AI 公众号的最新文章（大模型厂商官方公众号、晚点LatePost、硅基观察Pro、Founder Park等三方公众号）
- 25+ 位海外 AI builders 在 X/Twitter 上的关键观点和洞察（Swyx、Kevin Weil、Andrej Karpathy 等）
- 顶级 AI 播客新节目的精华摘要
- AI 公司官方博客的完整文章（Anthropic Engineering、Claude Blog）
- 所有原始内容的链接
- 国内在前、海外在后的分区结构，适合快速阅读

## 快速开始（Skill 模式）

作为 Claude Code Skill 使用。

### 安装

```bash
git clone https://github.com/jingweiluo20/AI-daily-digest-IDG.git ~/.claude/skills/AI-daily-digest
```

### 使用

在 Claude Code 中输入 `/ai-daily-digest`，或直接说"生成日报"、"今天有什么AI新闻"、"AI资讯"。

Skill 会：
1. 首次使用时引导你完成配置（投递偏好、信源确认）
2. 实时抓取所有信源的最新内容
3. 生成一份结构化的中文日报

**无需 API key** — 所有内容来自公开 RSS 和公开 JSON feed。

## 自定义信源

随时通过自然语言管理信源：

- **"查看信源"** — 查看当前所有信源
- **"添加信源 XX https://..."** — 添加自定义 RSS 源
- **"删除信源 XX"** — 删除某个信源
- **"恢复默认信源"** — 重置为默认 5 个公众号
- **"修改webhook"** — 更新飞书推送的 Webhook 地址

配置文件存储在本地 `~/.ai-daily-digest/config.json`，完全隔离，其他人无法看到或修改。

## 自动每日推送（进阶）

如果你需要每天自动推送到飞书群，而不是手动触发：

1. **Fork** 本仓库到你的 GitHub 账号
2. 进入 **Settings → Secrets and variables → Actions**，添加以下 Secrets：
   - `LLM_API_KEY` — 你的大模型 API key（GLM、DeepSeek 等）
   - `LLM_BASE_URL` — API 地址（如 `https://open.bigmodel.cn/api/paas/v4`）
   - `LLM_MODEL` — 模型名称（如 `glm-4-plus`）
   - `FEISHU_WEBHOOK` — 飞书自定义机器人的 Webhook URL
   - `WERSS_BASE_URL` — 你的 we-mp-rss 实例地址（如自行部署微信公众号 RSS）
3. 进入 **Actions** 标签页 → 启用 workflows
4. 内置的定时任务会在每天北京时间约 8:00 自动运行

**关于微信公众号 RSS：** 你需要自行部署 [we-mp-rss](https://github.com/nichuanfang/we-mp-rss)（免费开源项目）。Skill 中的默认 RSS 地址使用公共实例，方便直接体验。

## 默认信源

### 微信公众号(30个)

| 公众号 | 方向 |
|--------|------|
| 晚点LatePost | 科技行业深度报道 |
| 硅基观察Pro | 全球 AI 公司价值追踪 |
| Founder Park | 科技创业洞察 |
| 投资实习所 | 产品视角趋势分析 |
| 海外独角兽 | 全球科技公司研究 |
| 智能涌现 | AI 行业观察 |
| 新智元 | AI 资讯与研究 |
| AI科技评论 | AI 技术评论 |
| 极客公园 | 科技文化与产品 |
| 机器之心 | AI 研究资讯 |
| 量子位 | AI 行业资讯 |
| Datawhale | 开源数据科学社区 |
| 深度学习自然语言处理 | NLP 研究前沿 |
| PaperWeekly | AI 论文推荐 |
| 赛博禅心 | AI 产品思考 |
| 数字生命卡兹克 | AI 产品评测 |
| 华为云 | 华为云官方 |
| 商汤科技SenseTime | 商汤官方 |
| 百度文心 | 百度文心官方 |
| 腾讯混元 | 腾讯混元官方 |
| 字节跳动Seed | 字节 Seed 官方 |
| 豆包 | 豆包官方 |
| 百川智能 | 百川智能官方 |
| MiniMax稀宇科技 | MiniMax 官方 |
| 阶跃星辰 | 阶跃星辰官方 |
| 月之暗面Kimi | 月之暗面 Kimi 官方 |
| 智谱 | 智谱 AI 官方 |
| 通义实验室 | 阿里通义实验室 |
| 千问大模型 | 通义千问官方 |
| DeepSeek | DeepSeek 官方 |

### X 上的 AI 建造者（25位）
[Andrej Karpathy](https://x.com/karpathy), [Swyx](https://x.com/swyx), [Josh Woodward](https://x.com/joshwoodward), [Kevin Weil](https://x.com/kevinweil), [Peter Yang](https://x.com/petergyang), [Nan Yu](https://x.com/thenanyu), [Madhu Guru](https://x.com/realmadhuguru), [Amanda Askell](https://x.com/AmandaAskell), [Cat Wu](https://x.com/_catwu), [Thariq](https://x.com/trq212), [Google Labs](https://x.com/GoogleLabs), [Amjad Masad](https://x.com/amasad), [Guillermo Rauch](https://x.com/rauchg), [Alex Albert](https://x.com/alexalbert__), [Aaron Levie](https://x.com/levie), [Ryo Lu](https://x.com/ryolu_), [Garry Tan](https://x.com/garrytan), [Matt Turck](https://x.com/mattturck), [Zara Zhang](https://x.com/zarazhangrui), [Nikunj Kothari](https://x.com/nikunj), [Peter Steinberger](https://x.com/steipete), [Dan Shipper](https://x.com/danshipper), [Aditya Agarwal](https://x.com/adityaag), [Sam Altman](https://x.com/sama), [Claude](https://x.com/claudeai)

### 播客（6个）
- [Latent Space](https://www.youtube.com/@LatentSpacePod)
- [Training Data](https://www.youtube.com/playlist?list=PLOhHNjZItNnMm5tdW61JpnyxeYH5NDDx8)
- [No Priors](https://www.youtube.com/@NoPriorsPodcast)
- [Unsupervised Learning](https://www.youtube.com/@RedpointAI)
- [The MAD Podcast with Matt Turck](https://www.youtube.com/@DataDrivenNYC)
- [AI & I by Every](https://www.youtube.com/playlist?list=PLuMcoKK9mKgHtW_o9h5sGO2vXrffKHwJL)

### 官方博客（2个）
- [Anthropic Engineering](https://www.anthropic.com/engineering) — 技术深度文章
- [Claude Blog](https://claude.com/blog) — 产品公告与更新

## 工作原理

1. 用户在 Claude Code 中输入 `/AI-daily-digest`
2. Skill 实时抓取公开 RSS（公众号文章）和公开 JSON feed（AI builders 推文）
3. Claude 将原始内容生成结构化中文日报
4. 日报直接展示在对话中，也可推送到飞书


## 系统要求

### Skill 模式
- Claude Code（或类似 AI agent）
- 网络连接


## 隐私与安全

- **Skill 模式：** 无需 API key。所有内容来自公开 feed。配置文件存储在你本地 `~/.ai-daily-digest/config.json`，仅在你自己的设备上。
- **GitHub Actions 模式：** API key 和 Webhook 存储在 GitHub Secrets 中——加密且对任何人不可见，包括仓库协作者。
- Skill 只读取公开内容（公开的公众号文章、推文、博客文章）。
- 每个用户的配置完全隔离，互不影响。
