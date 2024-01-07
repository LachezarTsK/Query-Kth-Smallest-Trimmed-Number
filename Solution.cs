
using System;
using customDataStructures;

namespace customDataStructures
{
    struct Number
    {
        public string value;
        public int indexOriginalInput = 0;
        public Number(string value, int indexOriginalInput)
        {
            this.value = value;
            this.indexOriginalInput = indexOriginalInput;
        }
    }

    struct Query
    {
        public int trimPositionFromRightToLeft = 0;
        public int smallestKthNumber = 0;
        public int indexOriginalQueries = 0;

        public Query(int trimPositionFromRightToLeft, int smallestKthNumber, int indexOriginalQueries)
        {
            this.trimPositionFromRightToLeft = trimPositionFromRightToLeft;
            this.smallestKthNumber = smallestKthNumber;
            this.indexOriginalQueries = indexOriginalQueries;
        }

    }
}

public class Solution
{
    public int[] SmallestTrimmedNumbers(string[] originalInput, int[][] originalQueries)
    {

        Number[] numbers = CreateNumbers(originalInput);
        Query[] queries = CreateQueries(originalQueries);

        RadixSort radixSort = new RadixSort(numbers);
        Array.Sort(queries, (x, y) => x.trimPositionFromRightToLeft - y.trimPositionFromRightToLeft);

        int lengthOfEachOriginalInputValue = originalInput[0].Length;
        int maxTrimPositionFromRightToLeft = Math.Min(queries[queries.Length - 1].trimPositionFromRightToLeft, lengthOfEachOriginalInputValue);

        int indexQueries = 0;
        int[] indexSmallestTrimmedNumbers = new int[queries.Length];

        for (int digitPlace = 1; digitPlace <= maxTrimPositionFromRightToLeft; ++digitPlace)
        {
            radixSort.SortTillDigitPlaceFromRightToLeft(digitPlace);

            while (indexQueries < queries.Length && digitPlace == queries[indexQueries].trimPositionFromRightToLeft)
            {

                int indexResults = queries[indexQueries].indexOriginalQueries;
                int originalIndex = numbers[queries[indexQueries].smallestKthNumber - 1].indexOriginalInput;

                indexSmallestTrimmedNumbers[indexResults] = originalIndex;
                ++indexQueries;
            }
        }

        return indexSmallestTrimmedNumbers;
    }

    private Number[] CreateNumbers(String[] originalInput)
    {
        Number[] numbers = new Number[originalInput.Length];
        for (int i = 0; i < originalInput.Length; ++i)
        {
            numbers[i] = new Number(originalInput[i], i);
        }
        return numbers;
    }

    private Query[] CreateQueries(int[][] originalQueries)
    {
        Query[] queries = new Query[originalQueries.Length];
        for (int i = 0; i < originalQueries.Length; ++i)
        {
            queries[i] = new Query(originalQueries[i][1], originalQueries[i][0], i);
        }
        return queries;
    }
}


class RadixSort
{

    private static readonly int NUMBER_OF_DIGITS = 10;
    private readonly Number[] numbers;

    public RadixSort(Number[] numbers)
    {
        this.numbers = numbers;
    }

    public void SortTillDigitPlaceFromRightToLeft(int digitPlace)
    {
        int[] frequency = new int[NUMBER_OF_DIGITS];
        foreach (Number n in numbers)
        {
            int digit = n.value[n.value.Length - digitPlace] - '0';
            ++frequency[digit];
        }

        int[] positionInSortForCurrentDigit = new int[NUMBER_OF_DIGITS];
        positionInSortForCurrentDigit[0] = frequency[0];
        for (int i = 1; i < NUMBER_OF_DIGITS; ++i)
        {
            positionInSortForCurrentDigit[i] = frequency[i] + positionInSortForCurrentDigit[i - 1];
        }

        Number[] sortedByCurrentDigit = new Number[numbers.Length];
        FillSortedByCurrentDigit(sortedByCurrentDigit, positionInSortForCurrentDigit, digitPlace);
        UpdateNumbers(sortedByCurrentDigit);
    }

    private void FillSortedByCurrentDigit(Number[] sortedByCurrentDigit, int[] positionInCurrentSort, int digitPlace)
    {
        for (int i = numbers.Length - 1; i >= 0; --i)
        {
            int digit = numbers[i].value[numbers[i].value.Length - digitPlace] - '0';
            int index = positionInCurrentSort[digit] - 1;
            sortedByCurrentDigit[index] = numbers[i];
            --positionInCurrentSort[digit];
        }
    }

    private void UpdateNumbers(Number[] sortedByCurrentDigit)
    {
        for (int i = 0; i < numbers.Length; ++i)
        {
            numbers[i] = sortedByCurrentDigit[i];
        }
    }
}
