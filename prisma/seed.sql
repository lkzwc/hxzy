-- 清空现有数据
TRUNCATE TABLE "ChineseMedicine" CASCADE;
TRUNCATE TABLE "ClassicalFormula" CASCADE;
TRUNCATE TABLE "Course" CASCADE;
TRUNCATE TABLE "EBook" CASCADE;

-- 中药数据
INSERT INTO "ChineseMedicine" (name, pinyin, category, properties, effects, description, image, "createdAt", "updatedAt") VALUES
('人参', 'Renshen', '补虚药', '性微温，味甘微苦', '大补元气，复脉固脱，补脾益肺，生津养血，安神益智', '人参为五加科植物人参的干燥根，以条形完整、质地紧实、个大肥壮者为佳', '/images/medicines/renshen.jpg', NOW(), NOW()),
('当归', 'Danggui', '补血药', '性温，味甘辛', '补血活血，调经止痛，润肠通便', '当归为伞形科植物当归的干燥根，以根大肥壮、质润、色紫褐者为佳', '/images/medicines/danggui.jpg', NOW(), NOW()),
('白术', 'Baizhu', '补气药', '性温，味甘苦', '健脾益气，燥湿利水，止汗，安胎', '白术为菊科植物白术的干燥根茎，以根茎肥大、质坚实、色白者为佳', '/images/medicines/baizhu.jpg', NOW(), NOW()),
('茯苓', 'Fuling', '利水渗湿药', '性平，味甘淡', '利水渗湿，健脾宁心', '茯苓为多孔菌科真菌茯苓的干燥菌核，以质地紧实、色白者为佳', '/images/medicines/fuling.jpg', NOW(), NOW()),
('黄芪', 'Huangqi', '补气药', '性微温，味甘', '补气升阳，益卫固表，利水消肿，生津养血，行滞通痹', '黄芪为豆科植物蒙古黄芪的干燥根，以条形肥壮、质地结实者为佳', '/images/medicines/huangqi.jpg', NOW(), NOW()),
('甘草', 'Gancao', '补气药', '性平，味甘', '补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药', '甘草为豆科植物甘草的干燥根及根茎，以条形粗壮、质地坚实者为佳', '/images/medicines/gancao.jpg', NOW(), NOW()),
('川芎', 'Chuanxiong', '活血化瘀药', '性温，味辛', '活血行气，祛风止痛', '川芎为伞形科植物川芎的干燥根茎，以根茎饱满、质地结实者为佳', '/images/medicines/chuanxiong.jpg', NOW(), NOW()),
('白芍', 'Baishao', '补血药', '性微寒，味苦酸', '养血调经，敛阴止汗，柔肝止痛，平抑肝阳', '白芍为毛茛科植物芍药的干燥根，以根条粗壮、质地结实、色白者为佳', '/images/medicines/baishao.jpg', NOW(), NOW()),
('熟地黄', 'Shudihuang', '补血药', '性微温，味甘', '补血养阴，滋阴补肾', '熟地黄为玄参科植物地黄的干燥块根经加工炮制而成，以质地柔润、色黑亮者为佳', '/images/medicines/shudihuang.jpg', NOW(), NOW()),
('陈皮', 'Chenpi', '理气药', '性温，味辛苦', '理气健脾，燥湿化痰', '陈皮为芸香科植物橘的成熟果皮，以皮薄、色橙黄、气香者为佳', '/images/medicines/chenpi.jpg', NOW(), NOW()),
('半夏', 'Banxia', '化痰止呕药', '性温，味辛', '燥湿化痰，降逆止呕，消痞散结', '半夏为天南星科植物半夏的干燥块茎，以块茎饱满、质地结实者为佳', '/images/medicines/banxia.jpg', NOW(), NOW()),
('黄连', 'Huanglian', '清热燥湿药', '性寒，味苦', '清热燥湿，泻火解毒', '黄连为毛茛科植物黄连的干燥根茎，以根茎粗壮、质地结实、色黄者为佳', '/images/medicines/huanglian.jpg', NOW(), NOW()),
('桂枝', 'Guizhi', '发散风寒药', '性温，味辛甘', '发汗解肌，温通经脉，助阳化气', '桂枝为樟科植物肉桂的干燥嫩枝，以枝条细嫩、气香浓郁者为佳', '/images/medicines/guizhi.jpg', NOW(), NOW()),
('大黄', 'Dahuang', '泻下药', '性寒，味苦', '泻下攻积，清热泻火，凉血解毒，活血祛瘀', '大黄为蓼科植物大黄的干燥根及根茎，以质地结实、断面有花纹者为佳', '/images/medicines/dahuang.jpg', NOW(), NOW()),
('柴胡', 'Chaihu', '解表药', '性微寒，味苦', '和解少阳，升发阳气，疏肝解郁', '柴胡为伞形科植物柴胡的干燥根，以根条细长、质地坚韧者为佳', '/images/medicines/chaihu.jpg', NOW(), NOW());

