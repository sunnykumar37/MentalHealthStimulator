#include "FileManager.h"
#include <fstream>
void FileManager::saveToFile(const std::string& filename, const std::string& data) {
    std::ofstream file(filename);
    if (file.is_open()) {
        file << data;
        file.close();
    }
}
std::string FileManager::readFromFile(const std::string& filename) {
    std::ifstream file(filename);
    std::string data, line;
    if (file.is_open()) {
        while (std::getline(file, line)) {
            data += line + "\n";
        }
        file.close();
    }
    return data;
} 