**English** | [中文](README.zh-CN.md)

# AI Daily Digest

An AI-powered daily digest that aggregates the most valuable information from China's top WeChat public accounts and overseas AI builders, delivering a structured Chinese summary.

**Philosophy:** Follow people who build products and have original opinions, not influencers who regurgitate information.

## What You Get

A daily digest with:

- Curated articles from 5 top Chinese AI WeChat public accounts (晚点LatePost, 硅基观察Pro, Founder Park, 投资实习所, 海外独角兽)
- Key posts and insights from 25+ curated AI builders on X/Twitter (Swyx, Kevin Weil, Andrej Karpathy, etc.)
- Summaries of new podcast episodes from top AI podcasts
- Full articles from official AI company blogs (Anthropic Engineering, Claude Blog)
- Links to all original content
- Structured Chinese output, optimized for quick reading

## Quick Start (Skill Mode)

Use this as a Claude Code Skill — no API keys needed.

### Install

```bash
git clone https://github.com/jingweiluo20/AI-daily-digest-IDG.git ~/.claude/skills/ai-daily-digest
cd ~/.claude/skills/ai-daily-digest/scripts && npm install
```

### Use

In Claude Code, type `/ai-daily-digest` or say "生成日报" / "今天有什么AI新闻".

The skill will:
1. Walk you through a one-time setup (delivery preference, source confirmation)
2. Fetch the latest content from all sources in real-time
3. Generate a structured Chinese daily digest

**No API keys needed** — all content is fetched from public RSS feeds and public JSON feeds.

## Customizing Sources

You can manage sources through natural language at any time:

- **"查看信源"** — View current sources
- **"添加信源 XX https://..."** — Add a custom RSS source
- **"删除信源 XX"** — Remove a source
- **"恢复默认信源"** — Reset to default 5 WeChat accounts
- **"修改webhook"** — Update Feishu webhook for push notifications

Your configuration is stored locally at `~/.ai-daily-digest/config.json` — completely isolated, no one else can see or modify it.

## Auto Daily Push (Advanced)

If you want automatic daily push to Feishu without manual triggering:

1. **Fork** this repo to your GitHub account
2. Go to **Settings → Secrets and variables → Actions**, add these secrets:
   - `LLM_API_KEY` — Your LLM API key (GLM, DeepSeek, etc.)
   - `LLM_BASE_URL` — API endpoint (e.g., `https://open.bigmodel.cn/api/paas/v4`)
   - `LLM_MODEL` — Model name (e.g., `glm-4-plus`)
   - `FEISHU_WEBHOOK` — Your Feishu bot webhook URL
   - `WERSS_BASE_URL` — Your we-mp-rss instance URL (if self-hosting WeChat RSS)
3. Go to **Actions** tab → Enable workflows
4. The built-in cron job runs daily at ~8:00 AM Beijing time

**For WeChat public account RSS:** You need to deploy your own [we-mp-rss](https://github.com/nichuanfang/we-mp-rss) instance (free, open-source). The default RSS URLs in the Skill use a shared instance for convenience.

## Default Sources

### WeChat Public Accounts (5)

| Account | Focus |
|---------|-------|
| 晚点LatePost | Tech industry in-depth reporting |
| 硅基观察Pro | Global AI company value tracking |
| Founder Park | Tech entrepreneurship insights |
| 投资实习所 | Product-oriented trend analysis |
| 海外独角兽 | Global tech company research |

### AI Builders on X (25)
[Andrej Karpathy](https://x.com/karpathy), [Swyx](https://x.com/swyx), [Josh Woodward](https://x.com/joshwoodward), [Kevin Weil](https://x.com/kevinweil), [Peter Yang](https://x.com/petergyang), [Nan Yu](https://x.com/thenanyu), [Madhu Guru](https://x.com/realmadhuguru), [Amanda Askell](https://x.com/AmandaAskell), [Cat Wu](https://x.com/_catwu), [Thariq](https://x.com/trq212), [Google Labs](https://x.com/GoogleLabs), [Amjad Masad](https://x.com/amasad), [Guillermo Rauch](https://x.com/rauchg), [Alex Albert](https://x.com/alexalbert__), [Aaron Levie](https://x.com/levie), [Ryo Lu](https://x.com/ryolu_), [Garry Tan](https://x.com/garrytan), [Matt Turck](https://x.com/mattturck), [Zara Zhang](https://x.com/zarazhangrui), [Nikunj Kothari](https://x.com/nikunj), [Peter Steinberger](https://x.com/steipete), [Dan Shipper](https://x.com/danshipper), [Aditya Agarwal](https://x.com/adityaag), [Sam Altman](https://x.com/sama), [Claude](https://x.com/claudeai)

### Podcasts (6)
- [Latent Space](https://www.youtube.com/@LatentSpacePod)
- [Training Data](https://www.youtube.com/playlist?list=PLOhHNjZItNnMm5tdW61JpnyxeYH5NDDx8)
- [No Priors](https://www.youtube.com/@NoPriorsPodcast)
- [Unsupervised Learning](https://www.youtube.com/@RedpointAI)
- [The MAD Podcast with Matt Turck](https://www.youtube.com/@DataDrivenNYC)
- [AI & I by Every](https://www.youtube.com/playlist?list=PLuMcoKK9mKgHtW_o9h5sGO2vXrffKHwJL)

### Official Blogs (2)
- [Anthropic Engineering](https://www.anthropic.com/engineering) — Technical deep-dives
- [Claude Blog](https://claude.com/blog) — Product announcements and updates

## How It Works

### Skill Mode (Interactive)
1. User invokes `/ai-daily-digest` in Claude Code
2. The skill fetches public RSS feeds (WeChat accounts) and public JSON feed (AI builders' tweets) in real-time
3. Claude generates a structured Chinese digest from the raw content
4. Digest is displayed in chat, optionally pushed to Feishu

### GitHub Actions Mode (Automated)
1. Cron job triggers daily at UTC 0:00 (~Beijing 8:00 AM)
2. Script fetches all sources, sends to LLM for summarization
3. Digest is pushed to Feishu group via webhook
4. Markdown file is saved to `digests/` folder in the repo

## Requirements

### Skill Mode
- Claude Code (or similar AI agent)
- Internet connection

That's it. No API keys needed.

### GitHub Actions Mode
- A forked copy of this repo
- LLM API key (GLM, DeepSeek, or any OpenAI-compatible API)
- Feishu webhook URL
- (Optional) Self-hosted we-mp-rss for WeChat RSS

## Privacy & Security

- **Skill mode:** No API keys needed. All content comes from public feeds. Your config is stored locally at `~/.ai-daily-digest/config.json` on your own machine.
- **GitHub Actions mode:** Your API keys and webhooks are stored in GitHub Secrets — encrypted and invisible to anyone, including repo collaborators.
- The skill only reads public content (public WeChat articles, public tweets, public blog posts).
- Each user's configuration is completely isolated.

## License

MIT
