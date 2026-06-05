const fs = require('fs');
const path = require('path');

module.exports = {
  name: '超V主题活动策划',
  description: '为45-70岁超V核心用户策划温暖有情感共鸣的主题活动',
  
  inputVariables: [
    {
      name: '活动月份',
      description: '活动所在月份（1-12月）',
      type: 'string',
      required: true
    },
    {
      name: '活动开始时间',
      description: '活动开始日期，格式：YYYY年MM月DD日',
      type: 'string',
      required: true
    },
    {
      name: '活动结束时间',
      description: '活动结束日期，格式：YYYY年MM月DD日',
      type: 'string',
      required: true
    },
    {
      name: '目标人群',
      description: '活动面向人群描述',
      type: 'string',
      required: true
    },
    {
      name: '关联课程',
      description: '需要引流的课程名称',
      type: 'string',
      required: true
    }
  ],

  async run(inputs) {
    const { 
      '活动月份': activityMonth, 
      '活动开始时间': startTime, 
      '活动结束时间': endTime,
      '目标人群': targetAudience,
      '关联课程': relatedCourse
    } = inputs;

    const monthData = getMonthData(activityMonth);
    const themeData = getThemeData(relatedCourse);
    const duration = calculateDuration(startTime, endTime);

    const prompt = generatePrompt({
      activityMonth,
      startTime,
      endTime,
      targetAudience,
      relatedCourse,
      monthData,
      themeData,
      duration
    });

    return prompt;
  }
};

function getMonthData(month) {
  const monthMap = {
    '1月': { title: '岁末光影', subtitle: '记录冬日里的温暖时光', colorScheme: 'warm', solarTerm: '小寒/大寒' },
    '2月': { title: '家的温度', subtitle: '用镜头定格团圆时刻', colorScheme: 'warm', solarTerm: '立春/雨水' },
    '3月': { title: '新视角', subtitle: '发现生活中的美好瞬间', colorScheme: 'fresh', solarTerm: '惊蛰/春分' },
    '4月': { title: '动静之间', subtitle: '感受运动带来的活力', colorScheme: 'fresh', solarTerm: '清明/谷雨' },
    '5月': { title: 'VLOG日记', subtitle: '用短视频记录生活', colorScheme: 'modern', solarTerm: '立夏/小满' },
    '6月': { title: '夏日光影', subtitle: '逆光与剪影的魅力', colorScheme: 'fresh', solarTerm: '芒种/夏至' },
    '7月': { title: '人像之美', subtitle: '记录岁月沉淀的优雅', colorScheme: 'elegant', solarTerm: '小暑/大暑' },
    '8月': { title: '餐桌上的艺术', subtitle: '美食拍摄与生活美学', colorScheme: 'warm', solarTerm: '立秋/处暑' },
    '9月': { title: '秋之收获', subtitle: '色彩与构图的艺术', colorScheme: 'retro', solarTerm: '白露/秋分' },
    '10月': { title: '金色年华', subtitle: '记录时光沉淀的优雅之美', colorScheme: 'elegant', solarTerm: '寒露/霜降' },
    '11月': { title: '暖阳律动', subtitle: '享受居家运动的美好时光', colorScheme: 'warm', solarTerm: '立冬/小雪' },
    '12月': { title: '年度光影故事', subtitle: '回顾一年的美好瞬间', colorScheme: 'retro', solarTerm: '大雪/冬至' }
  };

  const numMonth = parseInt(month);
  if (!isNaN(numMonth) && numMonth >= 1 && numMonth <= 12) {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return monthMap[monthNames[numMonth - 1]] || monthMap['1月'];
  }
  
  return monthMap[month] || monthMap['1月'];
}

function getThemeData(course) {
  const courseMap = {
    '书法体验课': { theme: '墨香时光', category: '文化修养', direction: '书法展示、读书角落、文字特写' },
    '健康食养体验课': { theme: '食光之旅', category: '健康生活', direction: '美食摆盘、烹饪过程、餐桌布置' },
    '太极体验课': { theme: '动静之间', category: '传统文化', direction: '居家练习、优雅姿态、养生日常' },
    '瑜伽体验课': { theme: '身体之美', category: '活力变美', direction: '居家锻炼、体态展示、运动日常' },
    '摄影体验课': { theme: '光影日记', category: '艺术生活', direction: '随拍记录、生活瞬间、身边美好' },
    '声乐体验课': { theme: '时光乐章', category: '艺术生活', direction: '歌唱时刻、音乐分享、家庭合唱' },
    '面部瑜伽体验课': { theme: '人像之美', category: '活力变美', direction: '人像特写、光影人像、自拍技巧' }
  };

  for (const [key, value] of Object.entries(courseMap)) {
    if (course.includes(key) || key.includes(course)) {
      return value;
    }
  }

  return { theme: '生活美学', category: '综合', direction: '生活记录、日常分享' };
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime.replace(/年|月/g, '-').replace('日', ''));
  const end = new Date(endTime.replace(/年|月/g, '-').replace('日', ''));
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

