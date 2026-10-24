#!/usr/bin/env python3
"""Generate the component guide using only Python stdlib + SVG/CSS box drawings.

Run from anywhere: python3 scripts/generate-component-readme.py
No rendering, browser, React, network, or font changes are needed.
"""
from pathlib import Path
from html import escape
import argparse
import base64
import json
import math
import re

ROOT = Path(__file__).resolve().parents[1]
INK, PAPER, ACCENT, MUTED = '#171917', '#fafaf7', '#ffd43b', '#74796e'

# Component | purpose | schematic geometry | three animation beats.
# The geometry is intentionally schematic; it does not claim pixel-perfect rendering.
ORIGINALS = '''
BarChart|比较不同类别的规模|bars|坐标框出现；柱子由零长高；数值标签显示
BulletChart|比较实际表现与目标|bullet|背景区间出现；实际条伸长；目标刻线显示
DivergingBarChart|比较正负两侧的变化|diverge|中轴出现；条形向左右展开；正负值显示
DotPlot|用同一坐标轴比较数值|dotplot|类别行出现；数据点依次显现；读数显示
GroupedBarChart|比较各类别中的多组指标|groupbars|类别框出现；同组双柱长高；图例补齐
LollipopChart|用细杆和圆点比较规模|lollipop|坐标框出现；细杆伸长；端点与标签出现
PairedBarChart|逐项比较两组并列数据|pairbars|类别行出现；两条分别展开；差值可读
ParetoChart|识别主要贡献项及累计贡献|pareto|降序柱出现；累计线绘出；累计比例显示
RankingChart|呈现有序排名和差距|ranking|排名行出现；横条依次伸长；名次与值显示
ScenarioBarChart|比较悲观、基准和乐观情景|scenario|三个情景框出现；情景柱长高；假设标签显示
TornadoChart|按影响大小比较敏感性|tornado|中心轴出现；双侧影响条展开；变量标签显示
VarianceComparisonChart|比较计划、实际及偏差|variance|计划框出现；实际条展开；偏差标签显示
BenchmarkBandChart|把指标放进基准区间比较|benchmark|基准带出现；实际走势绘出；区间关系可读
DumbbellChart|比较每项的两个端点|dumbbell|类别行出现；端点显示；连接杆展开
SlopeChart|比较两个时期的相对位置|slope|左右时点出现；连接线绘出；终点标签显示
SmallMultiples|用统一尺度比较多张小图|multiples|小图框依次出现；各自走势绘出；共同尺度显示
CompositionCompareChart|比较两组结构占比|comparestack|两组总量框出现；占比区块展开；结构标签显示
ContributionBarChart|拆解对总量的贡献|contribution|贡献行出现；分项条展开；总量框显示
DistributionBlocksChart|用区块呈现分配结构|blocks|总量框出现；分配块依次填充；比例标签显示
DonutChart|展示整体中的各部分占比|donut|环形底框出现；分段依次描出；中心总量显示
MarimekkoChart|同时比较类别规模与内部结构|mekko|总框出现；不同宽度的列展开；列内分段显现
NestedCompositionChart|展示整体、子项和孙项|nested|外层整体框出现；子框出现；内部细分显示
PictogramChart|用图标单元表现比例|pictogram|图标阵列出现；部分单元依次强调；份额标签显示
StackedBarChart|比较多个类别的构成|stacked|各类别底座出现；分段累计长高；图例显示
TreemapChart|用嵌套面积表示结构|treemap|总面积框出现；一级区块展开；子区块显示
WaffleChart|用等大方格表示份额|waffle|方格底图出现；份额单元依次填色；比例显示
WaterfallChart|从起点逐项桥接到终点|waterfall|起点柱出现；增减桥接条依次出现；终点总量显示
BeeswarmPlot|展示分布密度和聚集|beeswarm|分布轴出现；错位点群出现；聚集位置可读
BoxPlot|展示中位数、四分位和离群值|boxplot|数轴出现；箱体与须线展开；中位数和离群点显示
BubbleChart|用位置和气泡大小展示三维指标|bubble|坐标框出现；气泡依次放大；标签显示
CalendarHeatmap|按日历位置查看活动强度|calendar|周列与日期格出现；日期格分批着色；强度图例显示
CohortMatrix|比较各批次的留存或迁移|cohort|批次与期间出现；三角矩阵展开；深浅数值显示
DotStripPlot|用条带点阵展示密度|strip|条带底框出现；点依次显现；密集区域可读
Heatmap|比较二维矩阵中的强弱|heatmap|行列框出现；单元格依次着色；高值单元强调
Histogram|查看连续变量的分箱分布|histogram|分箱轴出现；相邻柱从零长高；峰值区间显示
PopulationPyramid|对照两组人群的年龄结构|pyramidbars|中心年龄轴出现；双侧分组条展开；组别标签显示
RidgelinePlot|比较多组分布曲线|ridges|分组基线出现；密度轮廓依次绘出；峰值差异可读
ScatterPlot|查看两个连续变量的关系|scatter|双轴出现；散点分批显现；标签或异常点突出
ParallelCoordinates|比较对象在多个维度的表现|parallel|维度竖轴出现；多维折线绘出；重点对象强调
QuadrantScatterChart|把定量对象放进四象限|quadrants|象限框出现；数据点显现；象限含义和标签显示
RadarChart|比较多个维度的能力画像|radar|雷达轴框出现；能力多边形绘出；维度标签显示
AnnotatedLineChart|把事件标注放在趋势线上|annotated|走势框出现；折线绘出；事件框和指引线出现
AreaChart|呈现随时间变化的规模|area|时间轴出现；面积和边线展开；最新值显示
BumpChart|展示排名随时间的变化|bump|排名轴出现；多条排名路径绘出；末端名次显示
CandlestickChart|展示开高低收价格变化|candles|时间轴出现；影线依次绘出；蜡烛实体显现
ConnectedScatterPlot|展示二维指标随时间的路径|connected|坐标框出现；散点依次出现；时间路径连起
DualAxisChart|同时观察柱与线两种量纲|dualaxis|双侧刻度出现；柱子长高；另一指标折线绘出
EventStudyChart|观察事件前后的变化|event|事件分界出现；前后走势绘出；事件窗口强调
IndexedComparisonChart|统一起点比较同业表现|ribbon|统一基点出现；多组走势绘出；末端比较带显示
IndexedLineChart|把多组序列统一到基准指数|multiline|基准轴出现；多条指数线绘出；末端指数显示
LineChart|展示一组时间趋势|line|时间框出现；折线从左向右绘出；末端值显示
MultiLineChart|比较多组时间序列|multiline|统一坐标出现；多条线依次绘出；图例和末端值显示
StackedAreaChart|观察结构随时间的变化|stackarea|时间轴出现；多层面积展开；构成图例显示
ForecastFanChart|展示预测和不确定性扇区|fan|历史线出现；预测分界出现；扇形范围逐层展开
RangeBandChart|展示序列的上下界区间|range|时间框出现；区间带展开；中心走势绘出
BalanceSheetDiagram|比较资产与负债权益|balance|资产与资金来源框出现；分层区块显现；两侧合计显示
CapitalStackDiagram|展示资本结构及清偿层级|capital|资本总框出现；各层堆叠；层级和比例显示
FlowDiagram|说明顺序流程|flow|起点框出现；连线绘出；后续节点依次出现
FunnelDiagram|展示转化漏斗各环节|funnel|首层出现；后续层逐层收窄；环节数值显示
SankeyDiagram|用连带宽度表示流量|sankey|两侧节点出现；不同宽度流带绘出；流向标签显示
TwoSidedMarketplaceDiagram|解释平台两端和资金流|marketplace|平台框出现；供需两侧显现；双向连线绘出
UnitEconomicsDiagram|拆解单元收入、成本和利润|unit|单元收入框出现；成本项展开；利润框显示
ValueChainDiagram|说明价值链及各环节捕获|valuechain|环节框依次出现；链路绘出；价值捕获条显示
ValueChainMap|查看价值链各环节中的参与者|valuemap|阶段列出现；参与者卡片显现；阶段链路绘出
HierarchyPyramid|展示分层结构及优先级|pyramid|底层出现；各层向上展开；层级标签显示
OrganizationTree|展示组织汇报关系|tree|根节点出现；分支连线绘出；岗位节点依次出现
OwnershipTree|展示持股与控制关系|ownership|持有人节点出现；持股分支绘出；被投主体和比例显示
CapabilityVennDiagram|比较能力集合及重叠|venn|第一个集合出现；后续集合叠入；交集区域强调
CausalGraph|解释带正负方向的因果关系|causal|原因节点出现；带符号连线绘出；结果节点显示
CompetitiveLandscapeDiagram|展示竞争者分区与位置|landscape|竞争分区框出现；主体卡片显现；重点主体强调
EcosystemMap|展示中心主体与生态伙伴|ecosystem|中心框出现；外围伙伴框出现；辐射关系连起
RelationshipGraph|呈现实体之间的网络关系|network|主要节点出现；关系线绘出；其他实体补齐
RivalryNetworkDiagram|展示竞争关系与对手网络|rivalry|竞争主体出现；对手连线绘出；核心竞争关系强调
BridgeToTarget|说明从现状到目标的路径|bridge|现状与目标出现；中间行动桥展开；目标值强调
IssueTree|把问题逐层拆解|tree|核心问题出现；一层分支展开；子问题依次显示
MetricDriverTree|解释指标的定量驱动因素|drivers|目标指标出现；驱动分支绘出；叶子指标显示
ScenarioTree|展示不同决策和情景分支|scenariotree|当前节点出现；情景路径绘出；终点假设显示
StrategicRoadmap|把战略行动放到阶段时间轴上|roadmap|阶段列出现；行动框分批出现；后期目标显示
SwimlaneDiagram|展示角色在各阶段的任务|swimlane|角色泳道出现；任务框依次出现；跨道交接线绘出
OpportunityMatrix|比较机会大小与胜出能力|quadrants|机会象限出现；机会框显现；重点机会强调
PrioritizationMatrix|按价值和投入安排优先级|quadrants|优先级象限出现；事项框显现；高优先事项强调
RiskMatrix|比较风险概率和影响|risk|风险格阵出现；风险点显现；高风险区域强调
StrategyMatrix|用定性四象限整理战略|matrix|四象限出现；各策略卡片显现；重点策略强调
ImageCard|呈现图片与说明卡片|image|图片占位框出现；说明条出现；完整卡片停留
LogoCloud|展示品牌或公司标识阵列|logos|阵列底框出现；标识框依次出现；完整阵列停留
MapCallout|在地图位置标出重点信息|map|地图线框出现；地点点位显现；引线和说明框出现
QuoteCard|突出一段引语及说话人|quote|引语框出现；引语文字分块出现；作者与来源显示
ScreenshotZoom|放大截图中的证据区域|zoom|截图框出现；重点区域标出；区域放大展示
FactGrid|以网格组织多项事实数据|facts|事实卡片框出现；数字依次显现；说明补齐
HeroMetric|突出一个核心数字和增长率|metric|公司与指标出现；数字由零变化；增幅和来源显示
MetricGrid|并列查看多个关键指标|kpis|指标卡框依次出现；数值变化；变化率显示
ShareMetric|突出单个份额或百分比|share|份额框出现；百分比变化；占比条展开
SplitMetric|并列展示两组核心数字|splitmetric|左右数字框出现；两边数字变化；组别说明显示
BeforeAfterCompare|比较变化前后的状态|beforeafter|变化前框出现；变化后框出现；差异区域强调
BulletReveal|逐条解释论据或步骤|bullets|标题框出现；条目依次上移显现；完整列表停留
CompareCards|以双卡片对比对象|compare|左卡出现；右卡出现；对照标签显示
EquationCards|把商业关系拆成公式|equation|输入项框依次出现；运算符显现；结果框显示
ExecutiveSummary|呈现结论与关键支持点|summary|结论框出现；支持点依次显现；完整摘要停留
KeyTakeaway|突出一个核心结论|takeaway|强调框出现；核心句显现；补充解释显示
PageFlipChoice|通过翻页呈现二选一|flip|第一张选项卡出现；卡面翻转；另一选项显示
SideBySideCompare|比较两组数值和变化|comparemetric|左右对象框出现；数值与对比条展开；差值显示
Timeline|按时间呈现关键事件|timeline|时间线绘出；节点依次出现；事件框显示
PresenterOrbitOverlay|在主持人周围展示辅助卡片|orbit|人物占位出现；周边卡片依次显现；连接与强调显示
TickerOverlay|在画面底部连续展示行情|ticker|透明画布保留；行情条出现；行情从右向左移动
BenchmarkScorecard|按同一标准比较多家主体|scorecard|行列框出现；评分依次显现；基准或领先项强调
CapabilityHeatmap|比较主体在各能力上的强弱|heatmap|能力和主体表头出现；评分格着色；重点能力强调
DistributionComparisonTable|比较两组分配结构明细|distributiontable|行列框出现；两组分配条展开；差异数值显示
MetricTable|精确展示指标和数值|table|表头出现；数据行依次显现；关键数值强调
SparklineTable|在表格里展示各行趋势|sparktable|数据行出现；行内趋势线绘出；末端值显示
'''

