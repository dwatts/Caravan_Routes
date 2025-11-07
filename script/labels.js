const labelExpression = `

var label = 'Stop ' + $feature.CaravanStop + ': ' + $feature.City + ', ' + $feature.State + TextFormatting.NewLine + $feature.Date;

return label;
`;

const labelSymbol = {
  type: "label-3d",
  symbolLayers: {
    type: "text",
    material: { color: "#402e32" },
    size: 11,
    background: {
      color: [236, 232, 221, 0.7]
    },
    font: {
      family: "Lato",
      // style: "normal",
      weight: "bold"
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