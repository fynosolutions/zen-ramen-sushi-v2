#!/usr/bin/env python3
"""把旧 WordPress 站上「有 Google 真实点击」的文章原样搬进新站(2026-10-06)。

为什么:切换到新站时这些文章被 301 到菜单锚点,Google 不把「文章→菜单页」当等价内容,
排名和点击保不住。原网址原样恢复 = 接住旧站在这些网址上的积累。

做什么:读 seo/sources.mjs 同口径的点击数据 + 9-20 排名存档,挑出日期式文章里「点击≥1、或有排名词、或近 3 个月曝光≥100」且不是写错城市的;
从旧站取:页面 <title>/描述(Google 索引到的原文)、正文、头图;清洗正文(去脚本/样式/类名,
h1→h2,表格包一层可横滑的容器,站内绝对链接改相对,外链加 target+rel);图片下载转成 webp。
产出:content/journal.json + public/images/journal/*.webp。旧站没有的文章会列出来、不生成。

用法(旧站仍在 WordPress.com 的 192.0.78.24 上时才能跑):
  source ~/Desktop/.env.secrets && python3 scripts/import-journal.py
"""
import json, os, re, subprocess, sys, html, hashlib, io
from html.parser import HTMLParser
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD_IP = '192.0.78.24'; HOST = 'zenramensushiny.com'
AUTH = os.environ['CRED_ZENRAMEN_WP_USER'] + ':' + os.environ['CRED_ZENRAMEN_WP_APP_PASS']
WRONG_CITY = re.compile(r'gainesville|dahlonega|greenville|noblesville', re.I)
IMG_DIR = os.path.join(ROOT, 'public/images/journal'); os.makedirs(IMG_DIR, exist_ok=True)
MIN_IMPRESSIONS = 100
# 站内链接的最终去向:文章里有些链接指向旧网址(现在是跳转),直接写成最终地址,省一跳
REDIRECTS = {r['source']: r['destination'] for r in json.load(open(os.path.join(ROOT, 'vercel.json')))['redirects'] if not r.get('has') and ':' not in r['source']}

def curl(url, auth=False, binary=False):
    cmd = ['curl', '-s', '-L', '-m', '60', '--resolve', f'{HOST}:443:{OLD_IP}'] + (['-u', AUTH] if auth else []) + [url]
    out = subprocess.run(cmd, capture_output=True).stdout
    return out if binary else out.decode('utf-8', 'replace')

def clicks():
    gs = [json.load(open(os.path.join(ROOT, f))) for f in ('seo/gsc-clicks-2026-09-23.json', 'seo/gsc-clicks-3m-2026-09-27.json', 'seo/gsc-clicks-16m-2026-10-06.json')]
    keys = set(k for g in gs for k in g)
    return {k: (max(g.get(k, {}).get('clicks', 0) for g in gs), max(g.get(k, {}).get('imp', 0) for g in gs)) for k in keys}

def save_image(src, slug, n):
    """下载并转 webp(最长边 1400)。返回 (站内路径, 宽, 高);失败返回 None。"""
    src = html.unescape(src).split('?')[0]
    m = re.search(r'(?:i\d\.wp\.com/)?(?:https?://)?(?:www\.)?zenramensushiny\.com(/wp-content/uploads/[^"\s]+)', src) or re.search(r'^(/wp-content/uploads/[^"\s]+)', src)
    url = f'https://{HOST}{m.group(1)}' if m else src
    if not m:
        # 供应商发文工具把正文图放在自己的图床(assets.rankpilot.dev,经 i0.wp.com 代理),直连取不到;
        # 同一张图在旧站媒体库里有副本,文件名里带同一个编号 → 按编号到媒体库找
        k = re.search(r'/assets/(\d{10,}-[0-9a-f]{6,}|\d{10,})\.', src)
        if not k: return None
        hit = json.loads(curl(f'https://{HOST}/wp-json/wp/v2/media?search={k.group(1)}&_fields=source_url', auth=True) or '[]')
        if not isinstance(hit, list) or not hit: return None
        url = hit[0]['source_url']
    # 有些正文图引用的是裁剪/缩放后的变体文件名(…-e1733850405308-1024x584.jpg),源站上未必还有这个变体:依次退回到去掉尺寸、再去掉裁剪标记的原图
    im = None
    for cand in dict.fromkeys([url, re.sub(r'-\d+x\d+(\.\w+)$', r'\1', url), re.sub(r'-e\d+(-\d+x\d+)?(\.\w+)$', r'\2', url)]):
        raw = curl(cand, binary=True)
        try:
            im = Image.open(io.BytesIO(raw)); im.load(); break
        except Exception:
            im = None
    if im is None: return None
    if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGBA' if 'A' in im.getbands() or im.mode == 'P' else 'RGB')
    im.thumbnail((1400, 1400))
    name = f'{slug[:60]}-{n}-{hashlib.sha1(raw).hexdigest()[:8]}.webp'
    im.save(os.path.join(IMG_DIR, name), 'WEBP', quality=80, method=6)
    return f'/images/journal/{name}', im.size[0], im.size[1]

