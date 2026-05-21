const RSSParser = require('rss-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const parser = new RSSParser();

const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.deepseek.com/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'deepseek-chat';
const FEISHU_WEBHOOK = process.env.FEISHU_WEBHOOK;
const WERSS_BASE_URL = process.env.WERSS_BASE_URL || 'https://we-mp-rss-production-d40f.up.railway.app';

function getTodayBeijing() {
  const now = new Date();
  const beijing = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return beijing.toISOString().split('T')[0];
}

function isRecent(dateStr) {
  if (!dateStr) return true;
  const articleDate = new Date(dateStr);
  const now = new Date();
  return (now - articleDate) < 48 * 60 * 60 * 1000;
}

async function fetchArticleContent(url) {
  try {
    if (!url || !url.includes('mp.weixin.qq.com')) return null;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    const html = await resp.text();
    const match = html.match(/id="js_content"[^>]*>([\s\S]*?)<\/div>/);
    if (match) {
      let text = match[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
      return text.substring(0, 3000);
    }
    return null;
  } catch (e) {
    return null;
  }
}

// 抓取微信公众号
async function fetchWechatFeeds() {
  const feedFile = path.join(__dirname, '..', 'feed-wechat.json');
  const feeds = JSON.parse(fs.readFileSync(feedFile, 'utf-8'));
  const articles = [];

  for (const source of feeds) {
    try {
      const feed = await parser.parseURL(source.rss);
      for (const item of (feed.items || []).slice(0, 5)) {
        if (!isRecent(item.pubDate)) continue;
        const content = await fetchArticleContent(item.link);
        articles.push({
          type: 'wechat',
          source: source.name,
          title: item.title || '无标题',
          link: item.link || '',
          summary: content || item.contentSnippet || item.content || '无摘要',
          date: item.pubDate || ''
        });
      }
    } catch (e) {
      console.log(`[WARN] 抓取 ${source.name} 失败: ${e.message}`);
    }
  }
  return articles;
}

// 从 zarazhangrui/follow-builders 的 feed-x.json 抓取推文
async function fetchBuildersTweets() {
  const articles = [];
  try {
    const resp = await fetch('https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json');
    const data = await resp.json();
    const users = data.x || [];

    for (const user of users) {
      for (const tweet of (user.tweets || []).slice(0, 3)) {
        if (!tweet.text || tweet.text.length < 20) continue;
        articles.push({
          type: 'builders',
          source: `${user.name} (@${user.handle})`,
          title: tweet.text.substring(0, 80) + (tweet.text.length > 80 ? '...' : ''),
          link: tweet.url || `https://x.com/${user.handle}/status/${tweet.id}`,
          summary: tweet.text,
          date: tweet.createdAt || ''
        });
      }
    }
  } catch (e) {
    console.log(`[WARN] 抓取 builders tweets 失败: ${e.message}`);
  }
  return articles;
}

// 从 feed-podcasts.json 抓取播客
async function fetchBuildersPodcasts() {
  const articles = [];
  try {
    const resp = await fetch('https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json');
    const data = await resp.json();
    const podcasts = data.podcasts || [];

    for (const ep of podcasts.slice(0, 10)) {
      articles.push({
        type: 'builders',
        source: ep.podcastName || ep.source || 'Podcast',
        title: ep.title || '无标题',
        link: ep.url || ep.link || '',
        summary: (ep.description || ep.summary || '').substring(0, 500),
        date: ep.publishedAt || ep.date || ''
      });
    }
  } catch (e) {
    console.log(`[WARN] 抓取 builders podcasts 失败: ${e.message}`);
  }
  return articles;
}

async function generateDigest(articles) {
  const wechatList = articles.filter(a => a.type === 'wechat');
  const buildersList = articles.filter(a => a.type === 'builders');

  const formatArticles = (list) => list.map((a, i) =>
    `${i + 1}. [来源:${a.source}] 标题:${a.title}\n   链接: ${a.link}\n   内容: ${a.summary}`
  ).join('\n\n');

  const articleText = `=== 第一部分：国内AI资讯 ===\n${formatArticles(wechatList)}\n\n=== 第二部分：海外AI圈动态（推文+播客） ===\n${formatArticles(buildersList)}`;

  const prompt = `你是一个AI行业日报编辑。请根据以下今日文章列表，生成一份中文日报摘要。

要求：
1. 不要用#号标题，用**加粗文字**作为分类标题
2. 按主题分类（如：大模型动态、创业融资、产品发布、行业观点、技术前沿等）
3. 每条新闻用1-2句话总结核心信息，紧接着在同一行末尾附上原文链接，格式为 [原文](链接)
4. 每条用 - 开头作为列表项
5. 开头写一段今日概览（3-5句话总结今天最重要的事）
6. 分类之间用空行隔开
7. 语言简洁有力，适合快速阅读
8. 不要在结尾单独列链接列表，链接已经跟在每条后面了
9. 文章分为两个部分，请严格按顺序输出：先输出第一部分（国内资讯）的摘要，再输出第二部分（海外动态）的摘要，两部分之间用 --- 分割线隔开，不要标注内容来自哪个源或哪个人

今日文章：
${articleText}`;

  const resp = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: '你是专业的AI行业分析师，擅长将多篇文章整合为结构清晰的中文日报。输出不要用markdown的#标题格式。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7
    })
  });

  const result = await resp.json();
  if (result.choices && result.choices[0]) {
    return result.choices[0].message.content;
  }
  throw new Error('LLM返回异常: ' + JSON.stringify(result));
}

async function sendToFeishu(markdown) {
  const today = getTodayBeijing();
  const cleanMd = markdown.replace(/^#{1,6}\s+(.+)$/gm, '**$1**');

  const resp = await fetch(FEISHU_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      msg_type: 'interactive',
      card: {
        header: {
          title: { tag: 'plain_text', content: `AI日报 ${today}` },
          template: 'blue'
        },
        elements: [
          {
            tag: 'markdown',
            content: cleanMd.substring(0, 4000)
          }
        ]
      }
    })
  });

  const result = await resp.json();
  console.log('[飞书推送结果]', JSON.stringify(result));
}

async function main() {
  console.log(`[${getTodayBeijing()}] 开始生成AI日报...`);

  const [wechatArticles, buildersTweets, buildersPodcasts] = await Promise.all([
    fetchWechatFeeds(),
    fetchBuildersTweets(),
    fetchBuildersPodcasts()
  ]);

  const allArticles = [...wechatArticles, ...buildersTweets, ...buildersPodcasts];
  console.log(`[INFO] 共抓取 ${allArticles.length} 条（微信${wechatArticles.length} + 推文${buildersTweets.length} + 播客${buildersPodcasts.length}）`);

  if (allArticles.length === 0) {
    console.log('[WARN] 今日无内容，跳过生成');
    return;
  }

  const digest = await generateDigest(allArticles);
  console.log('[INFO] 日报生成完成');

  const digestDir = path.join(__dirname, '..', 'digests');
  if (!fs.existsSync(digestDir)) fs.mkdirSync(digestDir, { recursive: true });
  const filePath = path.join(digestDir, `${getTodayBeijing()}.md`);
  fs.writeFileSync(filePath, digest);
  console.log(`[INFO] 已保存到 ${filePath}`);

  if (FEISHU_WEBHOOK) {
    await sendToFeishu(digest);
  } else {
    console.log('[WARN] 未配置FEISHU_WEBHOOK，跳过推送');
  }
}

main().catch(e => {
  console.error('[ERROR]', e);
  process.exit(1);
});