-- 方剂数据
INSERT INTO "ClassicalFormula" (name, pinyin, source, composition, indications, usage, description, category, "createdAt", "updatedAt") VALUES
('四君子汤', 'Sijunzi Tang', '《太平惠民和剂局方》', '人参、白术、茯苓、甘草', '脾胃虚弱，气虚证。症见：面色萎黄，食欲不振，倦怠乏力，大便溏薄等', '水煎服，每日1剂', '四君子汤是补气的基础方，由四味药组成，具有补脾益气的功效', '补益剂', NOW(), NOW()),
('六味地黄丸', 'Liuwei Dihuang Wan', '《小儿药证直诀》', '熟地黄、山茱萸、山药、泽泻、牡丹皮、茯苓', '肾阴虚证。症见：腰膝酸软，头晕耳鸣，潮热盗汗，遗精等', '口服，每日2次', '六味地黄丸是滋补肾阴的代表方，由六味药组成', '补益剂', NOW(), NOW()),
('补中益气汤', 'Buzhong Yiqi Tang', '《脾胃论》', '黄芪、人参、白术、甘草、当归、陈皮、升麻、柴胡', '脾胃气虚下陷证。症见：倦怠乏力，食欲不振，大便溏薄，脱肛等', '水煎服，每日1剂', '补中益气汤具有补中益气、升举阳气的功效', '补益剂', NOW(), NOW()),
('桂枝汤', 'Guizhi Tang', '《伤寒论》', '桂枝、芍药、生姜、大枣、甘草', '太阳中风证。症见：发热、恶风、汗出、头痛等', '水煎服，每日1剂', '桂枝汤是解表祛风的代表方', '解表剂', NOW(), NOW()),
('麻黄汤', 'Mahuang Tang', '《伤寒论》', '麻黄、桂枝、杏仁、甘草', '太阳伤寒证。症见：发热、无汗、头痛身疼、恶寒等', '水煎服，每日1剂', '麻黄汤是发汗解表的代表方', '解表剂', NOW(), NOW()),
('白虎汤', 'Baihu Tang', '《伤寒论》', '石膏、知母、粳米、甘草', '阳明热证。症见：高热、烦渴、汗出、脉洪大等', '水煎服，每日1剂', '白虎汤具有清热生津的功效', '清热剂', NOW(), NOW()),
('小柴胡汤', 'Xiaochaihu Tang', '《伤寒论》', '柴胡、黄芩、人参、甘草、半夏、生姜、大枣', '少阳病证。症见：往来寒热、胸胁苦满、口苦咽干等', '水煎服，每日1剂', '小柴胡汤是和解少阳的代表方', '和解剂', NOW(), NOW()),
('温病条辨', 'Wenbing Tiaobian', '《温病条辨》', '银花、连翘、竹叶、薄荷、桔梗、甘草', '温病初起。症见：发热、咽痛、口渴等', '水煎服，每日1剂', '银翘散具有疏风清热的功效', '清热剂', NOW(), NOW()),
('二陈汤', 'Erchen Tang', '《和剂局方》', '陈皮、半夏、茯苓、甘草', '痰湿证。症见：痰多、胸闷、脘痞等', '水煎服，每日1剂', '二陈汤是化痰的基础方', '化痰剂', NOW(), NOW()),
('归脾汤', 'Guipi Tang', '《济生方》', '人参、白术、茯苓、甘草、当归、龙眼肉、远志、酸枣仁、木香、生姜', '心脾两虚证。症见：心悸、失眠、健忘、食欲不振等', '水煎服，每日1剂', '归脾汤具有补心安神、健脾益气的功效', '补益剂', NOW(), NOW()),
('天王补心丹', 'Tianwang Buxin Dan', '《摄生秘剖》', '生地黄、玄参、丹参、天门冬、麦门冬、当归、人参、五味子、柏子仁、酸枣仁、远志、朱砂', '心血虚证。症见：心悸、失眠、健忘、多梦等', '口服，每日2次', '天王补心丹具有养心安神的功效', '补益剂', NOW(), NOW()),
('逍遥散', 'Xiaoyao San', '《太平惠民和剂局方》', '柴胡、当归、白芍、白术、茯苓、薄荷、甘草', '肝郁脾虚证。症见：胁肋胀痛、情志不畅、月经不调等', '水煎服，每日1剂', '逍遥散具有疏肝健脾的功效', '解表剂', NOW(), NOW()),
('当归芍药散', 'Danggui Shaoyao San', '《金匮要略》', '当归、白芍、茯苓、白术、泽泻、川芎', '血虚血瘀证。症见：月经不调、少腹疼痛、腰酸等', '水煎服，每日1剂', '当归芍药散具有补血调经的功效', '补益剂', NOW(), NOW()),
('大承气汤', 'Dachengqi Tang', '《伤寒论》', '大黄、厚朴、枳实、芒硝', '阳明腑实证。症见：大便秘结、腹胀满、烦躁等', '水煎服，每日1剂', '大承气汤具有泻下攻积的功效', '泻下剂', NOW(), NOW()),
('甘麦大枣汤', 'Ganmai Dazao Tang', '《金匮要略》', '甘草、小麦、大枣', '心血虚证。症见：心悸、失眠、多梦等', '水煎服，每日1剂', '甘麦大枣汤具有养心安神的功效', '补益剂', NOW(), NOW());

