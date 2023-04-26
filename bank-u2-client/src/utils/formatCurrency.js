import { formatValue } from "react-currency-input-field";
export default function formatCurrency(number) {
  return formatValue({
    value: number.toString(),
    groupSeparator: ",",
    decimalSeparator: ".",
    decimalScale: 2,
    intlConfig: { currency: "EUR", locale: "lt" },
  });
}
