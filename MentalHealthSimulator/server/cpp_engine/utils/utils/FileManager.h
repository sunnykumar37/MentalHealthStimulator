#ifndef FILEMANAGER_H
#define FILEMANAGER_H
#include <string>
class FileManager {
public:
    void saveToFile(const std::string& filename, const std::string& data);
    std::string readFromFile(const std::string& filename);
};
#endif // FILEMANAGER_H 