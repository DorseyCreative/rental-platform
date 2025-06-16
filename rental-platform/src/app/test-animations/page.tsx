'use client'

export default function TestAnimations() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Animation Test Page</h1>
      
      <div className="space-y-8">
        {/* Test animated gradient */}
        <div className="animated-gradient p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold">Animated Gradient Background</h2>
          <p>This should have a shifting gradient animation</p>
        </div>

        {/* Test float animation */}
        <div className="bg-white p-8 rounded-lg shadow-lg float-animation">
          <h2 className="text-2xl font-bold">Floating Element</h2>
          <p>This card should float up and down</p>
        </div>

        {/* Test glass morphism */}
        <div className="glass-morphism p-8 rounded-lg">
          <h2 className="text-2xl font-bold">Glass Morphism</h2>
          <p>This should have a frosted glass effect</p>
        </div>

        {/* Test hover scale */}
        <div className="bg-white p-8 rounded-lg shadow hover-scale cursor-pointer">
          <h2 className="text-2xl font-bold">Hover Scale</h2>
          <p>Hover over this card to see it scale up</p>
        </div>

        {/* Test stagger animation */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded stagger-animation">Card 1</div>
          <div className="bg-white p-4 rounded stagger-animation">Card 2</div>
          <div className="bg-white p-4 rounded stagger-animation">Card 3</div>
        </div>

        {/* Test card hover */}
        <div className="bg-white p-8 rounded-lg shadow card-hover cursor-pointer">
          <h2 className="text-2xl font-bold">Card Hover Effect</h2>
          <p>Hover to see shine effect and elevation</p>
        </div>
      </div>
    </div>
  )
}