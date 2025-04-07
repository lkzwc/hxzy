import Link from 'next/link'
import { BookOutlined, FileTextOutlined, MedicineBoxOutlined, SmileOutlined, RightOutlined } from '@ant-design/icons'

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-6">
            探索传统医药智慧
          </h2>
          <p className="text-lg text-gray-600">
            汇集中医药领域精华，助力传统医学发展创新
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOutlined,
              title: '经典医著',
              desc: '探索《黄帝内经》、《伤寒论》等中医经典著作的深邃智慧'
            },
            {
              icon: FileTextOutlined,
              title: '方剂研究',
              desc: '分享经方验方的临床运用与现代研究成果'
            },
            {
              icon: MedicineBoxOutlined,
              title: '诊疗心得',
              desc: '交流望闻问切的临床经验与辨证施治的思路方法'
            },
            {
              icon: SmileOutlined,
              title: '养生之道',
              desc: '传承中医养生智慧，实践健康生活方式'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
              <Link 
                href="/community" 
                className="inline-flex items-center text-primary hover:text-primary-focus font-medium gap-2 group-hover:gap-4 transition-all"
              >
                了解更多
                <RightOutlined className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}