-- 课程数据
INSERT INTO "Course" (title, instructor, description, "coverImage", category, link, "isVip", "createdAt", "updatedAt") VALUES
('中医基础理论入门', '张伯礼', '系统讲解中医学的基本概念、理论体系及诊疗特点，适合中医初学者', '/images/courses/basic-theory.jpg', '理论基础', 'https://course.tcm.com/basic-theory', false, NOW(), NOW()),
('方剂学精解', '李连达', '深入解析常用方剂的组成、功效及临床应用，提高临床用药水平', '/images/courses/formula.jpg', '方剂学', 'https://course.tcm.com/formula', true, NOW(), NOW()),
('中医诊断学实践', '王永炎', '详细讲解四诊的具体运用，提高临床诊断能力', '/images/courses/diagnosis.jpg', '诊断学', 'https://course.tcm.com/diagnosis', false, NOW(), NOW()),
('经络腧穴学', '王琦', '系统介绍人体经络系统和常用腧穴的位置、主治功能', '/images/courses/acupoint.jpg', '经络学', 'https://course.tcm.com/acupoint', false, NOW(), NOW()),
('中药学临床应用', '黄煌', '讲解常用中药的性味、功效、配伍禁忌等，提高用药水平', '/images/courses/medicine.jpg', '中药学', 'https://course.tcm.com/medicine', true, NOW(), NOW()),
('针灸治疗学', '石学敏', '介绍针灸的基本手法和常见疾病的治疗方法', '/images/courses/acupuncture.jpg', '针灸', 'https://course.tcm.com/acupuncture', true, NOW(), NOW()),
('中医内科学', '王玉川', '讲解常见内科疾病的中医诊治方法', '/images/courses/internal-medicine.jpg', '临床医学', 'https://course.tcm.com/internal', true, NOW(), NOW()),
('中医养生保健', '孙光荣', '介绍中医养生理论和实用保健方法', '/images/courses/health.jpg', '养生保健', 'https://course.tcm.com/health', false, NOW(), NOW()),
('中医妇科学', '罗颂平', '系统讲解妇科常见病的中医诊治方法', '/images/courses/gynecology.jpg', '临床医学', 'https://course.tcm.com/gynecology', true, NOW(), NOW()),
('中医儿科学', '马融', '介绍小儿常见病的中医诊治特点', '/images/courses/pediatrics.jpg', '临床医学', 'https://course.tcm.com/pediatrics', true, NOW(), NOW()),
('中医外科学', '李曰庆', '讲解外科常见病的中医诊治方法', '/images/courses/surgery.jpg', '临床医学', 'https://course.tcm.com/surgery', true, NOW(), NOW()),
('中医骨伤科学', '王和鸣', '介绍骨伤科常见病的诊治方法', '/images/courses/orthopedics.jpg', '临床医学', 'https://course.tcm.com/orthopedics', true, NOW(), NOW()),
('中医五官科学', '李社民', '讲解五官科疾病的中医诊治方法', '/images/courses/sense-organs.jpg', '临床医学', 'https://course.tcm.com/sense-organs', true, NOW(), NOW()),
('中医临床思维', '张大宁', '培养中医临床辨证论治的思维方法', '/images/courses/clinical-thinking.jpg', '临床思维', 'https://course.tcm.com/thinking', true, NOW(), NOW()),
('中医经典研习', '李志刚', '深入解读中医经典著作，提高理论水平', '/images/courses/classics.jpg', '经典研习', 'https://course.tcm.com/classics', true, NOW(), NOW());

