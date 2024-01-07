
import java.util.Arrays;

public class Solution {

    private record Number(String value, int indexOriginalInput){}
    private record Query(int trimPositionFromRightToLeft, int smallestKthNumber, int indexOriginalQueries){}

    public int[] smallestTrimmedNumbers(String[] originalInput, int[][] originalQueries) {

        Number[] numbers = createNumbers(originalInput);
        Query[] queries = createQueries(originalQueries);

        RadixSort radixSort = new RadixSort(numbers);
        Arrays.sort(queries, (x, y) -> x.trimPositionFromRightToLeft - y.trimPositionFromRightToLeft);

        int lengthOfEachOriginalInputValue = originalInput[0].length();
        int maxTrimPositionFromRightToLeft = Math.min(queries[queries.length - 1].trimPositionFromRightToLeft, lengthOfEachOriginalInputValue);

        int indexQueries = 0;
        int[] indexSmallestTrimmedNumbers = new int[queries.length];

        for (int digitPlace = 1; digitPlace <= maxTrimPositionFromRightToLeft; ++digitPlace) {

            radixSort.sortTillDigitPlaceFromRightToLeft(digitPlace);

            while (indexQueries < queries.length && digitPlace == queries[indexQueries].trimPositionFromRightToLeft) {

                int indexResults = queries[indexQueries].indexOriginalQueries;
                int originalIndex = numbers[queries[indexQueries].smallestKthNumber - 1].indexOriginalInput;

                indexSmallestTrimmedNumbers[indexResults] = originalIndex;
                ++indexQueries;
            }
        }

        return indexSmallestTrimmedNumbers;
    }

    private Number[] createNumbers(String[] originalInput) {
        Number[] numbers = new Number[originalInput.length];
        for (int i = 0; i < originalInput.length; ++i) {
            numbers[i] = new Number(originalInput[i], i);
        }
        return numbers;
    }

    private Query[] createQueries(int[][] originalQueries) {
        Query[] queries = new Query[originalQueries.length];
        for (int i = 0; i < originalQueries.length; ++i) {
            queries[i] = new Query(originalQueries[i][1], originalQueries[i][0], i);
        }
        return queries;
    }

    private class RadixSort {

        private static final int NUMBER_OF_DIGITS = 10;
        private final Number[] numbers;

        RadixSort(Number[] numbers) {
            this.numbers = numbers;
        }

        void sortTillDigitPlaceFromRightToLeft(int digitPlace) {
            int[] frequency = new int[NUMBER_OF_DIGITS];
            for (Number n : numbers) {
                int digit = n.value.charAt(n.value.length() - digitPlace) - '0';
                ++frequency[digit];
            }

            int[] positionInSortForCurrentDigit = new int[NUMBER_OF_DIGITS];
            positionInSortForCurrentDigit[0] = frequency[0];
            for (int i = 1; i < NUMBER_OF_DIGITS; ++i) {
                positionInSortForCurrentDigit[i] = frequency[i] + positionInSortForCurrentDigit[i - 1];
            }

            Number[] sortedByCurrentDigit = new Number[numbers.length];
            fillSortedByCurrentDigit(sortedByCurrentDigit, positionInSortForCurrentDigit, digitPlace);
            updateNumbers(sortedByCurrentDigit);
        }

        private void fillSortedByCurrentDigit(Number[] sortedByCurrentDigit, int[] positionInCurrentSort, int digitPlace) {
            for (int i = numbers.length - 1; i >= 0; --i) {
                int digit = numbers[i].value.charAt(numbers[i].value.length() - digitPlace) - '0';
                int index = positionInCurrentSort[digit] - 1;
                sortedByCurrentDigit[index] = numbers[i];
                --positionInCurrentSort[digit];
            }
        }

        private void updateNumbers(Number[] sortedByCurrentDigit) {
            for (int i = 0; i < numbers.length; ++i) {
                numbers[i] = sortedByCurrentDigit[i];
            }
        }
    }
}
