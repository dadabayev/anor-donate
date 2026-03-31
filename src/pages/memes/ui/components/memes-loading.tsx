import cn from '../memes-page.module.css'

export const MemesLoading = ({ title }: { title: string }) => (
  <section className={cn.page}>
    <div className={cn.column}>
      <header className={cn.hero}>
        <h1 className={cn.title}>{title}</h1>
      </header>

      <div className={cn.skeletonCard}>
        <span className={cn.skeletonLine} />
        <span className={cn.skeletonInput} />
      </div>

      <div className={cn.skeletonGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className={cn.skeletonMeme} />
        ))}
      </div>
    </div>
  </section>
)