-- 电子书数据
INSERT INTO "EBook" (title, pinyin, author, dynasty, category, description, "coverImage", link, "isVip", "createdAt", "updatedAt") VALUES
('黄帝内经', 'Huangdi Neijing', '佚名', '战国至秦汉', '经典著作', '中医理论体系的奠基之作，包含素问和灵枢两部分', '/images/books/neijing.jpg', 'https://ebook.tcm.com/neijing', true, NOW(), NOW()),
('伤寒论', 'Shanghan Lun', '张仲景', '东汉', '经典著作', '系统论述外感病的诊断和治疗原则的经典著作', '/images/books/shanghanlun.jpg', 'https://ebook.tcm.com/shanghanlun', true, NOW(), NOW()),
('金匮要略', 'Jingui Yaolue', '张仲景', '东汉', '经典著作', '论述杂病证治的经典著作', '/images/books/jingui.jpg', 'https://ebook.tcm.com/jingui', true, NOW(), NOW()),
('温病条辨', 'Wenbing Tiaobian', '吴鞠通', '清', '经典著作', '系统论述温病的诊断和治疗原则', '/images/books/wenbing.jpg', 'https://ebook.tcm.com/wenbing', true, NOW(), NOW()),
('本草纲目', 'Bencao Gangmu', '李时珍', '明', '本草著作', '最完备的中药学著作，收录药物1892种', '/images/books/bencao.jpg', 'https://ebook.tcm.com/bencao', true, NOW(), NOW()),
('脾胃论', 'Piwei Lun', '李东垣', '金元', '医论著作', '论述脾胃病证的专著', '/images/books/piwei.jpg', 'https://ebook.tcm.com/piwei', false, NOW(), NOW()),
('景岳全书', 'Jingyue Quanshu', '张景岳', '明', '综合著作', '系统总结明代以前医学成就的医学全书', '/images/books/jingyue.jpg', 'https://ebook.tcm.com/jingyue', true, NOW(), NOW()),
('医学心悟', 'Yixue Xinwu', '程国彭', '清', '医论著作', '论述内科疾病诊治的专著', '/images/books/xinwu.jpg', 'https://ebook.tcm.com/xinwu', false, NOW(), NOW()),
('针灸甲乙经', 'Zhengjiu Jiayi Jing', '皇甫谧', '晋', '针灸著作', '最早的针灸专著', '/images/books/jiayi.jpg', 'https://ebook.tcm.com/jiayi', false, NOW(), NOW()),
('难经', 'Nan Jing', '佚名', '汉', '经典著作', '以问答形式解释中医理论的著作', '/images/books/nanjing.jpg', 'https://ebook.tcm.com/nanjing', false, NOW(), NOW()),
('医宗金鉴', 'Yizong Jinjian', '吴谦等', '清', '综合著作', '清代官修医学丛书', '/images/books/jinjian.jpg', 'https://ebook.tcm.com/jinjian', true, NOW(), NOW()),
('本草备要', 'Bencao Beiyao', '汪昂', '清', '本草著作', '常用中药的简明手册', '/images/books/beiyao.jpg', 'https://ebook.tcm.com/beiyao', false, NOW(), NOW()),
('医学入门', 'Yixue Rumen', '李梃', '明', '入门著作', '系统介绍中医基础理论的入门书', '/images/books/rumen.jpg', 'https://ebook.tcm.com/rumen', false, NOW(), NOW()),
('温热论', 'Wenre Lun', '叶天士', '清', '医论著作', '论述温热病诊治的专著', '/images/books/wenre.jpg', 'https://ebook.tcm.com/wenre', false, NOW(), NOW()),
('血证论', 'Xuezheng Lun', '唐容川', '清', '医论著作', '论述血证诊治的专著', '/images/books/xuezheng.jpg', 'https://ebook.tcm.com/xuezheng', false, NOW(), NOW()); 