EMOJI = re.compile(r'[\u2190-\u21ff\u2300-\u27bf\u2900-\u2bff\U0001F000-\U0001FAFF\ufe0f\u200d]\s?')
KEEP = {'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption', 'br', 'hr'}
VOID = {'img', 'br', 'hr'}; DROP_WITH_CONTENT = {'script', 'style', 'iframe', 'form', 'noscript', 'svg', 'button', 'input', 'select', 'textarea'}

class Clean(HTMLParser):
    def __init__(self, slug, title):
        super().__init__(convert_charrefs=True); self.o = []; self.skip = 0; self.slug = slug; self.title = title; self.n = 0; self.images = []; self.missing = []; self.ids = set()
    def handle_starttag(self, tag, attrs):
        if tag in DROP_WITH_CONTENT: self.skip += 1; return
        if self.skip: return
        a = dict(attrs)
        if tag == 'h1': tag = 'h2'
        if tag not in KEEP: return
        out = []
        if tag in ('h2', 'h3', 'h4') and a.get('id'):
            i = re.sub(r'[^a-zA-Z0-9_-]', '-', a['id'])
            if i not in self.ids: self.ids.add(i); out.append(('id', i))
        if tag == 'a':
            h = (a.get('href') or '').strip()
            h = re.sub(r'^https?://(www\.)?zenramensushiny\.com', '', h) or '/'
            # 供应商的发文工具把一部分「自家链接」写成了另一个域名 zenramenandsushi.com(现在是停放页)——当作站内链接处理
            m2 = re.match(r'^https?://(www\.)?zenramenandsushi\.com(/[^?#]*)?', h)
            if m2: h = m2.group(2) or '/'
            if h.startswith('/'):
                q = h.split('#')[0].split('?')[0]; q = q if q.endswith('/') or re.search(r'\.[a-z0-9]+$', q) else q + '/'
                if q in REDIRECTS: h = REDIRECTS[q]
                elif q != '/' and not os.path.exists(os.path.join(ROOT, 'app', q.strip('/'), 'page.tsx')) and not re.match(r'^/\d{4}/\d{2}/\d{2}/', q) and not q.startswith('/menus/'): h = '/'
            if h.startswith('#') or h.startswith('/'): out.append(('href', h))
            elif re.match(r'^https?://', h): out += [('href', h), ('target', '_blank'), ('rel', 'noopener noreferrer')]
            elif h.startswith('mailto:') or h.startswith('tel:'): out.append(('href', h))
            else: return self.o.append('<span>')   # 无法判定的链接降级成纯文字
        if tag == 'img':
            src = a.get('src') or a.get('data-src') or ''
            self.n += 1; r = save_image(src, self.slug, self.n)
            if not r:
                if src and 'placehold.co' not in src: self.missing.append(src)   # 空地址和占位图本来就不是内容,直接丢
                return
            alt = (a.get('alt') or '').strip() or self.title
            out += [('src', r[0]), ('alt', alt), ('width', str(r[1])), ('height', str(r[2])), ('loading', 'lazy'), ('decoding', 'async')]
            self.images.append(r[0])
        if tag in ('td', 'th'):
            for k in ('colspan', 'rowspan'):
                if a.get(k): out.append((k, a[k]))
        if tag == 'table': self.o.append('<div class="table-scroll">')
        self.o.append('<' + tag + ''.join(f' {k}="{html.escape(v, quote=True)}"' for k, v in out) + '>')
    def handle_endtag(self, tag):
        if tag in DROP_WITH_CONTENT: self.skip = max(0, self.skip - 1); return
        if self.skip: return
        if tag == 'h1': tag = 'h2'
        if tag in KEEP and tag not in VOID:
            self.o.append(f'</{tag}>')
            if tag == 'table': self.o.append('</div>')
    def handle_data(self, d):
        # 表情/符号字符在手机上显示不一致(全站规矩:不用符号字符,见 seo/check-device-safe.mjs),正文里的去掉、文字保留
        if not self.skip: self.o.append(html.escape(EMOJI.sub('', d), quote=False))

