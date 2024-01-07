
#include <span>
#include <array>
#include <vector>
#include <string>
#include <ranges>
#include <algorithm>
using namespace std;


namespace customDataStructures {

    struct Number {
        string value;
        int indexOriginalInput = 0;
        
        Number() = default;
        Number(string value, int indexOriginalInput) : value{value}, indexOriginalInput{indexOriginalInput}{}
    };

    struct Query {
        int trimPositionFromRightToLeft = 0;
        int smallestKthNumber = 0;
        int indexOriginalQueries = 0;
        
        Query() = default;
        Query(int trimPositionFromRightToLeft, int smallestKthNumber, int indexOriginalQueries) :
        trimPositionFromRightToLeft {trimPositionFromRightToLeft},
        smallestKthNumber {smallestKthNumber},
        indexOriginalQueries {indexOriginalQueries}{}
    };
}

using namespace customDataStructures;

class RadixSort {
    
    static const int NUMBER_OF_DIGITS = 10;
    vector<Number>& numbers;

public:
    explicit RadixSort(vector<Number>& numbers) : numbers{numbers}{}

    void sortTillDigitPlaceFromRightToLeft(int digitPlace) {
        array< int, NUMBER_OF_DIGITS> frequency{};
        for (const auto& n : numbers) {
            int digit = n.value[n.value.length() - digitPlace] - '0';
            ++frequency[digit];
        }

        array< int, NUMBER_OF_DIGITS> positionInSortForCurrentDigit{};
        positionInSortForCurrentDigit[0] = frequency[0];
        for (int i = 1; i < NUMBER_OF_DIGITS; ++i) {
            positionInSortForCurrentDigit[i] = frequency[i] + positionInSortForCurrentDigit[i - 1];
        }

        vector<Number> sortedByCurrentDigit(numbers.size());
        fillSortedByCurrentDigit(sortedByCurrentDigit, positionInSortForCurrentDigit, digitPlace);
        updateNumbers(sortedByCurrentDigit);
    }

private:
    void fillSortedByCurrentDigit(span<Number> sortedByCurrentDigit, span<int> positionInCurrentSort, int digitPlace) const {
        for (size_t i = numbers.size() - 1; i != variant_npos; --i) {
            int digit = numbers[i].value[numbers[i].value.length() - digitPlace] - '0';
            int index = positionInCurrentSort[digit] - 1;
            sortedByCurrentDigit[index] = numbers[i];
            --positionInCurrentSort[digit];
        }
    }

    void updateNumbers(span<const Number> sortedByCurrentDigit) {
        for (size_t i = 0; i < numbers.size(); ++i) {
            numbers[i] = sortedByCurrentDigit[i];
        }
    }
};

class Solution {
    
public:
    vector<int> smallestTrimmedNumbers(const vector<string>& originalInput, const vector<vector<int>>& originalQueries) const {
        vector< Number> numbers = createNumbers(originalInput);
        vector<Query> queries = createQueries(originalQueries);

        unique_ptr<RadixSort> radixSort {make_unique<RadixSort>(numbers)};

        auto compareTrimPosition = [](const Query& x, const Query& y) {
            return x.trimPositionFromRightToLeft < y.trimPositionFromRightToLeft;
        };
        ranges::sort(queries, compareTrimPosition);

        int lengthOfEachOriginalInputValue = originalInput[0].length();
        int maxTrimPositionFromRightToLeft = min(queries[queries.size() - 1].trimPositionFromRightToLeft, lengthOfEachOriginalInputValue);

        int indexQueries = 0;
        vector<int> indexSmallestTrimmedNumbers(queries.size());

        for (int digitPlace = 1; digitPlace <= maxTrimPositionFromRightToLeft; ++digitPlace) {

            radixSort->sortTillDigitPlaceFromRightToLeft(digitPlace);

            while (indexQueries < queries.size() && digitPlace == queries[indexQueries].trimPositionFromRightToLeft) {

                int indexResults = queries[indexQueries].indexOriginalQueries;
                int originalIndex = numbers[queries[indexQueries].smallestKthNumber - 1].indexOriginalInput;

                indexSmallestTrimmedNumbers[indexResults] = originalIndex;
                ++indexQueries;
            }
        }

        return indexSmallestTrimmedNumbers;
    }

private:
    vector<Number> createNumbers(span<const string> originalInput) const {
        vector< Number> numbers;
        for (size_t i = 0; i < originalInput.size(); ++i) {
            numbers.emplace_back(originalInput[i], i);
        }
        return numbers;
    }

    vector<Query> createQueries(span<const vector<int>> originalQueries) const {
        vector<Query> queries;
        for (int i = 0; i < originalQueries.size(); ++i) {
            queries.emplace_back(originalQueries[i][1], originalQueries[i][0], i);
        }
        return queries;
    }
};
