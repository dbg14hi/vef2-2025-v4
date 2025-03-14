import { Category } from '@/components/Category/Category';

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  return (
    <div>
      <Category slug={slug} />
    </div>
  );
}
