<script setup>
import registry from '../../../research/intelligence/REGISTRY.json'

const pipeline=registry.pipelines.find(i=>i.id==='published-research')
const platform=registry.pipelines.find(i=>i.id==='ai-platform')
const github=registry.pipelines.find(i=>i.id==='github-engineering')
const frequency=v=>({daily:'每日',weekly:'每周','biweekly-or-release':'每两周或版本触发',monthly:'每月'})[v]||v
const focus=i=>(i.focus||i.sourceTypes||[]).join(' · ')
const count=(items,tier,freq)=>items.filter(i=>(!tier||i.tier===tier)&&(!freq||i.frequency===freq)).length
const platformItems=platform.sources||[]
const githubItems=github.repositories||[]
const researchItems=pipeline.sources||[]
const totalEntries=platformItems.length+githubItems.length+researchItems.length
const totalChannels=platformItems.reduce((n,i)=>n+(i.channels?.length||0),0)
const summary=[
  {name:'AI 平台',entries:platformItems.length,daily:count(platformItems,'P0','daily'),weekly:count(platformItems,'P1','weekly'),focused:count(platformItems,'P2'),note:`${totalChannels} 个正式入口`},
  {name:'GitHub 工程仓库',entries:githubItems.length,daily:count(githubItems,'P0','daily'),weekly:count(githubItems,'P1','weekly'),focused:count(githubItems,'P2'),note:'核心工程、审计评测、工作实践与异常检测'},
  {name:'论文与研究成果',entries:researchItems.length,daily:count(researchItems,'P0','daily'),weekly:count(researchItems,'P1','weekly'),focused:count(researchItems,'P2'),note:'论文、研究机构、Artifact 与研究聚合索引'}
]
const platformPurpose={openai:'ChatGPT、Codex、API 与 Agent 产品更新、开发文档、企业控制和运行状态','anthropic-claude':'Claude、Claude Code 与 API 的产品、Agent Runtime、安全治理和官方变化','google-gemini':'Gemini、AI Studio、Vertex AI、Gemini CLI 与 ADK 的产品和工程变化',cursor:'AI 编程 Agent、Cloud Agents、CLI、开发工作流与产品变化','github-copilot':'Copilot Coding Agent、CLI、Code Review 与 GitHub 原生 Agent 能力','microsoft-copilot-platform':'Microsoft 365 Copilot、Copilot Studio、Agent Builder 与企业 Agent 平台'}
const researchPurpose={arxiv:'学术预印本平台；重点关注 cs.MA、cs.SE、cs.AI',jaamas:'《自主智能体与多智能体系统》期刊；关注 Agent 组织、协调、协议与治理',jss:'《系统与软件》期刊；关注软件架构、工程实现、实证评估与可复现性',zenodo:'开放科研成果存档平台；关注软件、数据集、Artifact 与复现证据',openreview:'开放同行评审平台；关注论文与公开评审','openai-research':'OpenAI 官方研究','anthropic-research':'Anthropic 官方研究','google-deepmind':'Google DeepMind 官方研究','microsoft-research':'微软研究院；关注 Agent、企业 AI、软件工程、系统架构与 Benchmark','acl-anthology':'ACL 论文库；NLP、Agent 与语言技术',pmlr:'机器学习论文集',neurips:'NeurIPS 论文集','acm-dl':'ACM 数字图书馆','ieee-xplore':'IEEE 论文与标准','awesome-auditable-ai':'可审计 AI 的论文、数据集、基准、标准与工具聚合索引；仅用于发现线索，采用前必须回到一手来源核验。'}
const officialNotices=item=>(item.channels||[]).filter(channel=>channel.communityLane==='official-notice')
const precisionSections=item=>(item.channels||[]).filter(channel=>channel.communityLane==='precision-section')
const otherChannels=item=>(item.channels||[]).filter(channel=>!channel.communityLane)
const authorityName={'official-staff-only':'仅官方团队可形成平台事实','official-staff-authorship-required':'必须核验官方员工身份','lead-only-until-reproduced-or-officially-corroborated':'研究线索，需复现或官方确认'}
const channelNames={'release-notes':'版本说明','chatgpt-release-notes':'ChatGPT 版本说明','developer-docs':'开发文档','official-github':'官方 GitHub','status':'服务状态','forum-announcements':'Announcements','forum-api':'API','forum-codex':'Codex','forum-apps-sdk':'ChatGPT Apps SDK','forum-open-models':'Open Models','forum-community-projects':'Community Projects','news':'官方新闻','docs':'开发文档','claude-code':'Claude Code GitHub','api-release-notes':'Gemini API 更新日志','gemini-cli':'Gemini CLI GitHub','adk':'ADK GitHub','cloud-status':'Google Cloud 状态','forum-announcement-index':'Announcement 标签','forum-gemini-api':'Gemini API','forum-ai-studio':'Google AI Studio','forum-antigravity':'Google Antigravity','changelog':'更新日志','forum-release-discussions':'Release Discussions','forum-bug-reports':'Bug Reports','forum-ideas':'Ideas','forum-discussions':'Discussions','copilot-cli':'Copilot CLI GitHub','community-news-announcements':'Copilot News and Announcements','community-conversations':'Copilot Conversations','copilot-docs':'Copilot 文档','studio-whats-new':'Copilot Studio 更新','m365-roadmap':'Microsoft 365 路线图','service-health-docs':'服务健康文档','copilot-studio-blog':'Copilot Studio Blog','copilot-studio-discussions':'Copilot Studio Discussions'}
const channelName=channel=>channelNames[channel.id]||channel.id.replaceAll('-',' ')
</script>

