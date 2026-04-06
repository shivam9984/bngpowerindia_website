export function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-start gap-4 p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
      <div className="p-3 rounded-lg bg-primary text-primary-foreground">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
