-- 插入测试用户
INSERT INTO "User" (name, email, image, username, "createdAt", "updatedAt")
VALUES (
  'xAI官方',
  'xai@example.com',
  'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
  'xAI',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 获取插入的用户ID
DO $$
DECLARE
  user_id INT;
BEGIN
  SELECT id INTO user_id FROM "User" WHERE email = 'xai@example.com';

  -- 插入测试帖子
  INSERT INTO "Post" (title, content, published, "authorId", "createdAt", "updatedAt", views, likes, tags)
  VALUES
  (
    'xAI发布首个AI模型Grok',
    E'我们很高兴地宣布推出我们的第一个AI模型Grok。\n\nGrok是一个对话式AI，它可以实时访问X平台上的信息。它具有反应迅速、幽默感强的特点，并且愿意回答其他AI可能会回避的尖锐或挑衅性问题。\n\n主要特点：\n1. 实时知识获取\n2. 幽默对话风格\n3. 广泛的知识储备\n4. 强大的推理能力\n\n我们相信，Grok将为用户带来全新的AI交互体验。',
    true,
    user_id,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    1500,
    326,
    ARRAY['AI', '人工智能', 'xAI', 'Grok']
  ),
  (
    'Grok与ChatGPT的对比测试',
    E'今天我们进行了Grok与ChatGPT的全面对比测试。\n\n测试领域：\n1. 数学推理\n2. 代码编写\n3. 创意写作\n4. 实时信息获取\n5. 幽默感表现\n\n测试结果显示，Grok在实时信息和幽默对话方面表现出色，而在某些专业领域的深度上还需要继续改进。\n\n详细测试数据和分析将在后续更新。',
    true,
    user_id,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    2100,
    458,
    ARRAY['AI对比', 'ChatGPT', 'Grok', '测试']
  ),
  (
    'xAI的技术发展路线图',
    E'我们规划了xAI未来的技术发展路线：\n\n近期目标：\n1. 提升Grok的知识深度\n2. 增强多语言支持\n3. 优化推理能力\n\n中期规划：\n1. 开发专业领域模型\n2. 提供API接口\n3. 推出开发者工具\n\n长期愿景：\n1. 构建AGI基础\n2. 推动AI安全发展\n3. 促进AI民主化\n\n我们将持续更新进展情况。',
    true,
    user_id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    980,
    245,
    ARRAY['技术规划', 'AI发展', 'xAI', '路线图']
  );

  -- 插入一些测试评论
  INSERT INTO "Comment" (content, "postId", "authorId", "createdAt", "updatedAt")
  SELECT
    unnest(ARRAY[
      '这是一个重大突破！期待Grok的表现。',
      '实时访问X平台信息这个特性很有创新性。',
      '幽默感是一个很好的差异化特点。'
    ]),
    (SELECT id FROM "Post" WHERE title LIKE '%首个AI模型Grok%'),
    user_id,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '1 day';

  INSERT INTO "Comment" (content, "postId", "authorId", "createdAt", "updatedAt")
  SELECT
    unnest(ARRAY[
      '期待看到详细的测试数据。',
      '实时信息获取确实是一个很大的优势。',
      '建议增加更多专业领域的测试。'
    ]),
    (SELECT id FROM "Post" WHERE title LIKE '%对比测试%'),
    user_id,
    CURRENT_TIMESTAMP - INTERVAL '12 hours',
    CURRENT_TIMESTAMP - INTERVAL '12 hours';
END $$; 