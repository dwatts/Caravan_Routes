const labelExpression = `

var label = 'Stop ' + $feature.CaravanStop + ': ' + $feature.City + ', ' + $feature.State + TextFormatting.NewLine + $feature.Date;

return label;
`;

const labelSymbol = {
  type: "label-3d",
  symbolLayers: {
    type: "text",
    material: { color: "black" },
    size: 11,
    background: {
      color: [236, 232, 221, 0.7]
    },
    font: {
      family: "Bodoni Moda",
      style: "normal",
      weight: "normal"
    }
  }
};

const labelClass = [{
    symbol: labelSymbol,
    labelExpressionInfo: {
      expression: labelExpression
    },
    labelPlacement: "above-center"
}];