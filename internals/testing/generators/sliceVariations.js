const sliceNameBase = `generatorTestingSlice`;

export const sliceVariations = () => {
  const variations = [
    {
      sliceName: `${sliceNameBase}1`,
      path: ``,
      wantSaga: true,
    },
    {
      sliceName: `${sliceNameBase}2`,
      path: `/pages/HomePage`,
      wantSaga: false,
    },
    {
      sliceName: `${sliceNameBase}3`,
      path: `/pages/HomePage/Features`,
      wantSaga: true,
    },
  ];

  return variations;
};