function generatePrompt(data) {
  const { activityMonth, startTime, endTime, targetAudience, relatedCourse, monthData, themeData, duration } = data;
  
  const year = startTime.substring(0, 4);
  const startDay = startTime.substring(startTime.indexOf('月') + 1, startTime.indexOf('日'));
  const endDay = endTime.substring(endTime.indexOf('月') + 1, endTime.indexOf('日'));
  const monthNum = activityMonth.replace('月', '');

  return `
# 超V主题活动全景操作方案框架

## 一、活动概述与背景

**活动主题**：「${monthData.title}」——${monthData.subtitle}

| 项目 | 内容 |
|------|------|
| **APP标题** | 「${monthData.title}」｜超V特别企划 |
| **活动时间** | ${year}年${monthNum}月${startDay}日 - ${monthNum}月${endDay}日（共${duration}天） |
| **目标用户** | ${targetAudience} |
| **核心策略** | 以"传统节气/时令生活"为情感抓手，设计低渠道、多方向的牵制性打卡，通过"私信1v1+社群精细化催更"实现沉默唤醒与留存，最终间接为【${relatedCourse}】引流 |
| **打卡形式** | APP内上传照片&视频至打卡页面 |

**活动形式**：
- **参与方式**：上传照片&视频至打卡页面
- **拍摄方向**：根据活动主题动态调整，如${themeData.direction}等与主题相关内容均可

**活动背景**：
基于超V用户群体特点，结合【${relatedCourse}】的推广需求，本次活动旨在通过情感共鸣的主题设计，唤醒沉默用户、提升APP活跃度，同时为关联课程提供自然的引流入口。

## 二、活动概述与底层模型建构

| 模型模块 | 通用设计要求与具体做法 | 核心运营价值 |
|----------|----------------------|--------------|
| **主题包装** | 主副标题公式：「${monthData.title}」——${monthData.subtitle}；中老年共鸣文案要求：主打生活美学/时令场景，避免直推课程，强调温暖关怀感 | 激发情感共鸣，降低参与心理门槛 |
| **用户身份** | 赋予专属荣誉徽章（如「${monthData.title}达人」），在活动页面和社群突出展示 | 增强用户归属感与荣誉感，提升参与动力 |
| **低门槛参与** | 打卡阻力降级设计：支持照片/视频双格式，随手拍即可参与，字数/工具不限，简化操作流程 | 降低参与门槛，扩大参与覆盖面 |
| **节点引爆** | 锁定特定节气当天（如${monthData.solarTerm}）设置双倍学分；月中/月末特定惊喜日设置100%中奖抽奖 | 制造稀缺感，提升特定时段活跃度 |
| **激励闭环** | 阶段阶梯反馈（3天/5天/7天/15天）；头部荣誉互斥原则：含礼品奖项用户不可重复获奖，按最高档发放 | 平衡激励成本，保证公平性 |
| **私域承接** | 社群+朋友圈+管家1v1多维矩阵承接：社群日常互动、朋友圈亮点展示、管家定向触达 | 构建立体触达网络，提升转化效率 |
| **数据追踪** | 超V参与率（目标≥70%）、打卡漏斗持续天数（3/5/7/15天）、领课率、转化率、APP回流率 | 量化活动效果，优化运营策略 |

## 三、活动目标测算

| 维度 | 核心指标 | 目标值 | 参考历史/测算逻辑 |
|------|----------|--------|-------------------|
| **主动留存** | APP回流率 | ≥25% | 基于往期超V用户唤醒基准测算 |
| **主动留存** | 持续打卡率 | ≥35% | 预计转化打卡超5天用户占比 |
| **内容生态** | 总发帖量 | ≥4000条 | 通过参与用户人均发帖3条计算 |
| **业务转化** | 低价/免费领课数 | 600-800例 | 引流触达仅面向已结营、未学过该品类的老客户 |
| **业务转化** | 第一单转化数 | ≥100单 | 领课后的正价课转化目标 |

## 四、全周期活动阶段规划

### 1. 【筹备期】${year}年${monthNum}月${parseInt(startDay)-8}日-${year}年${monthNum}月${parseInt(startDay)-1}日
| 核心运营动作 | 阶段运营目的 |
|--------------|--------------|
| 底层方案撰写、礼品库存调用确认（商品编码SPU锁定）、引流课程链接配置、社群SOP及管家话术培训下发 | 确保活动方案落地性，完成资源协调与团队准备 |

### 2. 【预热期】${year}年${monthNum}月${parseInt(startDay)-4}日-${year}年${monthNum}月${parseInt(startDay)-1}日
| 核心运营动作 | 阶段运营目的 |
|--------------|--------------|
| 私域社群/朋友圈连续剧透铺垫、${themeData.category}知识干货分享、种子用户1v1定向邀请、素材打样 | 提前营造活动氛围，降低用户参与顾虑，激发期待感 |

### 3. 【启动期】${year}年${monthNum}月${startDay}日
| 核心运营动作 | 阶段运营目的 |
|--------------|--------------|
| 活动开始当天早上7:00准时在社群内发布活动开启通知、同步上线APP端Banner和开屏图进行强提醒 | 制造首日羊群效应，实现活动开门红 |

### 4. 【引爆期】${year}年${monthNum}月${parseInt(startDay)+1}日-${year}年${monthNum}月${parseInt(endDay)-1}日
| 核心运营动作 | 阶段运营目的 |
|--------------|--------------|
| 特定节点稀缺玩法轰炸（${monthData.solarTerm}双倍学分/惊喜抽奖）、口碑外化展示（每周一中午12点转发优秀作品官方点评海报）、配套大咖直播联动导流 | 提升活动热度，扩大传播声量，促进用户活跃 |

### 5. 【承接期】（与引爆期平行推进）${year}年${monthNum}月${parseInt(startDay)+3}日-${year}年${monthNum}月${parseInt(endDay)-1}日
| 核心运营动作 | 阶段运营目的 |
|--------------|--------------|
| 累计打卡≥5天的高意向活跃超V用户后台精准打标（剔除当月导量/学过品类用户）、管家1v1精准领课话术触达、推送关联课程链接 | 精准触达高价值用户，实现课程引流转化 |

### 6. 【收口期】${year}年${monthNum}月${endDay}日-${year}年${monthNum}月${parseInt(endDay)+5}日
| 核心运营动作 | 阶段运营目的 |
|--------------|--------------|
| 中奖登记名单大公示（含活动获奖公示海报与优秀作品精选海报）、发货信息收集问卷下发、虚拟奖励手动发放、长周期重度留存锁定（季度勋章预告） | 完成活动闭环，确保奖励发放，锁定长期留存 |

## 五、用户洞察与主题定位

### 主题解读
**主题命名原则**：主标题必须与月份、生活场景强关联，避免直接提及课程名称；副标题可自然融入课程相关的价值主张。

**主题公式**：「${monthData.title}」——${monthData.subtitle}

### 用户痛点匹配
| 用户痛点 | 活动设计 |
|----------|----------|
| **健康养生需求** | 通过运动打卡、健康饮食分享、面部护理等方向，满足用户健康管理需求 |
| **自我提升需求** | 提供才艺展示、学习记录、技能提升等方向，满足用户自我成长需求 |
| **变美需求** | 人像摄影、形象展示、面部保养分享等方向，满足用户展现自我魅力的需求 |
| **社交交友需求** | 社群互动、作品分享等机制，满足用户社交互动需求 |

## 六、核心玩法与多维激励机制

### 1. 阶梯打卡机制（APP发帖+话题）
| 要素 | 设计要点 |
|------|----------|
| **参与方式** | APP内对应活动专区进行发帖 |
| **拍摄方向** | **【方向1】${themeData.category}风采**（${themeData.direction}）<br>**【方向2】生活美学记录**（精致生活场景、美食摆盘、日常瞬间等）<br>**【方向3】情感故事表达**（与家人的温馨时刻、生活感悟分享、岁月故事等）<br>**【方向4】健康养生分享**（运动日常、养生方法、身心放松等） |
| **阶梯奖励** | 3天/5天/7天/15天全阶梯奖励，按最高档奖励发放，奖品不递增 |
| **包容性原则** | 所有打卡方向均不强制关联课程，确保非课程用户也能轻松参与 |

### 2. 稀缺特殊日加成
| 类型 | 设计要点 |
|------|----------|
| **节气/节日加成** | ${monthData.solarTerm}打卡享受双倍学分奖励 |
| **特别惊喜抽奖日** | 活动中期打卡解锁100%中奖抽奖链接 |

### 3. 私域社群活跃机制
| 要素 | 设计要点 |
|------|----------|
| **玩法目的** | 集中展示优秀作品，营造社群氛围，提升用户活跃度 |
| **活动时间** | 每周一中午12点 |
| **玩法规则** | 在群里发起接龙，用户转发晒出自己的打卡帖子，每个社群前10位晒打卡贴的用户可获得20学分 |

### 4. 奖项设置（成本递进）
| 奖项名称 | 评选维度 | 名额 | 超V奖励 |
|----------|----------|------|----------|
| **${monthData.title}风采奖** | 综合数据排名前10名 | 10名 | 实物礼品（20-30元）+ 2000UV曝光券 + 150学分 + 荣誉徽章 |
| **${monthData.title}优秀奖** | 累计打卡≥5天且点赞量前20名 | 20名 | 实物礼品（15-20元）+ 1000UV曝光券 + 100学分 + 荣誉徽章 |
| **全勤${monthData.title}奖** | 累计打卡15天 | 不限 | 150学分 + 荣誉徽章 + 2000UV曝光券×2 |
| **${monthData.title}进阶奖** | 累计打卡7天 | 不限 | 100学分 + 荣誉徽章 + 1000UV曝光券×1 |
| **${monthData.title}进步奖** | 累计打卡5天 | 不限 | 80学分 + 荣誉徽章 + 1000UV曝光券×1 |
| **${monthData.title}入门奖** | 累计打卡3天 | 不限 | 荣誉徽章 + 500UV曝光券×1 |

### 5. 关联课程推广策略（间接植入，非强制）
| 推广方式 | 执行细节 |
|----------|----------|
| **内容植入** | 活动详情页介绍「${themeData.category}小技巧」，自然带出【${relatedCourse}】的价值 |
| **管家推荐** | 社群内分享课程链接，强调"感兴趣的同学可以了解" |
| **话题引导** | 发起「#${monthData.title}#」话题挑战，关联生活场景内容 |

## 七、私域触达矩阵看板

**私信触达表**：
| 日期 | 触达人群包 | 触达话术版本 |
|------|------------|--------------|
| ${year}年${monthNum}月${parseInt(startDay)-1}日 | 在营用户 | 版本A |
| ${year}年${monthNum}月${startDay}日 | 沉默用户 | 版本B |
| ${year}年${monthNum}月${parseInt(startDay)+1}日 | 结营老客户 | 版本C |

**社群运营节奏表**：
| 时间 | 内容 | 朋友圈同步 |
|------|------|------------|
| 周一 | 晒帖接龙活动 | 同步 |
| 周二 | 优秀作品展示 | 同步 |
| 周三 | ${themeData.category}技巧分享 | 同步 |
| 周四 | 打卡技巧分享 | 同步 |
| 周五 | 周末活动预告 | 同步 |

## 八、风险控制与备用预案

| 风险 | 备用预案 |
|------|----------|
| **风险1：中老年用户操作困难** | 录制30秒手机录屏教程，支持管家代打卡 |
| **风险2：奖品超预算/库存不足** | 启动B端备用选品方案（等价值礼品或高额学分） |
| **风险3：用户疲态、打卡率下降** | 启动管家私信捞回机制，情感唤醒话术 |

## 九、预算与ROI测算

| 项目 | 数量 | 成本区间 | 预估费用 |
|------|------|----------|----------|
| **头部奖礼品** | 10份 | 20-30元/份 | 200-300元 |
| **中层奖礼品** | 50份 | 15-20元/份 | 750-1000元 |
| **参与奖礼品** | 30份 | 5-15元/份 | 150-450元 |
| **合计** | - | - | 1100-1750元 |

**ROI预测**：若成功激活引流领课600-800例，预计正价课转化≥25单，活动整体ROI预计为1:3-5

## 十、数据复盘与回流看板

| 指标 | 计算公式 | 目标值 |
|------|----------|--------|
| **超V参与率** | 超V参与人数/参与总人数 | ≥70% |
| **持续打卡率** | 打卡超5天人数/参与人数 | ≥30% |
| **APP回流率** | 回流人数/参与人数 | ≥20% |
| **课程转化率** | 领课人数/触达人数 | ≥8% |
  `.trim();
}
