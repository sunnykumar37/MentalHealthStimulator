#include "UserManager.h"
#include <fstream>
#include <iostream>

bool UserManager::login(const std::string& username, const std::string& password) {
    std::ifstream file("users.txt");
    std::string line;
    while (getline(file, line)) {
        if (line == username + "," + password) {
            return true;
        }
    }
    return false;
}

bool UserManager::registerUser(const std::string& username, const std::string& password) {
    std::ifstream file("users.txt");
    std::string line;
    while (getline(file, line)) {
        if (line.substr(0, line.find(',')) == username) {
            return false; // username exists
        }
    }
    std::ofstream outfile("users.txt", std::ios::app);
    outfile << username << "," << password << "\n";
    return true;
} 