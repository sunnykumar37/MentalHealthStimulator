#ifndef USER_MANAGER_H
#define USER_MANAGER_H
#include <string>
class UserManager {
public:
    bool login(const std::string& username, const std::string& password);
    bool registerUser(const std::string& username, const std::string& password);
};
#endif 