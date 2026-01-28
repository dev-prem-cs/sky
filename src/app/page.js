import CategoryPills from "./_components/CategoryPills";
import ImageCard from "./_components/ImageCard";

export default function Home() {
  return (
    <main className="min-h-screen pb-24 bg-gray-50"> 
      
      <CategoryPills />

      <div className="p-4">
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <ImageCard 
            title="Mountain View" 
            imageUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
            username="hiker_pro"
          />

          {/* Card 2 */}
          <ImageCard 
            title="Urban Coffee" 
            imageUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
            username="barista_daily"
            description="Nothing beats a fresh brew on a rainy Monday morning. ☕️"
          />

          {/* Card 3 */}
          <ImageCard 
            title="Tech Setup" 
            imageUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            username="code_warrior"
          />

        </div>
      </div>

    </main>
  );
}