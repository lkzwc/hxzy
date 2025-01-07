import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/zh_CN'

const prisma = new PrismaClient()

const tags = [
  '经方', '养生', '针灸', '中药', '诊断', '心得',
  '饮食调养', '穴位按摩', '四气五味', '望闻问切',
  '经络', '脏腑', '体质调理', '养生保健', '中医理论'
]

async function main() {
  // 创建一个测试用户
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: '测试用户',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
    },
  })

  // 创建100条测试帖子
  const posts = []
  for (let i = 0; i < 100; i++) {
    // 随机选择2-4个标签
    const postTags = faker.helpers.arrayElements(tags, { min: 2, max: 4 })
    
    // 随机生成浏览量
    const views = faker.number.int({ min: 10, max: 1000 })
    
    // 创建帖子
    const post = await prisma.post.create({
      data: {
        title: faker.lorem.sentence({ min: 4, max: 8 }),
        content: faker.lorem.paragraphs({ min: 2, max: 5 }),
        images: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => 
          faker.image.url({ width: 800, height: 600 })
        ),
        tags: postTags,
        views: views,
        authorId: user.id,
        createdAt: faker.date.past({ years: 1 }),
        published: true
      }
    })
    
    // 随机创建0-5个评论
    const commentCount = faker.number.int({ min: 0, max: 5 })
    for (let j = 0; j < commentCount; j++) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.paragraph(),
          images: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => 
            faker.image.url({ width: 400, height: 300 })
          ),
          authorId: user.id,
          postId: post.id
        }
      })
    }
    
    // 随机创建0-10个点赞
    const likeCount = faker.number.int({ min: 0, max: 10 })
    if (likeCount > 0) {
      await prisma.postLike.create({
        data: {
          userId: user.id,
          postId: post.id
        }
      })
    }
    
    posts.push(post)
    console.log(`Created post ${i + 1}/100`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 