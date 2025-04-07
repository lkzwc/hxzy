'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ReadOutlined, MedicineBoxOutlined, RightOutlined, FileTextOutlined, ExperimentOutlined, SmileOutlined } from '@ant-design/icons'

const features = [
  {
    title: '中医理论',
    description: '深入了解中医基础理论、诊断方法和治疗原则，掌握传统医学精髓',
    icon: <ReadOutlined className="w-8 h-8" />,
    link: '/zhongyidb/theory',
    color: 'from-primary-100 to-primary-200 text-primary-600'
  },
  {
    title: '诊断方法',
    description: '掌握望闻问切四诊方法，提高临床诊断能力，传承经验技巧',
    icon: <MedicineBoxOutlined className="w-8 h-8" />,
    link: '/zhongyidb/diagnosis',
    color: 'from-secondary-100 to-secondary-200 text-secondary-600'
  },
  {
    title: '中药知识',
    description: '系统学习中药材性味归经、功效与应用，了解药物配伍原理',
    icon: <RightOutlined className="w-8 h-8" />,
    link: '/zhongyidb/herbs',
    color: 'from-accent-100 to-accent-200 text-accent-600'
  },
  {
    title: '经典医籍',
    description: '研读历代医学经典著作，汲取先贤智慧，传承医道精髓',
    icon: <FileTextOutlined className="w-8 h-8" />,
    link: '/zhongyidb/classics',
    color: 'from-primary-100 to-primary-200 text-primary-600'
  },
  {
    title: '现代研究',
    description: '融合现代科技，探索中医药创新发展，推动学科进步',
    icon: <ExperimentOutlined className="w-8 h-8" />,
    link: '/zhongyidb/research',
    color: 'from-secondary-100 to-secondary-200 text-secondary-600'
  },
  {
    title: '养生保健',
    description: '学习中医养生之道，平衡身心，提升生活质量',
    icon: <SmileOutlined className="w-8 h-8" />,
    link: '/zhongyidb/wellness',
    color: 'from-accent-100 to-accent-200 text-accent-600'
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

export default function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/50 to-white pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] -right-48 -top-48 bg-primary-100/40 rounded-full blur-3xl" />
      <div className="absolute w-[400px] h-[400px] -left-24 -bottom-24 bg-accent-100/40 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              探索传统医药智慧
            </h2>
            <p className="text-xl text-neutral-600 leading-relaxed">
              汇集中医药领域精华，助力传统医学发展创新，让古老智慧焕发新生
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <Link href={item.link}>
                <div className="relative h-full bg-white/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-neutral-100">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-neutral-800">{item.title}</h3>
                  <p className="text-neutral-600 mb-6 leading-relaxed">{item.description}</p>
                  <div className="inline-flex items-center text-primary-600 font-medium gap-2 group-hover:gap-4 transition-all">
                    了解更多
                    <SmileOutlined className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}