CSS = '''
svg .a{animation:fm-enter 4.8s ease both infinite;animation-delay:var(--d,0s);transform-box:fill-box;transform-origin:center}
svg .gx{animation:fm-x 4.8s cubic-bezier(.2,.8,.2,1) both infinite;animation-delay:var(--d,0s);transform-box:fill-box;transform-origin:left center}
svg .gy{animation:fm-y 4.8s cubic-bezier(.2,.8,.2,1) both infinite;animation-delay:var(--d,0s);transform-box:fill-box;transform-origin:center bottom}
svg .dr{stroke-dasharray:1;animation:fm-draw 4.8s ease both infinite;animation-delay:var(--d,0s)}
svg .pan{animation:fm-pan 4.8s linear infinite}
svg .zoom{animation:fm-zoom 4.8s ease both infinite;transform-box:fill-box;transform-origin:center}
svg .flip{animation:fm-flip 4.8s ease both infinite;transform-box:fill-box;transform-origin:center}
svg .n0{animation:fm-n0 4.8s linear infinite}svg .n1{animation:fm-n1 4.8s linear infinite}svg .n2{animation:fm-n2 4.8s linear infinite}
svg .theme>rect{animation:fm-theme 4.8s steps(1,end) infinite}
svg .seek{animation:fm-seek 4.8s linear infinite;transform-box:fill-box;transform-origin:left}
@keyframes fm-enter{0%,3%{opacity:0;transform:translateY(9px)}22%,89%{opacity:1;transform:translateY(0)}99%,100%{opacity:0;transform:translateY(0)}}
@keyframes fm-x{0%,5%{transform:scaleX(0);opacity:0}27%,89%{transform:scaleX(1);opacity:1}99%,100%{transform:scaleX(1);opacity:0}}
@keyframes fm-y{0%,5%{transform:scaleY(0);opacity:0}27%,89%{transform:scaleY(1);opacity:1}99%,100%{transform:scaleY(1);opacity:0}}
@keyframes fm-draw{0%,8%{stroke-dashoffset:1;opacity:0}12%{opacity:1}48%,89%{stroke-dashoffset:0;opacity:1}99%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes fm-pan{from{transform:translateX(0)}to{transform:translateX(-480px)}}
@keyframes fm-zoom{0%,15%{transform:scale(.9);opacity:0}30%{opacity:1;transform:scale(1)}65%,89%{opacity:1;transform:scale(1.14)}100%{opacity:0;transform:scale(1.14)}}
@keyframes fm-flip{0%,4%{transform:scaleX(.02);opacity:0}23%,47%{transform:scaleX(1);opacity:1}57%{transform:scaleX(.02);opacity:1}73%,89%{transform:scaleX(1);opacity:1}100%{opacity:0}}
@keyframes fm-n0{0%,13%{opacity:1}14%,100%{opacity:0}}@keyframes fm-n1{0%,13%{opacity:0}14%,28%{opacity:1}29%,100%{opacity:0}}@keyframes fm-n2{0%,28%{opacity:0}29%,90%{opacity:1}99%,100%{opacity:0}}
@keyframes fm-theme{0%,32%{fill:#fff8cf}33%,65%{fill:#e5f2fa}66%,100%{fill:#e9f1df}}
@keyframes fm-seek{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;stroke-dashoffset:0!important}svg .n0,svg .n1{display:none}}
'''

def text(x, y, value, size=16, fill=INK, anchor='start', cls='', delay=0):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" class="{cls}" style="--d:{delay}s">{escape(str(value))}</text>'

def rect(x, y, w, h, label='', fill='white', cls='a', delay=0, size=17, dashed=False):
    r = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="{fill}" stroke="{INK}" stroke-width="1.6"'+(' stroke-dasharray="5 4"' if dashed else '')+'/>'
    if label:
        r += text(x+w/2, y+h/2+size*.35, label, size, anchor='middle')
    return f'<g class="{cls}" style="--d:{delay}s">{r}</g>'

def path(d, color=INK, width=2.6, delay=0, fill='none', cls='dr'):
    return f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{width}" pathLength="1" class="{cls}" style="--d:{delay}s" stroke-linejoin="round" stroke-linecap="round"/>'

def line(x1,y1,x2,y2,delay=0,color=INK,width=2):
    return path(f'M{x1} {y1} L{x2} {y2}',color,width,delay)

def dot(x,y,r=7,delay=0,fill=ACCENT):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="1.5" class="a" style="--d:{delay}s"/>'

