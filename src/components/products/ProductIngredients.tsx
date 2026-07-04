import { Badge } from "@/components/ui/badge";
import { splitList } from "@/lib/utils/product-fields";

interface ProductIngredientsProps {
  ingredientsList: string | undefined;
  badges: string | undefined;
}

export function ProductIngredients({
  ingredientsList,
  badges,
}: ProductIngredientsProps) {
  const badgeItems = splitList(badges);

  if (!ingredientsList && badgeItems.length === 0) return null;

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-3">Ingredients</h2>
      {ingredientsList && (
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          {ingredientsList}
        </p>
      )}
      {badgeItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badgeItems.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-3 py-1 h-auto"
            >
              {badge}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
