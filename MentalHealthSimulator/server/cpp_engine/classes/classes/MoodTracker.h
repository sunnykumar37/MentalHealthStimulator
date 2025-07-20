#ifndef MOOD_TRACKER_H
#define MOOD_TRACKER_H
#include <string>
class MoodTracker {
public:
    void logMood();               // Ask user and save mood to file
    void showMoodHistory();       // Display saved moods
private:
    std::string moodFile = "moods.txt";
};
#endif 