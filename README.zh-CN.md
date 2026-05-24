[English](README.md) | **中文**

# AI 行业中文日报

一个 AI 驱动的每日信息聚合工具，整合国内头部公众号和海外 AI builders 的最新动态，生成结构化的中文日报。

**理念：** 追踪真正在做产品、有独立见解的人，过滤噪音。

## 你会得到什么

一份结构清晰的中文日报，包含：

- 5 个国内头部 AI 公众号的最新文章（晚点LatePost、硅基观察Pro、Founder Park、投资实习所、海外独角兽）
- 25+ 位海外 AI builders 在 X/Twitter 上的关键观点和洞察（Swyx、Kevin Weil、Andrej Karpathy 等）
- 顶级 AI 播客新节目的精华摘要
- AI 公司官方博客的完整文章（Anthropic Engineering、Claude Blog）
- 所有原始内容的链接
- 国内在前、海外在后的分区结构，适合快速阅读

## 快速开始（Skill 模式）

作为 Claude Code Skill 使用，无需任何 API key。

### 安装

```bash
git clone https://github.com/jingweiluo20/AI-daily-digest-IDG.git ~/.claude/skills/ai-daily-digest
cd ~/.claude/skills/ai-daily-digest/scripts && npm install
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

### 微信公众号（5个）

| 公众号 | 方向 |
|--------|------|
| 晚点LatePost | 科技行业深度报道 |
| 硅基观察Pro | 全球 AI 公司价值追踪 |
| Founder Park | 科技创业洞察 |
| 投资实习所 | 产品视角趋势分析 |
| 海外独角兽 | 全球科技公司研究 |

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

### Skill 模式（交互式）
1. 用户在 Claude Code 中输入 `/ai-daily-digest`
2. Skill 实时抓取公开 RSS（公众号文章）和公开 JSON feed（AI builders 推文）
3. Claude 将原始内容生成结构化中文日报
4. 日报直接展示在对话中，也可推送到飞书

### GitHub Actions 模式（自动化）
1. 定时任务每天 UTC 0:00（北京时间约 8:00）触发
2. 脚本抓取所有信源，发送给大模型进行摘要
3. 日报通过 Webhook 推送到飞书群
4. Markdown 文件保存到仓库 `digests/` 文件夹

## 系统要求

### Skill 模式
- Claude Code（或类似 AI agent）
- 网络连接

仅此而已，不需要任何 API key。

### GitHub Actions 模式
- 本仓库的 Fork 副本
- 大模型 API key（GLM、DeepSeek 或任何 OpenAI 兼容 API）
- 飞书 Webhook URL
- （可选）自行部署的 we-mp-rss 用于微信公众号 RSS

## 隐私与安全

- **Skill 模式：** 无需 API key。所有内容来自公开 feed。配置文件存储在你本地 `~/.ai-daily-digest/config.json`，仅在你自己的设备上。
- **GitHub Actions 模式：** API key 和 Webhook 存储在 GitHub Secrets 中——加密且对任何人不可见，包括仓库协作者。
- Skill 只读取公开内容（公开的公众号文章、推文、博客文章）。
- 每个用户的配置完全隔离，互不影响。

## 许可证

MIT