# 情报源明细表

本页是数字研究员正式 Watchlist 的可读投影。**唯一事实源仍是 `research/intelligence/REGISTRY.json`**；本页直接读取 Registry，不维护第二份来源名单。

## 分类统计

<div class="summary-strip"><div><strong>{{totalEntries}}</strong><span>纳入监控对象</span></div><div><strong>{{summary.reduce((n,i)=>n+i.daily,0)}}</strong><span>P0 每日</span></div><div><strong>{{summary.reduce((n,i)=>n+i.weekly,0)}}</strong><span>P1 每周</span></div><div><strong>{{summary.reduce((n,i)=>n+i.focused,0)}}</strong><span>P2 专项</span></div></div>
<div class="summary-table"><div class="summary-head"><b>分类</b><b>对象数</b><b>P0 每日</b><b>P1 每周</b><b>P2 专项</b><b>说明</b></div><div v-for="item in summary" :key="item.name" class="summary-row"><strong>{{item.name}}</strong><span>{{item.entries}}</span><span>{{item.daily}}</span><span>{{item.weekly}}</span><span>{{item.focused}}</span><small>{{item.note}}</small></div></div>

## AI 平台 · P0 每日

<div class="source-ledger"><article v-for="item in platformItems" :key="item.id"><h3>{{item.organization}}</h3><small>{{item.products.join(' · ')}}</small><p>{{platformPurpose[item.id]}}</p><div class="tags"><b>{{item.tier}}</b><b>{{frequency(item.frequency)}}</b><span>{{item.channels.length}} 个公开正式入口</span></div><div v-if="officialNotices(item).length" class="notice-row"><b>官方通告</b><a v-for="channel in officialNotices(item)" :key="channel.id" :href="channel.url">{{channelName(channel)}} ↗</a><small>{{authorityName[officialNotices(item)[0].authorityRule]}}</small></div><div v-if="item.communityExclusion" class="source-exclusion"><b>社区暂不纳入</b><span>{{item.communityExclusion.id}} 需要登录，已从每日应检清单排除。</span></div><details v-if="precisionSections(item).length" class="channel-details"><summary>查看 {{precisionSections(item).length}} 个精准板块</summary><div class="channel-links"><a v-for="channel in precisionSections(item)" :key="channel.id" :href="channel.url"><span>{{channelName(channel)}} ↗</span><small>{{(channel.scope||[]).join(' · ')}}</small></a></div><p class="evidence-note">精准板块只产生研究线索，需复现或官方确认后才能形成平台事实。</p></details><details v-if="otherChannels(item).length" class="channel-details secondary"><summary>查看 {{otherChannels(item).length}} 个文档、GitHub 与状态入口</summary><div class="channel-links"><a v-for="channel in otherChannels(item)" :key="channel.id" :href="channel.url"><span>{{channelName(channel)}} ↗</span><small>{{channel.type}}</small></a></div></details></article></div>

## GitHub 工程 Watchlist

<div class="source-ledger"><article v-for="item in githubItems" :key="item.repository"><h3 class="repo">{{item.repository}}</h3><p>{{item.category_zh||'Agent Runtime、协议、SDK、工具、恢复、评估、可观测性及工程实现变化。'}}</p><small>服务栏目：{{item.columns.join(' · ')}}</small><div class="tags"><b>{{item.tier}}</b><b>{{frequency(item.frequency)}}</b><span v-if="item.category_zh">{{item.category_zh}}</span></div><details v-if="item.watchFor" class="channel-details secondary"><summary>观察重点与专题触发条件</summary><small>{{(item.watchFor_zh||item.watchFor).join(' · ')}}</small><p class="evidence-note">{{item.specialStudyTrigger_zh||item.specialStudyTrigger}}</p></details><a :href="`https://github.com/${item.repository}`">访问 GitHub ↗</a></article></div>

## 论文与研究成果

<div class="source-ledger"><article v-for="item in researchItems" :key="item.id"><h3>{{item.name}}</h3><p>{{researchPurpose[item.id]}}</p><small>{{focus(item)}}</small><div class="tags"><b>{{item.tier}}</b><b>{{frequency(item.frequency)}}</b><span v-if="item.evidenceRole==='secondary-navigation-only'">二级导航源</span></div><p v-if="item.verificationRule" class="evidence-note">证据规则：{{item.verificationRule_zh||item.verificationRule}}</p><details v-if="item.specialStudyTrigger" class="channel-details secondary"><summary>专题研究触发条件</summary><small>{{item.specialStudyTrigger_zh||item.specialStudyTrigger}}</small></details><a :href="item.url">访问来源 ↗</a></article></div>

