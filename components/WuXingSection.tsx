export default function WuXingSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#F5EDE4] via-[#FAF6F1] to-[#F5EDE4] py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-mystic-900 mb-6">
            五行八卦 · 天人合一
          </h2>
          <p className="text-xl text-mystic-800/90 max-w-2xl mx-auto">
            探索中医文化的核心智慧，感受传统哲学的深邃魅力
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* 五行图 */}
          <div className="relative aspect-square">
            {/* 五行内容 */}
          </div>

          {/* 罗盘部分 */}
          <div className="relative aspect-square">
            {/* 罗盘内容 */}
          </div>
        </div>
      </div>
    </section>
  )
} 