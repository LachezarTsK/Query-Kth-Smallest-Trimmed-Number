
/**
 * @param {string[]} originalInput
 * @param {number[][]} originalQueries
 * @return {number[]}
 */
var smallestTrimmedNumbers = function (originalInput, originalQueries) {

    const numbers = createNumbers(originalInput);
    const queries = createQueries(originalQueries);

    const radixSort = new RadixSort(numbers);
    queries.sort((x, y) => x.trimPositionFromRightToLeft - y.trimPositionFromRightToLeft);

    let lengthOfEachOriginalInputValue = originalInput[0].length;
    let maxTrimPositionFromRightToLeft = Math.min(queries[queries.length - 1].trimPositionFromRightToLeft, lengthOfEachOriginalInputValue);

    let indexQueries = 0;
    let indexSmallestTrimmedNumbers = new Array(queries.length);

    for (let digitPlace = 1; digitPlace <= maxTrimPositionFromRightToLeft; ++digitPlace) {

        radixSort.sortTillDigitPlaceFromRightToLeft(digitPlace);

        while (indexQueries < queries.length && digitPlace === queries[indexQueries].trimPositionFromRightToLeft) {

            let indexResults = queries[indexQueries].indexOriginalQueries;
            let originalIndex = numbers[queries[indexQueries].smallestKthNumber - 1].indexOriginalInput;

            indexSmallestTrimmedNumbers[indexResults] = originalIndex;
            ++indexQueries;
        }
    }

    return indexSmallestTrimmedNumbers;
};

/**
 * @param {string} value
 * @param {number} indexOriginalInput
 */
function Number(value, indexOriginalInput) {
    this.value = value;
    this.indexOriginalInput = indexOriginalInput;
}

/**
 * @param {number} trimPositionFromRightToLeft
 * @param {number} smallestKthNumber
 * @param {number} indexOriginalQueries
 */
function Query(trimPositionFromRightToLeft, smallestKthNumber, indexOriginalQueries) {
    this.trimPositionFromRightToLeft = trimPositionFromRightToLeft;
    this.smallestKthNumber = smallestKthNumber;
    this.indexOriginalQueries = indexOriginalQueries;
}

/**
 * @param {Number[][]} originalInput
 * @return {Query[]}
 */
function createNumbers(originalInput) {
    const numbers = new Array(originalInput.length);
    for (let i = 0; i < originalInput.length; ++i) {
        numbers[i] = new Number(originalInput[i], i);
    }
    return numbers;
}

/**
 * @param {number[][]} originalQueries
 * @return {Query[]}
 */
function createQueries(originalQueries) {
    const queries = new Array(originalQueries.length);
    for (let i = 0; i < originalQueries.length; ++i) {
        queries[i] = new Query(originalQueries[i][1], originalQueries[i][0], i);
    }
    return queries;
}

class RadixSort {

    static NUMBER_OF_DIGITS = 10;
    static ASCII_ZERO = 48;

    /**
     * @param {Number[]} numbers
     */
    constructor(numbers) {
        this.numbers = numbers;
    }

    /**
     * @param {number} digitPlace
     * @return {void}
     */
    sortTillDigitPlaceFromRightToLeft(digitPlace) {
        const frequency = new Array(RadixSort.NUMBER_OF_DIGITS).fill(0);
        for (let n of this.numbers) {
            let digit = n.value.codePointAt(n.value.length - digitPlace) - RadixSort.ASCII_ZERO;
            ++frequency[digit];
        }

        const positionInSortForCurrentDigit = new Array(RadixSort.NUMBER_OF_DIGITS).fill(0);
        positionInSortForCurrentDigit[0] = frequency[0];
        for (let i = 1; i < RadixSort.NUMBER_OF_DIGITS; ++i) {
            positionInSortForCurrentDigit[i] = frequency[i] + positionInSortForCurrentDigit[i - 1];
        }

        const sortedByCurrentDigit = new Array(this.numbers.length);
        this.fillSortedByCurrentDigit(sortedByCurrentDigit, positionInSortForCurrentDigit, digitPlace);
        this.updateNumbers(sortedByCurrentDigit);
    }

    /**
     * @param {Number[]} sortedByCurrentDigit
     * @param {Number[][]} positionInCurrentSort
     * @param {number} digitPlace
     * @return {void}
     */
    fillSortedByCurrentDigit(sortedByCurrentDigit, positionInCurrentSort, digitPlace) {
        for (let i = this.numbers.length - 1; i >= 0; --i) {
            let digit = this.numbers[i].value.codePointAt(this.numbers[i].value.length - digitPlace) - RadixSort.ASCII_ZERO;
            let index = positionInCurrentSort[digit] - 1;
            sortedByCurrentDigit[index] = this.numbers[i];
            --positionInCurrentSort[digit];
        }
    }

    /**
     * @param {Number[]} sortedByCurrentDigit
     * @return {void}
     */
    updateNumbers(sortedByCurrentDigit) {
        for (let i = 0; i < this.numbers.length; ++i) {
            this.numbers[i] = sortedByCurrentDigit[i];
        }
    }
}
