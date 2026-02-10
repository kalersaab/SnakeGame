#pragma once

#include <jsi/jsi.h>
#include <SnakeSpecsJSI.h>
#include <vector>
#include <deque>
#include <atomic>
#include <thread>
#include <mutex>

namespace facebook::react {

    class NativeSnakeModule : public NativeSnakeModuleCxxSpec<NativeSnakeModule> {
    public:
        explicit NativeSnakeModule(std::shared_ptr<CallInvoker> jsInvoker);
        ~NativeSnakeModule();
        jsi::Array getBoardState(jsi::Runtime& rt);
        void setDirection(jsi::Runtime& rt, int direction);
    private:
        void gameLoop();
        void updateGame();
        void resetGame();
        void spawnFood();

        static constexpr int ROWS = 10;
        static constexpr int COLS = 10;

        std::vector<std::vector<int>> board;
        std::deque<std::pair<int, int>> snake;
        std::pair<int, int> food;

        std::atomic<int> currentDirection{1}; // RIGHT
        std::atomic<bool> running{true};
        std::thread loopThread;
        std::mutex gameMutex;
    };

}
