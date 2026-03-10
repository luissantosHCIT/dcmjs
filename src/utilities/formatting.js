export function applyFormatting(value, filter, raw = true, number = false) {
    const formatFilter = value => {
        if (raw) {
            return value;
        }

        const valueStr = new String(value); // Make sure we convert real numbers into their string format.
        let returnVal = valueStr.trim();

        if (number) {
            returnVal = returnVal.match(filter).at(0);
            return returnVal === "" ? null : Number(returnVal);
        }
        return returnVal;
    };

    if (Array.isArray(value)) {
        return value.map(formatFilter);
    }

    return formatFilter(value);
}
