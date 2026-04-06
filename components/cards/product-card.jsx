import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  onLearnMore,
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden bg-secondary">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <div className="mb-2">
          <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <span className="text-2xl font-bold text-primary">{price}</span>
          <Button
            variant="default"
            size="sm"
            onClick={onLearnMore}
            className="bg-primary hover:bg-accent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </Card>
  )
}
