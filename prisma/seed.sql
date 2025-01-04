-- 插入测试用户
INSERT INTO "User" (name, email, image) VALUES
('张三', 'zhangsan123@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'),
('李四', 'lisi456@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'),
('王五', 'wangwu789@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=3');

-- 插入帖子
INSERT INTO "Post" (title, content, "authorId", images, tags, "createdAt", "updatedAt", published, views) VALUES
('四季养生之春季养生', 
'春季养生重在养肝，以下是一些重要的养生要点：

1. 饮食调养：
- 多食用青绿色蔬菜
- 适当食用酸味食物
- 注意饮食清淡

2. 起居作息：
- 早睡早起，与太阳同步
- 适当运动，舒展筋骨
- 保持心情舒畅

3. 注意事项：
- 防风保暖
- 节制辛辣
- 保持情绪平和

春季养生做好这些，可以帮助我们顺应自然，保持健康。',
1, 
ARRAY['https://images.unsplash.com/photo-1552728089-57bdde30beb3'],
ARRAY['春季养生', '养生之道', '中医养生'],
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP,
true,
100),

('艾灸养生的好处和注意事项',
'艾灸是传统中医养生的重要方法之一，现代研究证实其具有多重保健功效：

1. 主要功效：
- 温经通络
- 驱寒除湿
- 调节气血
- 提高免疫力

2. 适用人群：
- 虚寒体质者
- 关节不适者
- 免疫力低下者

3. 注意事项：
- 注意火候控制
- 避免烫伤
- 选择合适穴位
- 不适人群慎用

4. 最佳时间：
- 早晚进行
- 空腹时避免
- 每次15-20分钟为宜',
1,
ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'],
ARRAY['艾灸', '养生保健', '传统疗法'],
CURRENT_TIMESTAMP - INTERVAL '1 day',
CURRENT_TIMESTAMP - INTERVAL '1 day',
true,
80);

-- 插入评论
INSERT INTO "Comment" (content, "authorId", "postId", images, "createdAt", "updatedAt") VALUES
('这篇文章写得很好，对四季养生有了更深的认识！', 2, 1, ARRAY[]::text[], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('想请教一下春季具体该吃哪些青菜比较好？', 3, 1, ARRAY[]::text[], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 插入评论回复
INSERT INTO "Comment" (content, "authorId", "postId", "parentId", images, "createdAt", "updatedAt") VALUES
('春季可以多吃菠菜、韭菜、芽菜等应季蔬菜。', 1, 1, 2, ARRAY[]::text[], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('感谢解答，这些都很容易买到！', 3, 1, 2, ARRAY[]::text[], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 