def axes():
    return line(70,85,70,275)+line(70,275,658,275)+''.join(line(70,y,658,y,0,'#dce0d6',1) for y in (125,175,225))

def counters(x=108,y=205,size=68, suffix='B'):
    return ''.join(text(x,y,v+suffix,size,cls='n'+str(i)) for i,v in enumerate(['0.0','6.2','12.8']))

def tiles(cols=3,rows=2,labels=None,start=(66,92),cell=(180,74),gap=18):
    s=''
    for i in range(cols*rows):
        x=start[0]+(i%cols)*(cell[0]+gap); y=start[1]+(i//cols)*(cell[1]+gap)
        s+=rect(x,y,*cell,(labels or [])[i] if labels and i<len(labels) else f'ITEM {i+1}',ACCENT if i==0 else 'white',delay=i*.1)
    return s

def geometry(p, name):
    s=''
    if p in ('bars','histogram','groupbars','scenario','pareto','dualaxis'):
        s=axes()
        vals=[74,123,160,111,85] if p=='histogram' else [173,132,102,82,50] if p=='pareto' else [82,132,102,173,145]
        if p=='scenario': vals=[75,123,168]
        step=550/len(vals)
        for i,h in enumerate(vals):
            x=94+i*step; w=step-(3 if p=='histogram' else 31)
            if p=='groupbars':
                s+=rect(x,275-h,w/2-3,h,fill=ACCENT,cls='gy',delay=i*.1)+rect(x+w/2,275-h*.72,w/2-3,h*.72,fill='#bfc8b4',cls='gy',delay=.15+i*.1)
            else: s+=rect(x,275-h,w,h,fill=ACCENT if i==0 else '#cbd2c2',cls='gy',delay=i*.1)
            s+=text(x+w/2,295,['BEAR','BASE','BULL'][i] if p=='scenario' else chr(65+i),13,anchor='middle',cls='a',delay=.5)
        if p in ('pareto','dualaxis'):s+=path('M110 230 L220 175 L330 142 L440 106 L605 91',INK,3,.55)
        return s
    if p in ('ranking','pairbars','bullet','variance','dotplot','lollipop','contribution'):
        for i,w in enumerate([410,330,250,175]):
            y=88+i*48
            s+=text(60,y+22,f'#{i+1}' if p=='ranking' else chr(65+i),15)
            if p=='bullet':
                s+=rect(105,y,470,26,fill='#e5e9de',cls='a')+rect(105,y+6,w,14,fill=ACCENT,cls='gx',delay=i*.1)+line(495,y-5,495,y+31,.7)
            elif p in ('dotplot','lollipop'):
                s+=line(105,y+16,615,y+16,0,'#d8ddd1',1)
                if p=='lollipop':s+=line(105,y+16,105+w,y+16,i*.1)
                s+=dot(105+w,y+16,9,i*.1)
            elif p=='variance':
                s+=rect(105,y,450,28,fill='#edf0e7',dashed=True)+rect(105,y+5,w,18,fill=ACCENT,cls='gx',delay=i*.1)+text(585,y+22,'− / +',14,cls='a',delay=.65)
            elif p=='pairbars':
                s+=rect(105,y,w,13,fill=ACCENT,cls='gx',delay=i*.1)+rect(105,y+17,w*.8,13,fill='#bfc8b4',cls='gx',delay=i*.1+.18)
            else:s+=rect(105,y,w,30,fill=ACCENT if i==0 else '#ccd4c0',cls='gx',delay=i*.1)+text(118+w,y+22,str(84-i*16),14,cls='a',delay=.65)
        if p=='contribution':s+=rect(590,98,72,168,'TOTAL',ACCENT,delay=.8,size=13)
        return s
    if p in ('diverge','tornado','pyramidbars'):
        s=line(360,75,360,284)
        for i in range(5):
            y=85+i*38; w=180-i*21 if p=='tornado' else [70,115,180,144,92][i]
            s+=rect(360-w,y,w,24,fill='#c2ccb5',cls='gx',delay=i*.1)+rect(360,y,w*.88,24,fill=ACCENT,cls='gx',delay=i*.1)
        return s+text(192,305,'GROUP A / −',13)+text(396,305,'GROUP B / +',13)
    if p in ('donut','share'):
        if p=='share':return rect(80,92,560,172,fill='white')+counters(175,200,80,'%')+rect(112,235,420,12,fill=ACCENT,cls='gx',delay=.4)
        s='<circle cx="300" cy="181" r="82" fill="none" stroke="#e1e5da" stroke-width="38"/>'
        for d,c,delay in [('M300 99 A82 82 0 0 1 371 222',ACCENT,.1),('M371 222 A82 82 0 0 1 229 222','#b7c3a5',.35),('M229 222 A82 82 0 0 1 300 99',INK,.6)]:s+=path(d,c,38,delay)
        return s+text(300,190,'100%',26,anchor='middle',cls='a',delay=.7)+rect(450,114,160,42,'PART A',ACCENT,delay=.5)+rect(450,174,160,42,'PART B',delay=.7)
    if p in ('stacked','comparestack','mekko','capital','balance'):
        if p in ('capital','balance'):
            xs=[150,390] if p=='balance' else [265]
            for k,x in enumerate(xs):
                for i,h in enumerate([70,65,55]):s+=rect(x,85+sum([70,65,55][:i]),170,h,['ASSET','DEBT','EQUITY'][i] if p=='balance' else ['SENIOR','JUNIOR','EQUITY'][i],['#c5cfb8','white',ACCENT][i],delay=(i+k)*.16)
            return s
        n=2 if p=='comparestack' else 4; xx=90
        for i in range(n):
            w=220 if n==2 else ([80,190,120,160][i] if p=='mekko' else 94)
            for j,h in enumerate([50+10*i,65,65-8*i]):s+=rect(xx,270-sum([50+10*i,65,65-8*i][:j+1]),w,h,fill=[ACCENT,'#bdc8ad','white'][j],cls='gy',delay=i*.12+j*.1)
            xx+=w+(45 if n==2 else 15)
        return s
    if p in ('blocks','nested','treemap'):
        s=rect(72,86,576,196,fill='#edf0e7',cls='')
        if p=='blocks':return s+''.join(rect(84+i*113,102,105,164,f'{(i+1)*8}%',ACCENT if i==0 else 'white',delay=i*.16) for i in range(5))
        s+=rect(84,98,240,172,'GROUP A',ACCENT,delay=.1)+rect(336,98,298,76,'GROUP B',delay=.3)
        if p=='nested':s+=rect(355,204,110,50,'B1',fill='#c4ceb6',delay=.5)+rect(475,204,140,50,'B2',delay=.7)
        else:s+=rect(336,186,132,84,'C',fill='#c4ceb6',delay=.5)+rect(480,186,154,84,'D',delay=.7)
        return s
    if p in ('waffle','pictogram','heatmap','calendar','cohort','risk'):
        cols=12 if p=='calendar' else 10 if p in ('waffle','pictogram') else 6
        rows=7 if p=='calendar' else 5; cell=26 if p=='calendar' else min(40,520/cols); ox=(720-cols*(cell+5))/2
        for y in range(rows):
            for x in range(cols):
                if p=='cohort' and x>cols-y-1:continue
                i=y*cols+x; c=ACCENT if (i<cols*rows*.42 if p in ('waffle','pictogram') else (x*3+y*7)%6>3) else '#e2e6d9'
                if p=='pictogram':s+=dot(ox+x*(cell+5)+cell/2,95+y*(cell+2)+cell/2,cell*.32,i*.012,c)
                else:s+=rect(ox+x*(cell+5),85+y*(cell+2),cell,cell,fill=c,delay=i*.014)
        return s
    if p=='waterfall':
        ys=[178,143,116,116,151,195];hs=[97,35,27,35,44,80];levels=[178,143,116,151,195]
        for i,(y,h) in enumerate(zip(ys,hs)):
            x=85+i*92;s+=rect(x,y,65,h,fill=ACCENT if i in (0,5) else '#c3cdb7',cls='gy',delay=i*.17)
            if i<5:s+=line(x+65,levels[i],x+92,levels[i],.2+i*.17)
        return s+line(70,275,658,275)
    if p in ('scatter','bubble','strip','beeswarm','connected'):
        s=axes() if p not in ('strip','beeswarm') else line(70,245,655,245)
        points=[(110,235),(170,215),(190,177),(250,204),(310,155),(340,180),(420,125),(465,145),(520,111),(590,105)]
        if p in ('strip','beeswarm'):points=[(120+i*43,185+(i%3-1)*(18 if p=='beeswarm' else 3)) for i in range(12)]
        if p=='connected':s+=path('M'+' L'.join(f'{x} {y}' for x,y in points),INK,2,.7)
        for i,(x,y) in enumerate(points):s+=dot(x,y,10+i%4*5 if p=='bubble' else 6,i*.08,ACCENT if i%3==0 else '#c2ccb5')
        return s
    if p=='boxplot':
        s=line(80,276,650,276)
        for i in range(3):
            y=110+i*65;x=170+i*35
            s+=line(x-65,y,x+255,y,i*.15)+line(x-65,y-15,x-65,y+15,i*.15)+line(x+255,y-15,x+255,y+15,i*.15)+rect(x,y-20,160,40,fill=ACCENT if i==0 else 'white',cls='gx',delay=i*.15)+line(x+75,y-20,x+75,y+20,.5+i*.15)+dot(x+292,y,4,.8)
        return s
    if p in ('line','multiline','area','stackarea','range','fan','annotated','event','ribbon','benchmark','ridges'):
        s=axes();d='M80 247 L165 224 L250 235 L335 172 L420 185 L505 129 L635 96'
        if p in ('range','fan','benchmark'):s+=path('M80 218 L165 197 L250 208 L335 143 L420 130 L505 82 L635 65 L635 165 L505 176 L420 219 L335 205 L250 261 L165 250 L80 271 Z','#b9c7a7',1,0,'#e1e9d7','a')
        if p in ('area','stackarea'):s+=path(d+' L635 275 L80 275 Z','#c9d6b6',1,.1,'#dfe8d3','gx')
        if p=='stackarea':s+=path('M80 250 L210 235 L340 233 L470 205 L635 186 L635 275 L80 275 Z',INK,1,.3,ACCENT,'gx')
        s+=path(d,INK,3.2,.12)
        if p in ('multiline','ribbon'):s+=path('M80 247 L165 215 L250 199 L335 215 L420 164 L505 171 L635 140','#879675',3,.35)+path('M80 247 L165 240 L250 253 L335 233 L420 214 L505 218 L635 196','#a09065',2.4,.55)
        if p in ('annotated','event','fan'):s+=line(420,85,420,275,.45,MUTED,1)+rect(440,84,175,39,'EVENT' if p!='fan' else 'FORECAST',ACCENT,delay=.8,size=14)
        if p=='ridges':
            s=''
            for i in range(4):s+=path(f'M85 {125+i*45} Q{200+i*44} {30+i*45} 380 {125+i*45} Q500 {160+i*45} 635 {125+i*45}',INK,2,i*.2)
        return s
    if p in ('slope','dumbbell','bump','parallel'):
        if p=='dumbbell':
            for i in range(4):s+=line(160+i*25,105+i*48,520-i*22,105+i*48,i*.15)+dot(160+i*25,105+i*48,8,i*.15)+dot(520-i*22,105+i*48,8,.4+i*.15,'white')
        else:
            xs=[130,340,590] if p in ('parallel','bump') else [150,575]
            for x in xs:s+=line(x,85,x,280,0,'#d3d9c9',1)
            for i,ys in enumerate([[110,200,145],[182,130,247],[254,254,102]]):
                pts=list(zip(xs,ys if len(xs)==3 else [ys[0],ys[-1]]));s+=path('M'+' L'.join(f'{x} {y}' for x,y in pts),[INK,'#8b9977','#bca535'][i],3,i*.18)
                for x,y in pts:s+=dot(x,y,5,.5+i*.15)
        return s
    if p=='candles':
        s=axes()
        for i in range(9):
            x=108+i*59;y=150+math.sin(i)*37;h=24+(i%3)*14
            s+=line(x,y-29,x,y+h+25,i*.1)+rect(x-13,y,26,h,fill=ACCENT if i%3 else '#c0c9b5',cls='gy',delay=i*.1)
        return s
    if p=='multiples':
        for i in range(6):
            x=70+i%3*200;y=88+i//3*105;s+=rect(x,y,180,88,fill='white',delay=i*.1)+path(f'M{x+12} {y+70} L{x+55} {y+48} L{x+98} {y+59} L{x+158} {y+22}',INK,2,.25+i*.1)
        return s
    if p=='radar':
        pts=lambda r:' '.join(f'{360+math.sin(a*math.pi/3)*r:.1f},{180-math.cos(a*math.pi/3)*r:.1f}' for a in range(6))
        for r in [45,90]:s+=f'<polygon points="{pts(r)}" fill="none" stroke="#cbd3c1"/>'
        for a in range(6):s+=line(360,180,360+math.sin(a*math.pi/3)*100,180-math.cos(a*math.pi/3)*100,0,'#cbd3c1',1)
        return s+path('M360 100 L415 148 L430 221 L360 245 L286 224 L305 149 Z',INK,2,.25,ACCENT)
    if p in ('quadrants','matrix','landscape'):
        s=rect(100,77,520,212,fill='#f1f3eb',cls='')+line(360,77,360,289)+line(100,183,620,183)
        for i,(x,y) in enumerate([(158,108),(412,108),(158,214),(412,214)]):
            s+=rect(x,y,145,43,['OPTION A','OPTION B','OPTION C','OPTION D'][i],ACCENT if i==1 else 'white',delay=.15+i*.18,size=13)
        return s
    if p in ('tree','ownership','drivers','scenariotree','causal'):
        s=rect(70,148,135,62,'ROOT',ACCENT)
        for i,y in enumerate([94,213]):
            s+=path(f'M205 179 C250 179 230 {y+27} 285 {y+27}',INK,2,.18+i*.12)+rect(285,y,140,54,'FACTOR '+str(i+1),delay=.4+i*.12,size=14)
            for j,yy in enumerate([y-18,y+40]):s+=path(f'M425 {y+27} L495 {yy+18}',INK,2,.65)+rect(495,yy,148,36,('60% / +' if p in ('ownership','causal') else 'LEAF '+str(j+1)),delay=.8+j*.12,size=13)
        return s
    if p in ('network','rivalry','ecosystem','marketplace','orbit'):
        s=rect(286,150,148,66,'PRESENTER' if p=='orbit' else 'CENTER',ACCENT)
        points=[(87,89),(519,89),(87,233),(519,233)]
        for i,(x,y) in enumerate(points):s+=line(360,183,x+57,y+22,.3+i*.1)+rect(x,y,114,44,f'NODE {i+1}',delay=.5+i*.13,size=13)
        if p in ('network','rivalry'):s+=line(144,111,576,111,.8)+line(144,255,576,255,.9)
        return s
    if p=='venn':
        for i,(x,y) in enumerate([(310,155),(410,155),(360,215)]):s+=f'<circle cx="{x}" cy="{y}" r="73" fill="{[ACCENT,"#b8c8a5","#e0ddd1"][i]}" fill-opacity=".55" stroke="{INK}" class="a" style="--d:{i*.25}s"/>'
        return s+text(360,187,'A ∩ B ∩ C',17,anchor='middle',cls='a',delay=.8)
    if p in ('flow','valuechain','bridge','unit','equation'):
        labels=['INPUT','ACTION','OUTPUT'] if p not in ('unit','equation') else ['REVENUE','COST','PROFIT']
        for i,label in enumerate(labels):
            x=70+i*210;s+=rect(x,132,158,92,label,ACCENT if i==2 else 'white',delay=i*.23,size=16)
            if i<2:s+=text(x+184,185,('−' if i==0 else '=') if p in ('unit','equation') else '→',27,anchor='middle',cls='a',delay=.3+i*.23)
            if p=='valuechain':s+=rect(x,244,158*(.4+i*.2),15,fill=ACCENT,cls='gx',delay=.65)
        return s
    if p in ('funnel','pyramid'):
        widths=[520,400,280,160]
        if p=='pyramid':widths.reverse()
        for i,w in enumerate(widths):s+=rect((720-w)/2,82+i*52,w,44,f'STAGE {i+1}',ACCENT if i==0 else '#e3e8db',delay=i*.22)
        return s
    if p=='sankey':
        s=rect(75,85,90,75,'A',ACCENT)+rect(75,212,90,65,'B',delay=.1)+rect(560,85,90,75,'C',delay=.2)+rect(560,212,90,65,'D',delay=.2)
        for i,(y1,y2,w) in enumerate([(112,112,22),(133,240,12),(240,133,15),(253,255,20)]):s+=path(f'M165 {y1} C330 {y1} 380 {y2} 560 {y2}', '#b7c4a5' if i%2 else '#ddc23d',w,.25+i*.15)
        return s
    if p in ('roadmap','swimlane','valuemap'):
        for i in range(3):s+=text(155+i*205,86,['PHASE 1','PHASE 2','PHASE 3'][i],14,anchor='middle')+line(52,110+i*65,660,110+i*65,0,'#cbd3c0',1)
        for i in range(6):
            x=75+i%3*205;y=117+i//3*77;s+=rect(x,y,158,48,f'{"ROLE" if p=="swimlane" else "TASK"} {i+1}',ACCENT if i==0 else 'white',delay=i*.14,size=14)
        return s
    if p=='map':return path('M105 165 L163 94 L250 117 L322 85 L407 127 L465 105 L604 170 L550 239 L440 214 L351 272 L252 222 L172 245 Z','#9fac8f',2,0,'#e7ecdf','a')+dot(405,153,9,.4)+line(413,153,485,135,.6)+rect(485,100,140,54,'LOCATION',ACCENT,delay=.8,size=13)
    if p in ('table','sparktable','scorecard','distributiontable'):
        s=rect(72,80,576,36,'METRIC          CURRENT          PRIOR',ACCENT,delay=0,size=14)
        for i in range(4):
            y=122+i*42;s+=rect(72,y,576,37,fill='white',delay=.14+i*.13)+text(90,y+24,f'ITEM {i+1}',14,cls='a',delay=.2+i*.13)
            if p=='sparktable':s+=path(f'M300 {y+28} L345 {y+19} L390 {y+23} L440 {y+8}',INK,2,.5+i*.12)
            elif p=='distributiontable':s+=rect(300,y+9,120-i*18,10,fill=ACCENT,cls='gx',delay=.4)+rect(450,y+9,100+i*12,10,fill='#c4cfb7',cls='gx',delay=.6)
            else:s+=text(380,y+24,f'{84-i*12}.2',15,anchor='middle',cls='a',delay=.4+i*.13)
            s+=text(585,y+24,f'{72-i*9}.0',15,anchor='end',cls='a',delay=.55+i*.13)
        return s
    if p in ('metric','splitmetric','comparemetric','kpis','facts','earnings'):
        if p=='metric':return text(95,115,'HEADLINE METRIC',18,cls='a')+counters()+rect(110,235,165,39,'+18.2% YoY',ACCENT,delay=.6,size=16)
        if p in ('kpis','facts','earnings'):return tiles(3,2,labels=['REVENUE','PROFIT','GROWTH','MARGIN','CASH','OUTLOOK'])
        return rect(70,92,270,184,fill='white')+rect(380,92,270,184,fill='#fff8cf',delay=.18)+text(95,125,'BEFORE / A',15,cls='a')+text(405,125,'AFTER / B',15,cls='a',delay=.18)+counters(95,218,47)+counters(405,218,47)
    if p in ('compare','beforeafter','flip','image','zoom','presenter'):
        if p in ('image','zoom'):return rect(98,82,524,207,fill='#e7ebdf')+path('M125 238 L245 127 L346 215 L425 156 L590 261',INK,2,.3)+rect(330,126,140,88,'FOCUS',ACCENT,cls='zoom' if p=='zoom' else 'a',delay=.45,size=15)
        if p=='presenter':return rect(75,84,220,207,'PRESENTER',fill='#e8eddf')+rect(330,92,310,68,'KEY POINT 1',ACCENT,delay=.25)+rect(330,176,310,68,'KEY POINT 2',delay=.5)+rect(95,252,180,27,'NAME / ROLE',ACCENT,delay=.7,size=12)
        return rect(82,100,248,162,'BEFORE / OPTION A',cls='flip' if p=='flip' else 'a',size=15)+rect(390,100,248,162,'AFTER / OPTION B',ACCENT,delay=.3,size=15)+text(360,190,'→',28,anchor='middle',cls='a',delay=.45)
    if p in ('logos','newsgrid'):return tiles(3 if p=='logos' else 2,2,start=(65 if p=='logos' else 88,90),cell=(180 if p=='logos' else 258,76),labels=None)
    if p in ('bullets','summary','sources'):
        for i in range(4):s+=rect(85,84+i*51,36,36,str(i+1),ACCENT,delay=i*.22,size=14)+rect(136,84+i*51,490,36,['KEY POINT / EVIDENCE','DETAIL / CONTEXT','EXPLANATION / SOURCE','CONCLUSION / NEXT'][i],delay=.1+i*.22,size=14)
        return s
    if p in ('quote','takeaway','opener','chapter','headline','endcard'):
        s=rect(80,91,560,185,fill='#fff8cf' if p in ('takeaway','headline') else 'white')
        s+=text(108,126,{'quote':'“ QUOTE','takeaway':'KEY TAKEAWAY','opener':'CHANNEL / EPISODE','chapter':'CHAPTER 02','headline':'BREAKING / HEADLINE','endcard':'NEXT EPISODE'}[p],17,cls='a')
        s+=rect(110,153,460,25,fill=INK,cls='gx',delay=.15)+rect(110,193,350,17,fill='#aab49d',cls='gx',delay=.35)+text(110,249,'AUTHOR / SOURCE' if p=='quote' else 'CONTEXT / SUBTITLE',14,cls='a',delay=.6)
        return s
    if p=='timeline':
        s=line(90,177,630,177)
        for i in range(4):s+=dot(110+i*165,177,8,i*.2)+rect(70+i*165,101 if i%2==0 else 209,125,43,f'EVENT {i+1}',ACCENT if i==0 else 'white',delay=.25+i*.2,size=13)
        return s
    if p=='ticker':
        s=rect(57,85,606,160,'TRANSPARENT VIDEO AREA',fill='#edf0e6',dashed=True,size=17)
        s+='<svg x="58" y="255" width="604" height="38" viewBox="0 0 604 38" overflow="hidden"><g class="pan">'
        for i in range(5):s+=rect(i*240,0,240,36,'INDEX '+str(i%2+1)+'  +1.2%',ACCENT if i%2==0 else 'white',cls='',size=14)
        return s+'</g></svg>'
    if p in ('frame','sceneframe','overlay','structural','episode','brand','dispatch','legacy'):
        if p=='episode':return rect(76,118,172,119,'SCENE 01',ACCENT)+rect(272,118,172,119,'SCENE 02',delay=.5)+rect(468,118,172,119,'SCENE 03',delay=1)+line(80,270,640,270,.2)
        if p=='brand':return rect(94,94,530,184,'BRAND TOKENS → CHILDREN',cls='theme',size=19)+rect(119,220,150,32,'COLOR',ACCENT,delay=.3,size=13)+rect(287,220,150,32,'TYPE',delay=.5,size=13)+rect(455,220,142,32,'SHAPE',delay=.7,size=13)
        if p in ('dispatch','legacy'):return rect(90,126,184,100,'type / ID',ACCENT)+line(274,176,370,176,.3)+rect(390,126,240,100,'SCENE COMPONENT',delay=.5,size=15)
        s=rect(65,77,590,220,fill='white',cls='',dashed=p=='overlay')+rect(89,97,250,25,'HEADER / BRAND',ACCENT,delay=.1,size=12)+rect(89,139,540,99,'CHILDREN / CONTENT',delay=.35)+rect(89,256,340,22,'SOURCE / FOOTER',delay=.7,size=11)
        if p=='structural':s=geometry('tree',name)
        return s
    if p=='edge':return rect(92,140,150,70,'NODE A',ACCENT)+path('M242 175 C340 175 370 215 470 215',INK,3,.25)+rect(470,180,150,70,'NODE B',delay=.65)
    if p=='gridlines':return axes()
    if p=='header':return rect(85,100,220,25,'EYEBROW',ACCENT,delay=0,size=13)+rect(85,153,536,45,'MAIN TITLE',delay=.15,size=25)+rect(85,220,405,30,'SUBTITLE / EXPLANATION',delay=.4,size=14)
    if p=='source':return rect(80,88,560,147,'CONTENT',cls='')+rect(80,258,455,28,'SOURCE / REPORT / PAGE',delay=.8,size=13)
    if p in ('legend','tag','delta','edgelabel'):
        labels={'legend':['LINE ━','BAR ▬','DOT ●'],'tag':['DEFAULT','ACCENT','PERIOD'],'delta':['↗ +12.0%','↘ −3.0%','→ 0.0%'],'edgelabel':['60%','CAUSE +','RELATION']}[p]
        return tiles(3,1,labels,start=(74,148),cell=(178,62))
    if p in ('panel','card','node','reveal'):
        return rect(97,100,235,163,'CARD A',fill='white',delay=0)+rect(384,100,235,163,'CARD B',fill=ACCENT,delay=.4)
    raise ValueError(f'No schematic for {name}: {p}')

FOUNDATIONS = [
 ('Frame','src/components/Frame.tsx','画布、背景、内边距与字体容器','frame',True,'children','<Frame>{children}</Frame>'),
 ('BrutalCard','src/components/BrutalCard.tsx','硬边框、硬阴影卡片','card',True,'children, yellow?, className?','<BrutalCard yellow>重点内容</BrutalCard>'),
 ('SceneHeader','src/components/SceneHeader.tsx','眉题、标题、副标题依次出现','header',False,'eyebrow?, title, subtitle?','<SceneHeader eyebrow="财报" title="核心结论" subtitle="解释这条结论" />'),
 ('Source','src/components/Source.tsx','来源说明延迟显示','source',False,'children','<Source>公司年报 / 页码</Source>'),
 ('Tag','src/components/Tag.tsx','普通或强调标签','tag',True,'children, yellow?','<Tag yellow>FY2025</Tag>'),
 ('GridLines','src/components/viz/chartPrimitives.tsx','SVG 坐标网格','gridlines',True,'width, height, left?, right?, top?, bottom?, rows?','<svg><GridLines width={600} height={300} /></svg>'),
 ('MiniLegend','src/components/viz/chartPrimitives.tsx','线、柱、点三种图例','legend',True,'items','<MiniLegend items={[{label: "收入", kind: "bar", yellow: true}]} />'),
 ('OverlayShell','src/components/viz/overlayShared.tsx','透明或不透明叠加层的容器','overlay',True,'children, transparent?','<OverlayShell transparent>{children}</OverlayShell>'),
 ('InlineLegend','src/components/viz/overlayShared.tsx','叠加层的内联图例','legend',True,'items','<InlineLegend items={[{label: "收入", kind: "bar"}]} />'),
 ('StructuralDiagram','src/components/viz/structuralShared.tsx','树图、关系图的定位画布','structural',True,'children, className?','<StructuralDiagram>{nodesAndEdges}</StructuralDiagram>'),
 ('TreeEdge','src/components/viz/structuralShared.tsx','按 progress 绘制连接线','edge',False,'d, progress, accent?, thick?, opacity?','<TreeEdge d="M100 100 C200 100 200 200 300 200" progress={p} />'),
 ('NodeCard','src/components/viz/structuralShared.tsx','树与关系图中的节点卡片','node',True,'label, subtitle?, icon?, accent?, muted?, width?, compact?','<NodeCard label="收入" subtitle="业务驱动" accent />'),
 ('EdgeLabel','src/components/viz/structuralShared.tsx','连线上的数值或关系标签','edgelabel',True,'text, accent?, compact?','<EdgeLabel text="持股 60%" accent />'),
 ('Panel','src/broadcast/primitives.tsx','读取品牌 tokens 的面板','panel',True,'children, style?, accent?','<Panel accent>重点内容</Panel>'),
 ('Reveal','src/broadcast/primitives.tsx','按帧计算透明度和上移入场','reveal',False,'children, delay?, style?','<Reveal delay={0.2}><Panel>稍后出现</Panel></Reveal>'),
 ('Delta','src/broadcast/primitives.tsx','按正负值显示箭头、符号、涨跌色','delta',True,'value, label?, background?','<Delta value={12.8} label="同比" />'),
 ('MetricValue','src/broadcast/primitives.tsx','数字计数、单位、精度与本地化','metric',False,'metric, size?, locale?, animate?','<MetricValue metric={{label: "收入", value: 128, prefix: "", suffix: "亿元", decimals: 0}} />'),
 ('SceneFrame','src/broadcast/primitives.tsx','统一页眉、标题、内容与来源区','sceneframe',False,'scene, episode, index, children, hero?','<SceneFrame scene={scene} episode={episode} index={0}>{children}</SceneFrame>'),
 ('BrandProvider','src/brand/BrandProvider.tsx','为子组件提供品牌 tokens 上下文','brand',True,'brand, children','<BrandProvider brand={episode.brand}>{children}</BrandProvider>'),
 ('FinanceEpisode','src/program/Episode.tsx','编排镜头、字幕、行情条与音频','episode',False,'episode','<FinanceEpisode episode={parseEpisode(data)} />'),
 ('Bars','src/broadcast/charts.tsx','bars / ranking 模板内部的绘图组件','bars',False,'scene','<Bars scene={barsScene} />'),
 ('Trend','src/broadcast/charts.tsx','trend 模板内部的趋势绘图组件','multiline',False,'scene','<Trend scene={trendScene} />'),
 ('Waterfall','src/broadcast/charts.tsx','waterfall 模板内部的桥接绘图组件','waterfall',False,'scene','<Waterfall scene={waterfallScene} />'),
 ('Donut','src/broadcast/charts.tsx','donut 模板内部的环形绘图组件','donut',False,'scene','<Donut scene={donutScene} />'),
 ('SceneContent','src/broadcast/SceneContent.tsx','按 scene.type 分发原生节目内容；legacy 由 Episode 分发','dispatch',False,'scene, episode','<SceneContent scene={scene} episode={episode} />'),
]
TEMPLATE_PATTERNS = {'opener':'opener','chapter':'chapter','headline':'headline','news-grid':'newsgrid','hero':'metric','kpis':'kpis','bars':'bars','ranking':'ranking','trend':'multiline','waterfall':'waterfall','donut':'donut','table':'table','earnings':'earnings','scenario':'scenario','comparison':'compare','quote':'quote','timeline':'timeline','equation':'equation','bullets':'bullets','takeaway':'takeaway','media':'image','presenter':'presenter','sources':'sources','endcard':'endcard','legacy':'legacy'}
GROUPS = {'charts/categorical':'分类比较','charts/comparison':'跨组比较','charts/composition':'结构占比','charts/distribution':'分布与密度','charts/multivariate':'多维比较','charts/time-series':'时间序列','charts/uncertainty':'区间与预测','diagrams/finance':'财务结构','diagrams/flow':'流程与价值链','diagrams/hierarchy':'层级结构','diagrams/relationships':'关系网络','frameworks/planning':'规划与拆解','frameworks/process':'过程与职责','frameworks/strategy':'战略矩阵','media':'媒体素材','metrics':'核心指标','narrative':'叙事说明','overlays':'画面叠加','tables':'数据表格'}

def svg(entry):
    title=entry['name'] if entry['kind']!='template' else entry['type']+' / TEMPLATE'
    body=geometry(entry['pattern'],entry['name'])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" role="img" aria-label="{escape(entry['name'])} 框图动画示意">
<title>{escape(title)} / 代码绘制的动画示意</title><desc>{escape(' → '.join(entry['steps']))}</desc>
<style>{CSS}</style><rect width="720" height="360" fill="{PAPER}"/>
<g font-family="IBM Plex Mono, ui-monospace, monospace"><rect x="18" y="18" width="684" height="324" fill="none" stroke="{INK}" stroke-width="1.8"/>
{text(36,47,title,17)}{text(681,47,'SCHEMATIC',10,MUTED,'end')}
<path d="M18 61 H702" stroke="{INK}"/>{body}
{text(36,327,'01  FRAME    →    02  MOTION    →    03  HOLD',11,MUTED)}
<rect x="533" y="316" width="145" height="4" fill="#dce1d4"/><rect x="533" y="316" width="145" height="4" fill="{INK}" class="seek"/>
</g></svg>'''

def entries():
    specs={}
    for row in ORIGINALS.strip().splitlines():
        n,p,g,beats=row.split('|');specs[n]=(p,g,beats.split('；'))
    legacy=json.loads((ROOT/'schemas/legacy-catalog.json').read_text())
    out=[]
    for c in sorted(legacy,key=lambda c:c['source']):
        n='TickerOverlay' if c['component']=='TickerPreview' else c['component']
        purpose,pattern,steps=specs.pop(n)
        source='src/scenes/overlays/TickerOverlay.tsx' if n=='TickerOverlay' else c['source']
        category='/'.join(source.split('/')[2:-1]);keys=list(c['propsSchema'].get('properties',{}))
        usage=f'import {{ {n} }} from "./{source[:-4]}";\n\n<{n}'+(' {...props}' if keys else '')+' />'
        out.append(dict(id=c['id'],name=n,kind='original',category=GROUPS[category],source=source,purpose=purpose,pattern=pattern,steps=steps,props=keys,usage=usage,static=False))
    assert not specs, specs
    scene_files={str(f.relative_to(ROOT)) for f in (ROOT/'src/scenes').rglob('*.tsx')}
    covered={e['source'] for e in out}
    assert scene_files==covered, {'missing':sorted(scene_files-covered),'extra':sorted(covered-scene_files)}
    gallery=json.loads((ROOT/'examples/template-gallery.json').read_text())
    catalog=(ROOT/'src/program/catalog.ts').read_text()
    for typ,name,group,use in re.findall(r'\{\s*type:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*group:\s*"([^"]+)",\s*use:\s*"([^"]+)"',catalog):
        example=next((dict(s) for s in gallery['scenes'] if s['type']==typ),None)
        if typ=='legacy':example={'id':'legacy-hero','type':'legacy','duration':5,'title':'核心数字','component':'Metric-HeroMetric','props':{'value':128,'label':'演示指标'},'sourceIds':[]}
        assert example is not None,typ
        out.append(dict(id='Template-'+typ,name=name,type=typ,kind='template',category=group,source='src/program/Episode.tsx' if typ=='legacy' else 'src/broadcast/SceneContent.tsx',purpose=use,pattern=TEMPLATE_PATTERNS[typ],steps=['镜头容器出现','内容按框图顺序入场','信息停留，切换到下一镜头'],props=list(example),usage=json.dumps(example,ensure_ascii=False,indent=2),static=False))
    for n,source,purpose,pattern,static,props,usage in FOUNDATIONS:
        steps=['占位框保留','通过外层 Reveal / 参数变化演示','组件内容停留'] if static else (['上层容器出现','按输入或 progress 更新内容','完整内容停留'] if n not in ('SceneHeader','Source','Reveal','MetricValue') else {'SceneHeader':['眉题先出现','标题上移显现','副标题随后显现'],'Source':['内容区先显示','来源等待到后段','来源淡入并停留'],'Reveal':['内容透明并下移','透明度提高，同时上移','内容完全可见'],'MetricValue':['数字从零开始','数值向目标增长','单位、精度与目标数值保持']}[n])
        out.append(dict(id='Base-'+n,name=n,kind='foundation',category='上下文与编排' if n in ('BrandProvider','FinanceEpisode','SceneContent') else '基础与绘图',source=source,purpose=purpose,pattern=pattern,steps=steps,props=props.split(', '),usage=f'import {{ {n} }} from "./{source[:-4]}";\n\n'+usage,static=static))
    assert len([e for e in out if e['kind']=='original'])==109
    assert len([e for e in out if e['kind']=='template'])==25
    assert len(out)==159 and len({e['id'] for e in out})==159
    for e in out:
        assert (ROOT/e['source']).is_file(),e['source']
    return out

INTRO = '''这些动画由 SVG / CSS 代码画框模拟，用于快速理解布局和信息出现顺序。它们不是组件截图，也不是精确复刻：颜色、数值、时长均为示意。每轮约 4.8 秒。静态基础组件的示意包含外层入场或参数切换，组件自身没有自动动画。\n\n覆盖：109 个原场景组件、25 种 scene.type（24 种节目模板 + legacy 适配）、25 个可复用基础 / 绘图 / 编排组件，共 159 项。辅助函数、类型、Studio / Root / Reel 入口不作为视觉组件重复计数。\n\n**查看方式**：直接用浏览器打开同目录的 `component-readme.html`，支持搜索、分类、暂停和重播。Markdown 中每项也引用一份独立的动画 SVG；部分 Markdown 阅读器会禁用 SVG 动画，此时使用 HTML。将本目录文件复制到项目根目录，源码相对链接即可跳转。\n\n**直接使用原组件**：运行 `pnpm dev`，在 Remotion Studio 中选择条目写出的 Composition ID；修改组件 props 或源码。\n\n**使用节目模板**：把模板示例放入 Episode 的 `scenes`；示例取自 `examples/template-gallery.json`，请同时保留示例文件对应的 `sources`、素材和 episode 配置。用 `FinanceEpisode` 渲染，或运行 `pnpm workbench` 编辑节目 JSON。scene JSON 是镜头数据，不是新的 React 组件导出。\n\n**改自己的样式**：原组件从 `src/style/theme.ts`、`src/style/index.css` 和 `src/style/fonts.ts` 管理；节目模板从 `src/brand/presets.ts` 和 Episode 的 `brand.overrides` 管理；本说明的框图配色和节奏在 `scripts/generate-component-readme.py` 的颜色常量、`CSS` 和 `geometry()` 中管理。生成说明不会修改原组件或字体。\n'''

def markdown(items):
    chunks=['# component-readme\n\n'+INTRO,'\n## 分类目录\n']
    for kind,label in [('original','原场景组件 · 109'),('template','节目模板 · 25'),('foundation','基础、绘图与编排组件 · 25')]:
        chunks.append(f'\n### {label}\n')
        cats=list(dict.fromkeys(e['category'] for e in items if e['kind']==kind))
        for cat in cats:
            es=[e for e in items if e['kind']==kind and e['category']==cat]
            chunks.append(f"\n- **{cat}**："+' · '.join(f'[{e["name"]}](#{e["id"].lower()})' for e in es)+'\n')
    for kind,label in [('original','原场景组件'),('template','节目模板'),('foundation','基础、绘图与编排组件')]:
        chunks.append(f'\n## {label}\n')
        for e in items:
            if e['kind']!=kind:continue
            chunks.append(f'\n<a id="{e["id"].lower()}"></a>\n\n### {e["name"]}'+(f' / `{e["type"]}`' if kind=='template' else '')+'\n\n')
            chunks.append(f'**用途**：{e["purpose"]}。\n\n![{e["name"]} 框图动画](component-previews/{e["id"]}.svg)\n\n')
            chunks.append('**示意顺序**：'+' → '.join(f'{i+1}. {v}' for i,v in enumerate(e['steps']))+'。\n\n')
            if e['static']:chunks.append('**静态组件**：上图用外层动画或输入值切换帮助理解；组件本身不自动运动。\n\n')
            chunks.append(f'**源码**：[{e["source"]}]({e["source"]})\n\n')
            if kind=='original':chunks.append(f'**Composition ID**：`{e["id"]}`\n\n')
            chunks.append('**参数**：'+('、'.join('`'+p+'`' for p in e['props']) or '使用组件内置演示内容，无数据 props')+'。\n\n')
            chunks.append('```'+('json' if kind=='template' else 'tsx')+'\n'+e['usage']+'\n```\n')
            if kind=='original' and e['props']:chunks.append('\n`props` 的字段、结构和内置样例见本条源码及 `schemas/legacy-catalog.json`；可从 Studio 默认示例开始修改。\n')
    chunks.append('''\n## 修改与重新生成\n\n修改 `scripts/generate-component-readme.py` 中的图形函数或组件描述后运行：\n\n```bash\npython3 scripts/generate-component-readme.py\n```\n\n只重建本说明、独立 SVG 和清单，无需运行 Remotion 或下载依赖。新增场景后需更新描述表；脚本会核对目录中的组件，发现未覆盖项时停止，避免静默漏掉。\n''')
    return ''.join(chunks)

PAGE_CSS='''
:root{--ink:#171917;--paper:#fafaf7;--accent:#ffd43b;--line:#d8dccf;--muted:#666d60;color-scheme:light}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:ui-monospace,"SFMono-Regular",Consolas,"Microsoft YaHei",monospace}a{color:inherit}button,input,select{font:inherit;color:inherit}button,select{cursor:pointer}header{max-width:1400px;padding:44px 32px 26px;margin:auto}h1{font-size:clamp(25px,4vw,48px);margin:0 0 15px;letter-spacing:-.05em}p{line-height:1.8}header p{max-width:1010px;margin:8px 0;color:#505749;font-size:14px}.eyebrow{font-size:12px;letter-spacing:.15em;margin-bottom:15px}.stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.pill{padding:7px 10px;background:var(--accent);border:1px solid var(--ink);font-size:12px}.toolbar{position:sticky;top:0;z-index:4;background:var(--paper);border-block:1px solid var(--ink)}.controls{max-width:1400px;margin:auto;padding:13px 32px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}input,select,button{border:1px solid var(--ink);border-radius:0;background:#fff;padding:10px 12px;min-height:42px}input{flex:1;min-width:220px}button:hover,button.active{background:var(--accent)}button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible,a:focus-visible{outline:3px solid #688745;outline-offset:3px}.count{font-size:12px;color:var(--muted);white-space:nowrap}.grid{max-width:1400px;margin:0 auto;padding:24px 32px 48px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.card{border:1px solid var(--ink);background:#fff;min-width:0;scroll-margin-top:100px}.card[hidden]{display:none}.preview{border-bottom:1px solid var(--line);background:var(--paper);aspect-ratio:2;overflow:hidden}.preview svg{display:block;width:100%;height:100%}.card:not(.live) svg *{animation-play-state:paused!important}.body{padding:21px}.meta{display:flex;gap:8px;align-items:center;justify-content:space-between;font-size:11px;color:var(--muted)}.body h2{font-size:19px;overflow-wrap:anywhere;line-height:1.5;margin:12px 0 6px}.body p{font-size:13px;line-height:1.8;margin:4px 0 12px}.beats{margin:14px 0;display:flex;gap:7px;flex-wrap:wrap;font-size:11px;line-height:1.7}.beat{border-left:3px solid var(--accent);padding-left:7px;flex:1;min-width:100px}.source{display:block;font-size:11px;overflow-wrap:anywhere;line-height:1.8;color:var(--muted)}.static{background:#f2f3eb;border-left:3px solid #9da68e;padding:9px 11px;font-size:11px!important}.actions{display:flex;gap:8px;align-items:center;margin-top:16px}.actions button,.actions a{font-size:11px;padding:7px 10px;min-height:30px}.actions a{text-decoration:none;border:1px solid var(--line)}details{margin-top:15px;border-top:1px solid var(--line);padding-top:12px}summary{cursor:pointer;font-size:12px}pre{font-size:11px;line-height:1.8;background:#f6f7f1;padding:14px;overflow:auto;max-height:340px;white-space:pre}code{font-family:inherit}.props{font-size:11px;overflow-wrap:anywhere;color:var(--muted);line-height:1.8}.empty{padding:60px 32px;text-align:center;color:var(--muted)}.help{max-width:1336px;margin:0 auto 30px;padding:20px 24px;border:1px solid var(--line);font-size:12px;line-height:1.9}.help h2{font-size:16px;margin:0 0 8px}footer{padding:20px 32px 40px;text-align:center;font-size:11px;color:var(--muted)}@media(min-width:1700px){.grid{grid-template-columns:repeat(3,minmax(0,1fr));max-width:1840px}}@media(max-width:760px){header{padding:28px 18px}.controls{padding:10px 18px;gap:7px}.controls select{flex:1;max-width:calc(50% - 4px);font-size:12px}.controls>button{font-size:12px}input{flex-basis:100%;min-width:0}.grid{padding:16px 14px 32px;grid-template-columns:1fr}.body{padding:17px}.help{margin-inline:14px}.count{margin-left:auto}}@media(prefers-reduced-motion:reduce){.motion-note{display:block!important}}
'''

def html(items):
    fonts=''
    for family,filename in [('DocMono','IBMPlexMono-Regular.woff2'),('DocCJK','NotoSansSC-400.woff2')]:
        font=ROOT/'public/fonts'/filename
        if font.is_file():
            data=base64.b64encode(font.read_bytes()).decode('ascii')
            fonts+=f'@font-face{{font-family:"{family}";src:url(data:font/woff2;base64,{data}) format("woff2");font-weight:400 700;font-display:swap}}'
    fonts+='body,svg text{font-family:"DocMono","DocCJK",ui-monospace,monospace}'
    cards=[]
    for e in items:
        kind={'original':'原场景组件','template':'节目模板','foundation':'基础与编排'}[e['kind']]
        search=' '.join([e['name'],e.get('type',''),e['id'],e['category'],e['purpose'],e['source']]).lower()
        s=svg(e).replace('<style>'+CSS+'</style>','')
        cards.append(f'''<article class="card" id="{e['id']}" data-kind="{e['kind']}" data-category="{escape(e['category'])}" data-search="{escape(search,quote=True)}">
<div class="preview">{s}</div><div class="body"><div class="meta"><span>{kind} / {escape(e['category'])}</span><span>{'STATIC + DEMO' if e['static'] else 'BOX ANIMATION'}</span></div>
<h2>{escape(e['name'])}{' / '+escape(e['type']) if e['kind']=='template' else ''}</h2><p>{escape(e['purpose'])}。</p>
<div class="beats">{''.join(f'<span class="beat">0{i+1}<br>{escape(v)}</span>' for i,v in enumerate(e['steps']))}</div>
{'<p class="static">组件本身静态。示意通过外层入场或输入切换演示。</p>' if e['static'] else ''}
<span class="source">{escape(e['source'])}</span><span class="source">{'Composition ID: '+e['id'] if e['kind']=='original' else 'ID: '+e['id']}</span>
<div class="actions"><button class="replay" type="button" aria-label="重播 {escape(e['name'])}">↻ 重播</button><a href="#{e['id']}" class="permalink"># 定位</a></div>
<details><summary>参数与调用示例</summary><p class="props">{escape(' / '.join(e['props']) or '使用内置演示内容，无数据 props')}</p><pre><code>{escape(e['usage'])}</code></pre></details></div></article>''')
    categories=list(dict.fromkeys(e['category'] for e in items))
    options=''.join(f'<option value="{escape(c)}">{escape(c)}</option>' for c in categories)
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>component-readme · Finance Motion</title><style>{PAGE_CSS}\n{CSS}\n{fonts}</style></head>
<body><header><div class="eyebrow">FINANCE MOTION / COMPONENT GUIDE</div><h1>component-readme</h1><p>看框图，理解每个组件怎样组织信息、怎样入场。全部由 SVG / CSS 代码模拟；框、线、数字为示意，布局和节奏并非实际视频截图。</p><p>每轮约 4.8 秒，只播放屏幕中可见的示意。原组件用 Composition ID 在 Remotion Studio 中选择；节目模板用 JSON 放进 Episode 的 scenes。</p><div class="stats"><span class="pill">109 原场景</span><span class="pill">24 节目模板 + 1 legacy</span><span class="pill">25 基础 / 绘图 / 编排</span><span class="pill">159 动画示意</span></div><p class="motion-note" style="display:none">已遵循系统的减少动态效果设置，显示最终示意状态。</p></header>
<nav class="toolbar" aria-label="组件筛选"><div class="controls"><input id="search" type="search" placeholder="搜索组件、用途、ID…" aria-label="搜索组件"><select id="kind" aria-label="按组件类型筛选"><option value="">全部类型</option><option value="original">原场景组件</option><option value="template">节目模板</option><option value="foundation">基础与编排</option></select><select id="category" aria-label="按分类筛选"><option value="">全部分类</option>{options}</select><button id="play" type="button" aria-pressed="false">Ⅱ 暂停动画</button><output id="count" class="count" aria-live="polite">159 / 159</output></div></nav>
<main class="grid" id="grid">{''.join(cards)}</main><div id="empty" class="empty" hidden>没有匹配的组件。试试输入中文用途、英文名或 Composition ID。</div>
<aside class="help"><h2>怎么用这份说明</h2><p><b>原组件：</b>项目根目录运行 <code>pnpm dev</code>，按条目的 Composition ID 选择，再改 props 或源码。<br><b>节目模板：</b>把示例放进 Episode.scenes；来源和素材请一并取自 <code>examples/template-gallery.json</code>。运行 <code>pnpm workbench</code> 编辑节目。<br><b>统一样式：</b>原组件见 <code>src/style/theme.ts</code>、<code>src/style/index.css</code>、<code>src/style/fonts.ts</code>；模板见 <code>src/brand/presets.ts</code> 与 <code>brand.overrides</code>。<br><b>框图样式：</b>改 <code>scripts/generate-component-readme.py</code> 的颜色常量、CSS 和 geometry()，再运行该 Python 脚本。本说明不改项目字体。</p></aside><footer>CODE-DRAWN SCHEMATICS · NO VIDEO RENDER · NO EXTERNAL DEPENDENCIES</footer>
<script>
const cards=[...document.querySelectorAll('.card')], input=document.querySelector('#search'),kind=document.querySelector('#kind'),category=document.querySelector('#category'),play=document.querySelector('#play');
let paused=false;const visible=new Set();
function sync(){{cards.forEach(c=>c.classList.toggle('live',!paused&&!c.hidden&&visible.has(c)))}}
const observer=new IntersectionObserver(es=>{{es.forEach(e=>{{if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target)}});sync()}},{{rootMargin:'40px'}});cards.forEach(c=>observer.observe(c));
function filter(){{const q=input.value.trim().toLowerCase();let n=0;cards.forEach(c=>{{c.hidden=!!((q&&!c.dataset.search.includes(q))||(kind.value&&c.dataset.kind!==kind.value)||(category.value&&c.dataset.category!==category.value));if(!c.hidden)n++}});document.querySelector('#count').textContent=n+' / '+cards.length;document.querySelector('#empty').hidden=n>0;sync()}}
input.addEventListener('input',filter);kind.addEventListener('change',filter);category.addEventListener('change',filter);
play.addEventListener('click',()=>{{paused=!paused;play.textContent=paused?'▶ 播放动画':'Ⅱ 暂停动画';play.setAttribute('aria-pressed',String(paused));sync()}});
document.querySelectorAll('.replay').forEach(b=>b.addEventListener('click',()=>{{const c=b.closest('.card');c.querySelectorAll('svg *').forEach(el=>el.getAnimations().forEach(a=>{{a.currentTime=0}}));if(paused){{paused=false;play.textContent='Ⅱ 暂停动画';play.setAttribute('aria-pressed','false')}}sync()}}));
document.querySelectorAll('.permalink').forEach(a=>a.addEventListener('click',()=>{{const c=a.closest('.card');history.replaceState(null,'','#'+c.id)}}));
function openHash(){{const id=decodeURIComponent(location.hash.slice(1));const c=document.getElementById(id);if(c&&c.classList.contains('card')){{input.value='';kind.value='';category.value='';filter();requestAnimationFrame(()=>c.scrollIntoView({{block:'start'}}))}}}}window.addEventListener('hashchange',openHash);if(location.hash)openHash();
</script></body></html>'''

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=ROOT);args=parser.parse_args()
    out=args.output.resolve();out.mkdir(parents=True,exist_ok=True);(out/'component-previews').mkdir(exist_ok=True)
    items=entries()
    for e in items:(out/'component-previews'/f'{e["id"]}.svg').write_text(svg(e),encoding='utf-8')
    (out/'component-readme.md').write_text(markdown(items),encoding='utf-8')
    (out/'component-readme.html').write_text(html(items),encoding='utf-8')
    (out/'components.json').write_text(json.dumps({'animation':'code-drawn SVG/CSS schematic','total':len(items),'entries':items},ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'output':str(out),'original':109,'templates':25,'foundations':25,'total':len(items),'patterns':len({e['pattern'] for e in items})},ensure_ascii=False))

if __name__=='__main__':main()
