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

// 获取今天日期（北京时间）
function getTodayBeijing() {
  const now = new Date();
  const beijing = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return beijing.toISOString().split('T')[0];
}

// 判断是否是最近24小时内的文章
function isRecent(dateStr) {
  if (!dateStr) return true;
  const articleDate = new Date(dateStr);
  const now = new Date();
  const diff = now - articleDate;
  return diff < 48 * 60 * 60 * 1000; // 放宽到48小时，防止漏掉
}

// 尝试抓取微信文章正文
async function fetchArticleContent(url) {
  try {
    if (!url || !url.includes('mp.weixin.qq.com')) return null;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    const html = await resp.text();
    // 提取正文（js_content div内的文本）
    const match = html.match(/id="js_content"[^>]*>([\s\S]*?)<\/div>/);
    if (match) {
      // 去掉HTML标签，保留纯文本
      let text = match[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
      // 限制长度避免token爆炸
      return text.substring(0, 3000);
    }
    return null;
  } catch (e) {
    return null;
  }
}

// 获取微信公众号文章
async function fetchWechatFeeds() {
  const feedFile = path.join(__dirname, '..', 'feed-wechat.json');
  const feeds = JSON.parse(fs.readFileSync(feedFile, 'utf-8'));
  const articles = [];

  for (const source of feeds) {
    try {
      const feed = await parser.parseURL(source.rss);
      for (const item of (feed.items || []).slice(0, 5)) {
        if (!isRecent(item.pubDate)) continue;
        // 尝试获取正文
        const content = await fetchArticleContent(item.link);
        articles.push({
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

// 获取 follow-builders 的 state-feed
async function fetchBuildersFeed() {
  const articles = [];
  try {
    const resp = await fetch('https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/state-feed.json');
    const data = await resp.json();
    const items = Array.isArray(data) ? data : (data.items || []);
    for (const item of items.slice(0, 20)) {
      if (!isRecent(item.published || item.date)) continue;
      articles.push({
        source: item.source || 'AI Builders',
        title: item.title || '无标题',
        link: item.url || item.link || '',
        summary: (item.description || item.content || '').substring(0, 500),
        date: item.published || item.date || ''
      });
    }
  } catch (e) {
    console.log(`[WARN] 抓取 builders feed 失败: ${e.message}`);
  }
  return articles;
}

// 调用LLM生成日报
async function generateDigest(articles) {
  const articleText = articles.map((a, i) =>
    `${i + 1}. [${a.source}] ${a.title}\n   链接: ${a.link}\n   内容: ${a.summary}`
  ).join('\n\n');

  const prompt = `你是一个AI行业日报编辑。请根据以下今日文章列表，生成一份中文日报摘要。

要求：
1. 不要用#号标题，用**加粗文字**作为分类标题
2. 按主题分类（如：大模型动态、创业融资、产品发布、行业观点等）
3. 每条新闻用1-2句话总结核心信息，用 - 开头作为列表项
4. 开头写一段今日概览（3-5句话总结今天最重要的事）
5. 结尾附上原文链接列表，格式为 [标题](链接)
6. 语言简洁有力，适合快速阅读
7. 分类之间用分割线 --- 隔开

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
        { role: 'system', content: '你是专业的AI行业分析师，擅长将多篇文章整合为结构清晰的中文日报。' },
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

// 发送到飞书
async function sendToFeishu(markdown) {
  const today = getTodayBeijing();
  const resp = await fetch(FEISHU_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      msg_type: 'interactive',
      card: {
        header: {
          title: { tag: 'plain_text', content: `🤖 AI日报 ${today}` },
          template: 'blue'
        },
        elements: [
          {
            tag: 'markdown',
            content: markdown.replace(/^#{1,6}\s+/gm, '**').replace(/^(\*\*[^*]+)$/gm, '$1**').substring(0, 4000)
          },
          {
            tag: 'action',
            actions: [{
              tag: 'button',
              text: { tag: 'plain_text', content: '查看完整日报' },
              url: `https://github.com/YOUR_USERNAME/follow-builders/blob/main/digests/${today}.md`,
              type: 'primary'
            }]
          }
        ]
      }
    })
  });

  const result = await resp.json();
  console.log('[飞书推送结果]', JSON.stringify(result));
}

// 主流程
async function main() {
  console.log(`[${getTodayBeijing()}] 开始生成AI日报...`);

  // 并行抓取两个来源
  const [wechatArticles, buildersArticles] = await Promise.all([
    fetchWechatFeeds(),
    fetchBuildersFeed()
  ]);

  const allArticles = [...wechatArticles, ...buildersArticles];
  console.log(`[INFO] 共抓取 ${allArticles.length} 篇文章（微信${wechatArticles.length}篇 + Builders${buildersArticles.length}篇）`);

  if (allArticles.length === 0) {
    console.log('[WARN] 今日无文章，跳过生成');
    return;
  }

  // 生成日报
  const digest = await generateDigest(allArticles);
  console.log('[INFO] 日报生成完成');

  // 保存到本地
  const digestDir = path.join(__dirname, '..', 'digests');
  if (!fs.existsSync(digestDir)) fs.mkdirSync(digestDir, { recursive: true });
  const filePath = path.join(digestDir, `${getTodayBeijing()}.md`);
  fs.writeFileSync(filePath, digest);
  console.log(`[INFO] 已保存到 ${filePath}`);

  // 推送到飞书
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
