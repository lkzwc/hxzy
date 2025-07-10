-- 插入用户数据
INSERT INTO "User" (id, name, email, image) VALUES
(1, '张三', 'zhangsan@example.com', '/images/avatars/avatar1.jpg'),
(2, '李四', 'lisi@example.com', '/images/avatars/avatar2.jpg'),
(3, '王五', 'wangwu@example.com', '/images/avatars/avatar3.jpg');

-- 插入帖子数据
INSERT INTO "Post" (id, title, content, images, published, "createdAt", "updatedAt", tags, views, "authorId") VALUES
(1, '浅谈中医养生之道', '中医养生强调顺应自然、平衡阴阳...', ARRAY['/images/posts/post1-1.jpg', '/images/posts/post1-2.jpg'], true, NOW(), NOW(), ARRAY['养生', '中医理论'], 100, 1),
(2, '四季养生要点总结', '春生、夏长、秋收、冬藏，各季节养生重点...', ARRAY['/images/posts/post2.jpg'], true, NOW(), NOW(), ARRAY['养生', '四季养生'], 150, 2),
(3, '中医体质调理方法', '九种体质的特点及调理方法...', ARRAY['/images/posts/post3.jpg'], true, NOW(), NOW(), ARRAY['体质调理', '中医理论'], 200, 3);

-- 插入评论数据
INSERT INTO "Comment" (id, content, images, "createdAt", "updatedAt", "authorId", "postId", "parentId") VALUES
(1, '文章写得很好，很实用', ARRAY[]::text[], NOW(), NOW(), 2, 1, NULL),
(2, '感谢分享，学到了很多', ARRAY[]::text[], NOW(), NOW(), 3, 1, 1),
(3, '期待更多相关内容', ARRAY[]::text[], NOW(), NOW(), 1, 2, NULL);

-- 插入点赞数据
INSERT INTO "PostLike" ("userId", "postId", "createdAt") VALUES
(1, 2, NOW()),
(2, 1, NOW()),
(3, 1, NOW());

-- 插入医生数据
INSERT INTO "Doctor" (id, name, department, hospital, specialty, phone, province, introduction, avatar, "createdAt", "updatedAt") VALUES
(1, '张伯礼', '中医内科', '天津中医药大学第一附属医院', '呼吸系统疾病', '13800138001', '天津', '国医大师，擅长治疗呼吸系统疾病', '/images/doctors/zhangboli.jpg', NOW(), NOW()),
(2, '仝小林', '中医内科', '中国中医科学院西苑医院', '脾胃病', '13800138002', '北京', '著名中医专家，擅长治疗脾胃病', '/images/doctors/tongxiaolin.jpg', NOW(), NOW()),
(3, '王琦', '中医体质科', '北京中医药大学东直门医院', '体质调理', '13800138003', '北京', '体质学说创始人，擅长体质辨识与调理', '/images/doctors/wangqi.jpg', NOW(), NOW());

-- 插入中药数据
INSERT INTO "ChineseMedicine" (id, name, pinyin, category, properties, effects, description, image, "createdAt", "updatedAt") VALUES
(1, '人参', 'Renshen', '补气药', '性微温，味甘', '大补元气，补脾益肺', '人参为五加科植物人参的干燥根', '/images/medicines/renshen.jpg', NOW(), NOW()),
(2, '当归', 'Danggui', '补血药', '性温，味甘辛', '补血活血，调经止痛', '当归为伞形科植物当归的干燥根', '/images/medicines/danggui.jpg', NOW(), NOW()),
(3, '黄芪', 'Huangqi', '补气药', '性微温，味甘', '补气升阳，固表止汗', '黄芪为豆科植物蒙古黄芪的干燥根', '/images/medicines/huangqi.jpg', NOW(), NOW());

-- 插入方剂数据
INSERT INTO "ClassicalFormula" (id, name, pinyin, source, composition, indications, usage, description, category, "createdAt", "updatedAt") VALUES
(1, '四君子汤', 'Sijunzi Tang', '《太平惠民和剂局方》', '人参、白术、茯苓、甘草', '脾胃虚弱，气虚乏力', '水煎服', '补气健脾的基础方', '补益剂', NOW(), NOW()),
(2, '六味地黄丸', 'Liuwei Dihuang Wan', '《小儿药证直诀》', '熟地黄、山茱萸、山药、泽泻、牡丹皮、茯苓', '肾阴虚证', '口服', '滋补肾阴的代表方', '补益剂', NOW(), NOW()),
(3, '桂枝汤', 'Guizhi Tang', '《伤寒论》', '桂枝、白芍、生姜、大枣、甘草', '太阳中风证', '水煎服', '解表祛风的代表方', '解表剂', NOW(), NOW());

-- 插入课程数据
INSERT INTO "Course" (id, title, instructor, description, "coverImage", category, link, "isVip", "createdAt", "updatedAt") VALUES
(1, '中医基础理论', '张伯礼', '系统讲解中医基础理论', '/images/courses/basic.jpg', '理论基础', 'https://course.tcm.com/basic', false, NOW(), NOW()),
(2, '方剂学精解', '李飞', '深入解析常用方剂', '/images/courses/formula.jpg', '方剂学', 'https://course.tcm.com/formula', true, NOW(), NOW()),
(3, '中医诊断学', '王新月', '中医四诊详解', '/images/courses/diagnosis.jpg', '诊断学', 'https://course.tcm.com/diagnosis', false, NOW(), NOW());

-- 插入电子书数据
INSERT INTO "EBook" (id, title, pinyin, author, dynasty, category, description, "coverImage", link, "isVip", "createdAt", "updatedAt") VALUES
(1, '黄帝内经', 'Huangdi Neijing', '佚名', '战国至秦汉', '经典著作', '中医理论体系的奠基之作', '/images/books/neijing.jpg', 'https://ebook.tcm.com/neijing', true, NOW(), NOW()),
(2, '伤寒论', 'Shanghan Lun', '张仲景', '东汉', '经典著作', '外感病诊治经典', '/images/books/shanghanlun.jpg', 'https://ebook.tcm.com/shanghanlun', true, NOW(), NOW()),
(3, '金匮要略', 'Jingui Yaolue', '张仲景', '东汉', '经典著作', '内科杂病诊治经典', '/images/books/jingui.jpg', 'https://ebook.tcm.com/jingui', true, NOW(), NOW());

-- 插入广告二维码数据
INSERT INTO "AdQrcode" (id, description, "imageUrl", "order", "createdAt") VALUES
('clr8j1k0g0000ml08g9tt3j7x', '关注我们的官方微信公众号，获取最新中医资讯', '/images/qr/official-account.png', 1, NOW()),
('clr8j1k0g0001ml08kj7h4m2y', '加入中医交流群，与同道切磋交流', '/images/qr/wechat-group.png', 2, NOW()),
('clr8j1k0g0002ml08d8jf2k9z', '关注视频号，观看中医讲座直播', '/images/qr/video-account.png', 3, NOW()); 

INSERT INTO "Category" (id, name, "order") VALUES
('1', '内科', 1),
('2', '外科', 2),
('3', '妇科', 3),
('4', '儿科', 4),
('5', '针灸', 5),
('6', '推拿', 6),
('7', '骨伤科', 7),
('8', '皮肤科', 8),
('9', '五官科', 9),
('10', '养生保健', 10),
('11', '肿瘤科', 11),
('12', '心理科', 12);