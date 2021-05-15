const containerNameBase = `GeneratorTestingComponent`;

export const componentVariations = () => {
  const variations = [];

  // Test all the component generator options against each other
  const allCombinations = permuatateBooleans(5);
  for (let i = 0; i < allCombinations.length; i++) {
    const values = allCombinations[i];
    variations.push({
      componentName: `${containerNameBase}${i}`,
      path: ``,
      wantLoadable: values[0],
      wantMemo: values[1],
      wantStyledComponents: values[2],
      wantTests: values[3],
      wantTranslations: values[4],
    });
  }

  // Test some paths
  const paths = [
    '/components',
    '/pages/HomePage/Features',
    '/pages/HomePage/Features/GithubRepoForm',
  ];
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    variations.push({
      componentName: `${containerNameBase}${i}`,
      path: `${path}`,
      wantLoadable: true,
      wantMemo: true,
      wantStyledComponents: true,
      wantTests: true,
      wantTranslations: true,
    });
  }
  return variations;
};

// Create  true, false permutation of a length in an array form
export function permuatateBooleans(length) {
  const array = [];
  for (let i = 0; i < 1 << length; i++) {
    const items = [];
    for (let j = length - 1; j > 0; j--) {
      items.push(!!(i & (1 << j)));
    }
    array.push([...items, !!(i & 1)]);
  }
  return array;
}
