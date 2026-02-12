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
        void setDirection(jsi::Runtime& rt, int direction);
        int getScore(jsi::Runtime&);
        jsi::Object getGameState(jsi::Runtime& rt);
        void resetGame(jsi::Runtime& );
    private:
        void resetGameInternal();
        void gameLoop();
        void updateGame();
        void spawnFood();

        static constexpr int ROWS = 20;
        static constexpr int COLS = 20;

        std::vector<std::vector<int>> board;
        std::deque<std::pair<int, int>> snake;
        std::pair<int, int> food;
        std::atomic<bool> gameOver{false};
        std::atomic<int> currentDirection{1}; // RIGHT
        std::atomic<bool> running{true};
        std::atomic<int> score{0};
        std::thread loopThread;
        std::mutex gameMutex;
    };

}
