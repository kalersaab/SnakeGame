#include "NativeSnakeModule.h"
#include <chrono>
#include <cstdlib>

using namespace facebook;

namespace facebook::react {

    NativeSnakeModule::NativeSnakeModule(
            std::shared_ptr<CallInvoker> jsInvoker)
            : NativeSnakeModuleCxxSpec(std::move(jsInvoker)) {

        resetGame();
        loopThread = std::thread(&NativeSnakeModule::gameLoop, this);
    }

    NativeSnakeModule::~NativeSnakeModule() {
        running = false;
        if (loopThread.joinable()) loopThread.join();
    }

    void NativeSnakeModule::resetGame() {
        board.assign(ROWS, std::vector<int>(COLS, 0));
        snake.clear();

        // Initial snake (center)
        int r = ROWS / 2;
        int c = COLS / 2;
        snake.push_back({r, c});
        snake.push_back({r, c - 1});
        snake.push_back({r, c - 2});

        for (auto& p : snake) {
            board[p.first][p.second] = 1;
        }

        spawnFood();
        currentDirection = 1; // RIGHT
    }

    void NativeSnakeModule::spawnFood() {
        while (true) {
            int r = rand() % ROWS;
            int c = rand() % COLS;
            if (board[r][c] == 0) {
                board[r][c] = 2;
                food = {r, c};
                return;
            }
        }
    }

    void NativeSnakeModule::gameLoop() {
        while (running) {
            {
                std::lock_guard<std::mutex> lock(gameMutex);
                updateGame();
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
    }

    void NativeSnakeModule::updateGame() {
        auto head = snake.front();
        int dr = 0, dc = 0;

        switch (currentDirection.load()) {
            case 0: dr = -1; break; // UP
            case 1: dc = 1;  break; // RIGHT
            case 2: dr = 1;  break; // DOWN
            case 3: dc = -1; break; // LEFT
        }

        int nr = head.first + dr;
        int nc = head.second + dc;

        // Wall collision
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) {
            resetGame();
            return;
        }

        // Self collision
        if (board[nr][nc] == 1) {
            resetGame();
            return;
        }

        // Move head
        snake.push_front({nr, nc});

        bool ateFood = (board[nr][nc] == 2);
        board[nr][nc] = 1;

        if (!ateFood) {
            auto tail = snake.back();
            snake.pop_back();
            board[tail.first][tail.second] = 0;
        } else {
            spawnFood();
        }
    }

    void NativeSnakeModule::setDirection(jsi::Runtime&, int direction) {
        if (direction < 0 || direction > 3) return;

        int curr = currentDirection.load();
        if ((curr == 0 && direction == 2) ||
            (curr == 2 && direction == 0) ||
            (curr == 1 && direction == 3) ||
            (curr == 3 && direction == 1)) {
            return;
        }

        currentDirection = direction;
    }

    jsi::Array NativeSnakeModule::getBoardState(jsi::Runtime& rt) {
        std::lock_guard<std::mutex> lock(gameMutex);

        jsi::Array jsBoard(rt, ROWS);

        for (int i = 0; i < ROWS; i++) {
            jsi::Array row(rt, COLS);
            for (int j = 0; j < COLS; j++) {
                row.setValueAtIndex(rt, j, board[i][j]);
            }
            jsBoard.setValueAtIndex(rt, i, row);
        }

        return jsBoard;
    }
}
