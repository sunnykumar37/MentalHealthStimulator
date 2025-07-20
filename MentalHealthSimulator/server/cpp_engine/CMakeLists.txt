cmake_minimum_required(VERSION 3.10)
project(MentalHealthSimulator)
set(CMAKE_CXX_STANDARD 11)

include_directories(classes utils)

add_executable(MentalHealthSimulator
    main.cpp
    classes/MoodTracker.cpp
    classes/QuoteGenerator.cpp
    classes/CalmingExercises.cpp
    classes/QuoteProvider.cpp
    classes/CalmActivity.cpp
    classes/UserManager.cpp
    utils/FileManager.cpp
) 