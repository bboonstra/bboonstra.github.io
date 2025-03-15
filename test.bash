#!/bin/bash

# Test script for game.bash functionality
echo "Booting up the test."

# Define colors for test results
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
ITALIC='\033[3m'
NC='\033[0m' # No Color

# Variables to track test results
tests_passed=0
tests_failed=0
test_results=()

# Function to record test results
record_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"

    if [ "$result" = "PASS" ]; then
        tests_passed=$((tests_passed + 1))
        test_results+=("${GREEN}✓ PASS${NC}: $test_name - $details")
    else
        tests_failed=$((tests_failed + 1))
        test_results+=("${RED}✗ FAIL${NC}: $test_name - $details")
    fi
}

# Test 1: Check if terminal supports colors
test_colors() {
    echo "Testing color support..."

    # Display color test
    echo -e "${RED}Red${NC} ${GREEN}Green${NC} ${BLUE}Blue${NC} ${CYAN}Cyan${NC} ${YELLOW}Yellow${NC} ${ITALIC}Italic${NC}"

    read -r -p "Can you see different colors and italic text? (y/n): " color_response
    if [[ "$color_response" =~ ^[Yy]$ ]]; then
        record_test "Color support" "PASS" "Terminal supports ANSI color codes"
    else
        record_test "Color support" "FAIL" "Terminal doesn't properly display colors"
    fi
}

# Test 2: Check if clear screen works
test_clear_screen() {
    echo "Testing screen clearing..."
    echo "This text should disappear in 2 seconds..."
    sleep 2
    clear

    read -r -p "Did the terminal just clear, besides this line? (y/n): " clear_response
    if [[ "$clear_response" =~ ^[Yy]$ ]]; then
        record_test "Screen clearing" "PASS" "clear command works properly"
    else
        record_test "Screen clearing" "FAIL" "clear command doesn't work as expected"
    fi
}

# Test 3: Check if sleep command works properly
test_sleep() {
    echo "Testing sleep command (used for text animation)..."
    echo -n "This text should appear character by character: "

    for char in S l o w " " t e x t; do
        echo -n "$char"
        sleep 0.5
    done
    echo

    read -r -p "Did the text appear character by character with delays? (y/n): " sleep_response
    if [[ "$sleep_response" =~ ^[Yy]$ ]]; then
        record_test "Sleep command" "PASS" "sleep command works properly"
    else
        record_test "Sleep command" "FAIL" "sleep command doesn't work as expected"
    fi
}

# Test 4: Check if RANDOM works
test_random() {
    echo "Testing random number generation..."

    local num1=$((RANDOM % 10 + 1))
    sleep 1
    local num2=$((RANDOM % 10 + 1))

    echo "Generated random numbers: $num1 and $num2"

    if [ "$num1" -ne "$num2" ] || [ "$num1" -eq "$num2" ] && [ "$num1" -gt 0 ] && [ "$num1" -le 10 ]; then
        record_test "Random generation" "PASS" "RANDOM variable works properly"
    else
        record_test "Random generation" "FAIL" "RANDOM variable doesn't work as expected"
    fi
}

# Test 5: Check if read command works
test_input() {
    echo "Testing input handling..."

    read -r -p "Type anything and press Enter: " user_input

    if [ -n "$user_input" ]; then
        record_test "Input handling" "PASS" "read command works properly"
    else
        record_test "Input handling" "FAIL" "read command didn't capture input"
    fi
}

# Test 6: Check if bash version is compatible
test_bash_version() {
    echo "Checking your bash version..."

    local version
    version=$(bash --version | head -n 1 | cut -d' ' -f4 | cut -d'.' -f1)

    if [ "$version" -ge 4 ]; then
        record_test "Bash version" "PASS" "Bash version $version is compatible"
    else
        record_test "Bash version" "FAIL" "Bash version $version may be too old (4+ recommended)"
    fi
}

# Test 7: Check terminal size
test_terminal_size() {
    echo "Testing terminal size..."

    local cols
    local lines
    cols=$(tput cols)
    lines=$(tput lines)

    if [ "$cols" -ge 80 ] && [ "$lines" -ge 24 ]; then
        record_test "Terminal size" "PASS" "Terminal size ($cols×$lines) is adequate"
    else
        record_test "Terminal size" "FAIL" "Terminal size ($cols×$lines) may be too small (80×24 recommended)"
    fi
}

# Run all tests
run_tests() {
    test_bash_version
    test_colors
    test_clear_screen
    test_sleep
    test_random
    test_input
    test_terminal_size
}

# Display test results
show_results() {
    clear
    echo "=== Apocalypse Dating Sim Compatibility Test Results ==="
    echo

    for result in "${test_results[@]}"; do
        echo -e "$result"
    done

    echo
    echo "Summary: $tests_passed tests passed, $tests_failed tests failed"
    echo

    if [ "$tests_failed" -eq 0 ]; then
        echo -e "${GREEN}All tests passed! Your system should run the game without issues.${NC}"
    elif [ "$tests_failed" -le 2 ]; then
        echo -e "${YELLOW}Most tests passed. The game should run, but you might encounter minor issues.${NC}"
    else
        echo -e "${RED}Several tests failed. The game may not run correctly on your system.${NC}"
        echo "Common fixes:"
        echo "- Use a terminal that supports ANSI colors (like xterm, iTerm2, or modern Windows Terminal)"
        echo "- Make sure your terminal window is large enough"
        echo "- Update your bash version if possible"
    fi
}

# Main function
main() {
    echo "This test will check if your system can properly run my game."
    echo "You'll need to answer a few questions during the test."
    echo
    read -r -p "Press Enter to begin the test..."

    run_tests
    show_results
}

# Run the main function
main
