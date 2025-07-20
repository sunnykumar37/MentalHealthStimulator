#include "QuoteProvider.h"
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>

std::vector<std::string> QuoteProvider::loadQuotes() {
    std::ifstream in("quotes.txt");
    std::vector<std::string> quotes;
    std::string line;
    while (std::getline(in, line)) {
        if (!line.empty())
            quotes.push_back(line);
    }
    return quotes;
}

std::string QuoteProvider::getRandomQuote() {
    std::vector<std::string> quotes = loadQuotes();
    if (quotes.empty()) return "You're doing great! Keep going!";
    srand(time(0));
    return quotes[rand() % quotes.size()];
} 