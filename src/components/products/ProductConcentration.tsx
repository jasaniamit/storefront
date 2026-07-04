interface ProductConcentrationProps {
  concentration: string | undefined;
}

export function ProductConcentration({
  concentration,
}: ProductConcentrationProps) {
  if (!concentration) return null;

  const value = concentration.trim();
  const display = value.endsWith("%") ? value : `${value}%`;

  return (
    <div className="mt-8">
      <p className="text-xs font-medium tracking-wide text-gray-500 mb-1">
        Concentration
      </p>
      <p className="text-sm font-medium text-gray-900">{display}</p>
    </div>
  );
}
