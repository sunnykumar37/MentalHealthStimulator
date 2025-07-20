#include "CalmActivity.h"
#include <iostream>
#include <thread>
#include <chrono>

void CalmActivity::startBreathingExercise() {
    std::cout << "\xF0\x9F\xA7\x98 Starting calming breathing session...\n";
    for (int i = 0; i < 3; ++i) {
        std::cout << "\nBreathe in... \xF0\x9F\xAB\x81\n";
        std::this_thread::sleep_for(std::chrono::seconds(4));
        std::cout << "Hold... \xE2\x9C\x8B\n";
        std::this_thread::sleep_for(std::chrono::seconds(4));
        std::cout << "Breathe out... \xF0\x9F\x92\xA8\n";
        std::this_thread::sleep_for(std::chrono::seconds(4));
    }
    std::cout << "\n\xF0\x9F\xA7\x98\xE2\x80\x8D\xE2\x99\x80\xEF\xB8\x8F Session complete. Hope you're feeling more relaxed!\n";
} 