## 说明

- **P0 / 每日**：Discovery 每日正式检查的核心来源。
- **P1 / 每周**：扩大覆盖面的高价值来源。
- **P2 / 专项**：每两周、按版本或每月查看；只有命中 Registry 中的触发条件才进入特别研究。
- **研究聚合索引**只负责发现线索，不能替代原始论文、官方仓库、数据集、Benchmark 或标准文件。
- 今日实际扫描结果记录在当天 Intelligence Run；新增或删除来源只修改 Registry，本页随构建自动更新。

<style scoped>
.summary-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:18px 0}.summary-strip>div{padding:15px;border:1px solid var(--vp-c-divider);border-radius:13px;background:var(--vp-c-bg-soft)}.summary-strip strong{display:block;font-size:26px;line-height:1}.summary-strip span{display:block;margin-top:8px;color:var(--vp-c-text-2);font-size:12px}.summary-table{margin:14px 0 38px;border-top:1px solid var(--vp-c-divider);border-bottom:1px solid var(--vp-c-divider)}.summary-head,.summary-row{display:grid;grid-template-columns:1.25fr .5fr .6fr .6fr .6fr 1.7fr;gap:12px;align-items:center;padding:12px 4px;border-bottom:1px solid var(--vp-c-divider)}.summary-row:last-child{border-bottom:0}.summary-head{color:var(--vp-c-text-2);font-size:12px}.summary-row span{font-weight:800}.summary-row small{color:var(--vp-c-text-2);line-height:1.45}.source-ledger{margin:16px 0 38px;border-top:1px solid var(--vp-c-divider)}.source-ledger article{min-width:0;padding:22px 2px 24px;border-bottom:1px solid var(--vp-c-divider)}.source-ledger h3{margin:0 0 6px;font-size:18px;line-height:1.35;overflow-wrap:anywhere}.source-ledger p{margin:12px 0;line-height:1.65}.source-ledger small{display:block;color:var(--vp-c-text-2);line-height:1.55;overflow-wrap:anywhere}.tags{display:flex;flex-wrap:wrap;gap:7px;margin:14px 0}.tags b,.tags span{padding:5px 9px;border-radius:999px;background:var(--vp-c-bg-soft);font-size:12px}.source-ledger a{font-weight:750;text-decoration:none}.notice-row{display:grid;grid-template-columns:auto minmax(0,1fr);gap:5px 10px;align-items:center;margin:16px 0;padding:11px 12px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg-soft)}.notice-row b{padding:3px 7px;border-radius:999px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1);font-size:11px}.notice-row small{grid-column:2}.source-exclusion{display:flex;flex-direction:column;gap:4px;margin:16px 0;padding:11px 12px;border-left:3px solid var(--vp-c-warning-1);background:var(--vp-c-bg-soft)}.source-exclusion span{color:var(--vp-c-text-2);font-size:12px}.channel-details{margin:11px 0;padding:10px 12px;border:1px solid var(--vp-c-divider);border-radius:10px}.channel-details.secondary{border-style:dashed}.channel-details summary{cursor:pointer;color:var(--vp-c-brand-1);font-weight:750}.channel-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.channel-links a{display:flex;min-width:0;flex-direction:column;gap:4px;padding:10px 11px;border-radius:8px;background:var(--vp-c-bg-soft);text-decoration:none}.channel-links a span{font-weight:750;overflow-wrap:anywhere}.channel-links a small{font-size:11px}.evidence-note{margin:10px 0!important;color:var(--vp-c-text-2);font-size:12px}
@media(max-width:699px){.summary-strip{grid-template-columns:1fr 1fr}.summary-head{display:none}.summary-row{grid-template-columns:1fr auto auto auto auto;gap:8px;padding:14px 2px}.summary-row strong{grid-column:1/-1}.summary-row small{grid-column:1/-1}.summary-row span:nth-of-type(1)::before{content:'对象 ';font-weight:500;color:var(--vp-c-text-2)}.summary-row span:nth-of-type(2)::before{content:'每日 ';font-weight:500;color:var(--vp-c-text-2)}.summary-row span:nth-of-type(3)::before{content:'每周 ';font-weight:500;color:var(--vp-c-text-2)}.summary-row span:nth-of-type(4)::before{content:'专项 ';font-weight:500;color:var(--vp-c-text-2)}.source-ledger article{padding:20px 2px 22px}.source-ledger h3{font-size:17px}.source-ledger .repo{font-size:16px;word-break:break-word}.channel-links{grid-template-columns:1fr}.notice-row{grid-template-columns:1fr}.notice-row small{grid-column:1}}
</style>