def clean(content, slug, title):
    c = Clean(slug, title); c.feed(content); c.close()
    h = ''.join(c.o)
    h = re.sub(r'<span>(.*?)</a>', r'\1', h, flags=re.S)                      # 降级链接的收尾
    h = re.sub(r'<(p|li|h[234]|figure|figcaption|blockquote)>\s*</\1>', '', h)  # 空壳
    h = re.sub(r'\n{3,}', '\n\n', h).strip()
    return label_tables(h), c.images, c.missing

def label_tables(h):
    """给表格正文的每个单元格标上所在列的表头(data-label),手机上表格按「一行一张卡」堆叠时用它当小标题。"""
    def one(m):
        t = m.group(0); head = re.search(r'<thead>.*?</thead>', t, re.S) or re.search(r'<tr>.*?</tr>', t, re.S)
        heads = [re.sub(r'<[^>]+>', '', x).strip() for x in re.findall(r'<th[^>]*>(.*?)</th>', head.group(0), re.S)] if head else []
        body = re.search(r'<tbody>.*?</tbody>', t, re.S)
        if not heads or not body: return t
        def row(r):
            i = [-1]
            def cell(c):
                i[0] += 1; lab = heads[i[0]] if i[0] < len(heads) else ''
                return re.sub(r'^<td(?![^>]*data-label)', '<td data-label="' + lab.replace('"', '&quot;') + '"', c.group(0)) if lab else c.group(0)
            return re.sub(r'<td[^>]*>.*?</td>', cell, r.group(0), flags=re.S)
        return t.replace(body.group(0), re.sub(r'<tr>.*?</tr>', row, body.group(0), flags=re.S))
    return re.sub(r'<table>.*?</table>', one, h, flags=re.S)

def text_of(h): return re.sub(r'\s+([,.;:?!)])', r'\1', re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h)))).strip()

