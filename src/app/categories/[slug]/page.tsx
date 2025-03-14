import { Category } from '@/components/Category/Category';

export default async function categoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return (
    <div>
      <Category slug={slug} />
    </div>
  );
}
