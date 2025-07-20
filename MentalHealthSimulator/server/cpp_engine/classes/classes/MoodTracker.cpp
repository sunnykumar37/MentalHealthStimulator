#include "MoodTracker.h"
#include <iostream>
#include <fstream>
#include <ctime>

void MoodTracker::logMood() {
    std::string mood;
    std::cout << "How are you feeling today? ";
    std::getline(std::cin, mood);

    std::ofstream out(moodFile, std::ios::app);
    if (out.is_open()) {
        time_t now = time(0);
        out << ctime(&now) << " - " << mood << "\n";
        out.close();
        std::cout << "Mood logged successfully!\n";
    } else {
        std::cerr << "Error: Could not open file.\n";
    }
}

void MoodTracker::showMoodHistory() {
    std::ifstream in(moodFile);
    if (in.is_open()) {
        std::string line;
        std::cout << "\nMood History:\n";
        while (std::getline(in, line)) {
            std::cout << line << "\n";
        }
        in.close();
    } else {
        std::cerr << "No mood history found.\n";
    }
} 