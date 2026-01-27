import CategoryPills from "./_components/CategoryPills";

export default function Home() {
  return (
    <main className="min-h-screen pb-20"> {/* pb-20 to avoid overlap with bottom nav */}
      
      {/* The Tags go here */}
      <CategoryPills />

      {/* Your Page Content */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Recommended Videos</h1>
        <p className="text-gray-600">
          Scroll horizontally on the tags above to see the effect.
        </p>
        {/* Add more content here to test scrolling */}
      </div>

    </main>
  );
}