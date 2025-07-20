#include "QuoteGenerator.h"
#include <vector>
#include <cstdlib>
#include <ctime>

std::string QuoteGenerator::getRandomQuote() {
    static std::vector<std::string> quotes = {
        "Keep going, you are doing great!",
        "Every day is a second chance.",
        "You are stronger than you think.",
        "Believe in yourself."
    };
    std::srand(static_cast<unsigned int>(std::time(nullptr)));
    int idx = std::rand() % quotes.size();
    return quotes[idx];
} 