#ifndef QUOTE_PROVIDER_H
#define QUOTE_PROVIDER_H
#include <string>
#include <vector>
class QuoteProvider {
public:
    std::string getRandomQuote();
private:
    std::vector<std::string> loadQuotes();
};
#endif 