def main():
    cl = clicks()
    # 入选条件:Google 真实点击 ≥1,或在 9-20 的排名存档里有排名词(有排名但还没带来点击的文章也是积累);写错城市的不要
    rk = json.load(open(os.path.join(ROOT, 'seo/ranked-before-2026-09-20.json')))['tasks'][0]['result'][0]['items']
    ranked = set(re.sub(r'^https?://[^/]+', '', it['ranked_serp_element']['serp_item']['url']).rstrip('/') + '/' for it in rk)
    for k in ranked: cl.setdefault(k, (0, 0))
    # 曝光 ≥100(近 3 个月)也算:有曝光说明 Google 在给它排名,只是还没人点;低于 100 的视为没有积累
    # 2026-10-06 再放宽:旧站上所有已发布的文章都搬(名单 = 当天从旧站后台接口取的 146 篇快照)。原因:新站自己的统计里看到访客在访问没有 Google 点击的文章
    # (来自社媒、直接链接等,Search Console 看不到);客户目标是一点都不掉。写错城市的 4 篇仍不要
    allposts = set(json.load(open(os.path.join(ROOT, 'seo/old-posts-all-2026-10-06.json'))))
    for k in allposts: cl.setdefault(k, (0, 0))
    want = sorted([k for k, (c, i) in cl.items() if re.match(r'^/\d{4}/\d{2}/\d{2}/[^/#]+/$', k) and (c >= 1 or k in ranked or i >= MIN_IMPRESSIONS or k in allposts) and not WRONG_CITY.search(k)], key=lambda k: (-cl[k][0], -cl[k][1]))
    posts, missing = [], []
    for p in want:
        slug = p.strip('/').split('/')[-1]
        j = json.loads(curl(f'https://{HOST}/wp-json/wp/v2/posts?slug={slug}&_embed=wp:featuredmedia', auth=True) or '[]')
        if not isinstance(j, list) or not j: missing.append(p); print('旧站没有:', p, file=sys.stderr); continue
        x = j[0]; page = curl(f'https://{HOST}{p}')
        g = lambda rx: (lambda m: html.unescape(m.group(1)) if m else '')(re.search(rx, page))
        title = html.unescape(x['title']['rendered']).strip()
        body, images, miss = clean(x['content']['rendered'], slug, title)
        fm = ((x.get('_embedded') or {}).get('wp:featuredmedia') or [{}])[0]; hero = None
        if fm.get('source_url'):
            r = save_image(fm['source_url'], slug, 0)
            if r: hero = {'src': r[0], 'width': r[1], 'height': r[2], 'alt': (fm.get('alt_text') or '').strip() or title}
        desc = g(r'<meta name="description" content="([^"]*)"') or text_of(x['excerpt']['rendered'])[:155]
        posts.append({'path': p, 'slug': slug, 'title': title, 'pageTitle': g(r'<title>([^<]*)</title>') or title, 'description': desc,
                      'date': x['date'], 'modified': x['modified'], 'hero': hero, 'html': body, 'words': len(text_of(body).split()),
                      'clicks': cl[p][0], 'impressions': cl[p][1], 'missingImages': miss})
        print(f'ok {cl[p][0]:>4} 次点击 {len(text_of(body).split()):>5} 词 {len(images)} 图 {p}', file=sys.stderr)
    # 旧站有一批文章共用同一条站点默认描述(还带错别字 "thatcombine")——那不是这篇文章的描述,不值得保留;
    # 共用的换成正文开头,独有的逐字保留
    from collections import Counter
    dup = {d for d, n in Counter(p['description'] for p in posts).items() if n > 1}
    for p in posts:
        if p['description'] in dup:
            t = text_of(re.sub(r'<h2[^>]*>.*?</h2>|<ul>.*?</ul>', ' ', p['html'], flags=re.S))
            cut = t[:156]; p['description'] = (cut[:cut.rfind(' ')] if len(t) > 156 else t).rstrip(' ,;:') + ('…' if len(t) > 156 else ''); p['descriptionSource'] = 'body'
        else: p['descriptionSource'] = 'old-site'
    json.dump({'importedAt': subprocess.run(['date', '-u', '+%Y-%m-%dT%H:%MZ'], capture_output=True, text=True).stdout.strip(), 'source': 'old WordPress.com site via ' + OLD_IP,
               'notOnOldSite': missing, 'posts': posts}, open(os.path.join(ROOT, 'content/journal.json'), 'w'), ensure_ascii=False, indent=1)
    # 清掉本次没用到的旧图(文件名带内容指纹,源图变了就会留下旧文件)
    used = set(re.findall(r'/images/journal/([^"]+)', '\n'.join(p['html'] for p in posts))) | {p['hero']['src'].split('/')[-1] for p in posts if p['hero']}
    for f in os.listdir(IMG_DIR):
        if f not in used: os.remove(os.path.join(IMG_DIR, f))
    print(f'JOURNAL-IMPORT 完成: {len(posts)} 篇, 旧站没有 {len(missing)} 篇, 图片缺 {sum(len(p["missingImages"]) for p in posts)} 张', file=sys.stderr)

if __name__ == '__main__': main()
