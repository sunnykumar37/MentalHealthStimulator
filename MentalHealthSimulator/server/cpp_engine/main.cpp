#include <iostream>
#include <string>
#include "classes/MoodTracker.h"
#include "classes/QuoteProvider.h"
#include "classes/CalmingExercises.h"
#include "classes/CalmActivity.h"
#include "classes/UserManager.h"

void showLandingPage() {
    std::cout << "==============================\n";
    std::cout << "   \xF0\x9F\x8C\xBF Mental Health Simulator \xF0\x9F\x8C\xBF\n";
    std::cout << "==============================\n";
    std::cout << "  1. Login\n";
    std::cout << "  2. Register\n";
    std::cout << "  3. Exit\n";
    std::cout << "------------------------------\n";
    std::cout << "Choose an option: ";
}

// Placeholder login function
bool login() {
    std::cout << "[Login placeholder] Login successful!\n";
    return true;
}

// Placeholder register function
bool registerUser() {
    std::cout << "[Register placeholder] Registration successful!\n";
    return true;
}

void showMainMenu() {
    int choice;
    CalmingExercises exercises;
    do {
        std::cout << "\nMenu:\n";
        std::cout << "1. Track Mood\n";
        std::cout << "2. Get a Motivational Quote\n";
        std::cout << "3. Do a Calming Exercise\n";
        std::cout << "4. Guided Breathing Exercise\n";
        std::cout << "5. Exit\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;
        std::cin.ignore();
        switch (choice) {
            case 1: {
                MoodTracker mood;
                mood.logMood();
                mood.showMoodHistory();
                break;
            }
            case 2: {
                QuoteProvider qp;
                std::cout << "Here's a motivational quote for you: \n";
                std::cout << qp.getRandomQuote() << "\n";
                break;
            }
            case 3:
                exercises.doExercise();
                break;
            case 4: {
                CalmActivity calm;
                calm.startBreathingExercise();
                break;
            }
            case 5:
                std::cout << "Goodbye! Take care of your mental health.\n";
                break;
            default:
                std::cout << "Invalid choice. Please try again.\n";
        }
    } while (choice != 5);
}

int main() {
    int option;
    UserManager userManager;
    showLandingPage();
    std::cin >> option;
    bool proceed = false;
    switch(option) {
        case 1: {  // Login
            std::string u, p;
            std::cout << "Username: ";
            std::cin >> u;
            std::cout << "Password: ";
            std::cin >> p;
            if (userManager.login(u, p)) {
                std::cout << "\xE2\x9C\x85 Login successful!\n";
                proceed = true;
            } else {
                std::cout << "\xE2\x9D\x8C Login failed.\n";
            }
            break;
        }
        case 2: {  // Register
            std::string u, p;
            std::cout << "Choose Username: ";
            std::cin >> u;
            std::cout << "Choose Password: ";
            std::cin >> p;
            if (userManager.registerUser(u, p)) {
                std::cout << "\xE2\x9C\x85 Registered successfully. You can login now.\n";
            } else {
                std::cout << "\xE2\x9A\xA0\xEF\xB8\x8F Username already exists. Try again.\n";
            }
            break;
        }
        case 3:
            std::cout << "\xF0\x9F\x91\x8B Goodbye!\n";
            return 0;
        default:
            std::cout << "\xE2\x9D\x8C Invalid choice. Try again.\n";
            return 0;
    }
    if (proceed) {
        showMainMenu();
    }
    return 0;
} 