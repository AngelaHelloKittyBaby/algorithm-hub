/* ============================================================
 * AlgoHub 默认数据
 * 包含：刷题平台、学习资源、视频教程、算法分类
 * ============================================================ */

const DEFAULT_DATA = {

  /* ===== 刷题平台 ===== */
  platforms: [
    {
      id: 'leetcode',
      name: 'LeetCode 力扣',
      url: 'https://leetcode.cn',
      desc: '全球最流行的刷题平台，题库丰富，企业面试首选，支持多语言。',
      icon: '🟧',
      tags: ['面试', '综合', '中文'],
      difficulty: '全难度',
      featured: true
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      url: 'https://codeforces.com',
      desc: '俄罗斯竞赛平台，以竞赛算法闻名，定期举办 rated 比赛。',
      icon: '🔵',
      tags: ['竞赛', '硬核', '英文'],
      difficulty: '中高难度',
      featured: true
    },
    {
      id: 'luogu',
      name: '洛谷',
      url: 'https://www.luogu.com.cn',
      desc: '国内主流 OJ，题库庞大，社区活跃，适合 NOIP/CSP 选手。',
      icon: '🟢',
      tags: ['竞赛', '中文', '社区'],
      difficulty: '全难度',
      featured: true
    },
    {
      id: 'acwing',
      name: 'AcWing',
      url: 'https://www.acwing.com',
      desc: '闫学灿团队打造，系统化算法课程配套刷题，适合进阶。',
      icon: '🟦',
      tags: ['课程', '系统', '中文'],
      difficulty: '全难度',
      featured: true
    },
    {
      id: 'nowcoder',
      name: '牛客网',
      url: 'https://www.nowcoder.com',
      desc: '国内求职刷题重镇，企业真题多，校招必备。',
      icon: '🟩',
      tags: ['面试', '真题', '中文'],
      difficulty: '全难度',
      featured: true
    },
    {
      id: 'atcoder',
      name: 'AtCoder',
      url: 'https://atcoder.jp',
      desc: '日本竞赛平台，ABC/ARC/AGC 系列比赛，题目质量高。',
      icon: '🟥',
      tags: ['竞赛', '英文', '日文'],
      difficulty: '中高难度',
      featured: false
    },
    {
      id: 'spoj',
      name: 'SPOJ',
      url: 'https://www.spoj.com',
      desc: '经典在线判题系统，题目来自全球，挑战性强。',
      icon: '🟪',
      tags: ['经典', '英文'],
      difficulty: '全难度',
      featured: false
    },
    {
      id: 'hdu',
      name: 'HDU 杭电 OJ',
      url: 'http://acm.hdu.edu.cn',
      desc: '杭州电子科技大学 OJ，国内老牌竞赛训练平台。',
      icon: '🟨',
      tags: ['竞赛', '中文', '高校'],
      difficulty: '全难度',
      featured: false
    },
    {
      id: 'poj',
      name: 'POJ 北大 OJ',
      url: 'http://poj.org',
      desc: '北京大学在线判题，经典老题丰富。',
      icon: '🟧',
      tags: ['经典', '中文', '高校'],
      difficulty: '全难度',
      featured: false
    },
    {
      id: 'geeksforgeeks',
      name: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org',
      desc: '算法百科式网站，讲解详尽，适合查阅与系统学习。',
      icon: '🟩',
      tags: ['教程', '英文', '百科'],
      difficulty: '全难度',
      featured: false
    }
  ],

  /* ===== 学习资源 ===== */
  learning: [
    {
      id: 'oi-wiki',
      name: 'OI Wiki',
      url: 'https://oi-wiki.org',
      desc: '免费开源的算法竞赛知识整合站点，覆盖全面、结构清晰。',
      icon: '📚',
      tags: ['文档', '中文', '开源'],
      type: '文档',
      featured: true
    },
    {
      id: 'cp-algorithms',
      name: 'CP-Algorithms',
      url: 'https://cp-algorithms.com',
      desc: '竞赛算法经典翻译站点，原 Codeforces 博客，内容硬核。',
      icon: '📖',
      tags: ['文档', '英文', '竞赛'],
      type: '文档',
      featured: true
    },
    {
      id: 'labuladong',
      name: 'labuladong 算法小抄',
      url: 'https://labuladong.github.io/algo',
      desc: '东哥算法小抄，框架思维学算法，面试向。',
      icon: '📘',
      tags: ['书籍', '中文', '面试'],
      type: '书籍',
      featured: true
    },
    {
      id: 'hello-algo',
      name: 'Hello 算法',
      url: 'https://www.hello-algo.com',
      desc: '动画图解、一键运行的数据结构与算法教程，开源免费。',
      icon: '📗',
      tags: ['书籍', '中文', '动画'],
      type: '书籍',
      featured: true
    },
    {
      id: 'visualgo',
      name: 'VisuAlgo',
      url: 'https://visualgo.net/zh',
      desc: '数据结构与算法可视化工具，动画演示执行过程。',
      icon: '🎯',
      tags: ['工具', '可视化', '中文'],
      type: '工具',
      featured: true
    },
    {
      id: 'algorithm-visualizer',
      name: 'Algorithm Visualizer',
      url: 'https://algorithm-visualizer.org',
      desc: '交互式算法可视化平台，可逐步执行查看状态。',
      icon: '🔬',
      tags: ['工具', '可视化', '英文'],
      type: '工具',
      featured: false
    },
    {
      id: 'cs-note',
      name: 'CS-Notes',
      url: 'https://github.com/CyC2018/CS-Notes',
      desc: '技术面试必备基础知识，算法与数据结构部分详尽。',
      icon: '🗒️',
      tags: ['仓库', '中文', '面试'],
      type: '仓库',
      featured: false
    },
    {
      id: 'fucking-algorithm',
      name: 'labuladong/fucking-algorithm',
      url: 'https://github.com/labuladong/fucking-algorithm',
      desc: '小抄算法 GitHub 仓库源码，star 数 12w+。',
      icon: '🗂️',
      tags: ['仓库', '中文', '面试'],
      type: '仓库',
      featured: false
    },
    {
      id: 'leetcode-master',
      name: '代码随想录',
      url: 'https://programmercarl.com',
      desc: 'Carl 哥带你刷 LeetCode，按专题系统推进，配套视频。',
      icon: '📒',
      tags: ['文档', '中文', '面试'],
      type: '文档',
      featured: true
    },
    {
      id: 'the-algorithms',
      name: 'The Algorithms',
      url: 'https://the-algorithms.com',
      desc: '多语言算法实现合集，开源仓库，可对照学习实现细节。',
      icon: '🧩',
      tags: ['仓库', '英文', '多语言'],
      type: '仓库',
      featured: false
    },
    {
      id: 'ruanyf-weekly',
      name: '阮一峰科技爱好者周刊',
      url: 'https://www.ruanyifeng.com/blog/weekly/',
      desc: '每周更新的技术周刊，常含算法相关资源与趣题。',
      icon: '📰',
      tags: ['博客', '中文'],
      type: '博客',
      featured: false
    },
    {
      id: 'leetcode-solution',
      name: '力扣题解区',
      url: 'https://leetcode.cn/articles',
      desc: '力扣官方题解与社区精选题解，配合刷题食用。',
      icon: '💡',
      tags: ['题解', '中文'],
      type: '文档',
      featured: false
    }
  ],

  /* ===== 视频教程 ===== */
  videos: [
    {
      id: 'v1',
      title: '数据结构与算法基础（青岛大学 王卓）',
      url: 'https://www.bilibili.com/video/BV1nJ411V7bd',
      desc: '高校经典数据结构课程，系统讲解线性表、树、图等结构。',
      author: '青岛大学',
      duration: 'P1-P80',
      tags: ['基础', '中文', '大学'],
      category: '基础',
      color: 'linear-gradient(135deg, #00e5ff, #3b82f6)'
    },
    {
      id: 'v2',
      title: '算法导论 MIT 6.006',
      url: 'https://www.bilibili.com/video/BV1T7411f7Ym',
      desc: 'MIT 经典算法课，覆盖排序、图算法、动态规划等核心主题。',
      author: 'MIT OCW',
      duration: '23 讲',
      tags: ['进阶', '英文', '名校'],
      category: '进阶',
      color: 'linear-gradient(135deg, #b14eff, #ff2e88)'
    },
    {
      id: 'v3',
      title: '代码随想录 算法训练营',
      url: 'https://www.bilibili.com/video/BV1fV411J7Y7',
      desc: 'Carl 哥按专题带刷 LeetCode，配套网站系统推进。',
      author: '代码随想录',
      duration: '系列',
      tags: ['面试', '中文', '刷题'],
      category: '面试',
      color: 'linear-gradient(135deg, #00ff9d, #00e5ff)'
    },
    {
      id: 'v4',
      title: '董晓算法 算法竞赛教程',
      url: 'https://www.bilibili.com/video/BV1yN411J7Ym',
      desc: 'CSP/NOIP 向竞赛教程，覆盖基础到进阶竞赛算法。',
      author: '董晓',
      duration: '系列',
      tags: ['竞赛', '中文', 'CSP'],
      category: '竞赛',
      color: 'linear-gradient(135deg, #ff9d00, #ff2e88)'
    },
    {
      id: 'v5',
      title: '灵茶山艾府 力扣周赛讲解',
      url: 'https://www.bilibili.com/video/BV1bV411J7Ym',
      desc: '力扣周赛题解，思路清晰，常含巧妙解法。',
      author: '灵茶山艾府',
      duration: '系列',
      tags: ['面试', '中文', '周赛'],
      category: '面试',
      color: 'linear-gradient(135deg, #3b82f6, #b14eff)'
    },
    {
      id: 'v6',
      title: 'AcWing 算法基础课',
      url: 'https://www.acwing.com/activity/content/11/',
      desc: '闫学灿算法基础课，配套刷题，竞赛向系统训练。',
      author: 'AcWing',
      duration: '约 80 课时',
      tags: ['竞赛', '中文', '系统'],
      category: '竞赛',
      color: 'linear-gradient(135deg, #00e5ff, #b14eff)'
    },
    {
      id: 'v7',
      title: '花花酱 LeetCode 题解',
      url: 'https://www.youtube.com/@HuaHuaLeetCode',
      desc: '花花酱 LeetCode 单题精讲，思路与代码并重。',
      author: 'Hua Hua',
      duration: '系列',
      tags: ['面试', '英文', '题解'],
      category: '面试',
      color: 'linear-gradient(135deg, #ff2e88, #ff9d00)'
    },
    {
      id: 'v8',
      title: '极客时间 数据结构与算法之美',
      url: 'https://time.geekbang.org/column/intro/126',
      desc: '王争主讲，从实战角度系统讲解数据结构与算法。',
      author: '王争',
      duration: '72 讲',
      tags: ['系统', '中文', '付费'],
      category: '基础',
      color: 'linear-gradient(135deg, #00ff9d, #3b82f6)'
    },
    {
      id: 'v9',
      title: 'CS61B 数据结构 UC Berkeley',
      url: 'https://sp24.datastructur.es',
      desc: '伯克利数据结构经典课，Java 实现，工程化视角。',
      author: 'UC Berkeley',
      duration: '约 30 讲',
      tags: ['进阶', '英文', '名校'],
      category: '进阶',
      color: 'linear-gradient(135deg, #b14eff, #00e5ff)'
    },
    {
      id: 'v10',
      title: '动态规划专题讲解',
      url: 'https://www.bilibili.com/video/BV1AB4y1w7iB',
      desc: '动态规划从入门到精通，状态定义与转移方程详解。',
      author: '算法刷题',
      duration: '系列',
      tags: ['专题', '中文', 'DP'],
      category: '专题',
      color: 'linear-gradient(135deg, #ff9d00, #00ff9d)'
    },
    {
      id: 'v11',
      title: '图论算法专题',
      url: 'https://www.bilibili.com/video/BV1Ky411J7Ym',
      desc: '最短路、最小生成树、网络流等图论经典算法。',
      author: '算法竞赛',
      duration: '系列',
      tags: ['专题', '中文', '图论'],
      category: '专题',
      color: 'linear-gradient(135deg, #00e5ff, #ff2e88)'
    },
    {
      id: 'v12',
      title: '蓝桥杯算法训练',
      url: 'https://www.bilibili.com/video/BV1hK411J7Ym',
      desc: '蓝桥杯备赛专题，基础算法与常见题型训练。',
      author: '蓝桥学院',
      duration: '系列',
      tags: ['竞赛', '中文', '蓝桥'],
      category: '竞赛',
      color: 'linear-gradient(135deg, #3b82f6, #00ff9d)'
    }
  ],

  /* ===== 算法分类（知识图谱） ===== */
  categories: [
    { name: '数组与字符串', icon: '📊', key: 'array' },
    { name: '链表', icon: '🔗', key: 'list' },
    { name: '栈与队列', icon: '📚', key: 'stack' },
    { name: '树与二叉树', icon: '🌳', key: 'tree' },
    { name: '图论', icon: '🕸️', key: 'graph' },
    { name: '哈希表', icon: '🗂️', key: 'hash' },
    { name: '二分查找', icon: '🎯', key: 'binary' },
    { name: '排序算法', icon: '🔀', key: 'sort' },
    { name: '动态规划', icon: '🧮', key: 'dp' },
    { name: '贪心算法', icon: '💰', key: 'greedy' },
    { name: '回溯算法', icon: '↩️', key: 'backtrack' },
    { name: '位运算', icon: '🔢', key: 'bit' }
  ]
};

/* 学习进度默认配置（各专题掌握度 0-100） */
const DEFAULT_PROGRESS = {
  array: 0, list: 0, stack: 0, tree: 0, graph: 0, hash: 0,
  binary: 0, sort: 0, dp: 0, greedy: 0, backtrack: 0, bit: 0
};
