#!/bin/bash

# Initialize game variables
player_intelligence=50
player_empathy=50
player_fatigue=0
player_day=0
time_of_day="morning"
worked_amount=0
violet_affection=0
violet_neglect_count=0
work_neglect_count=0
# Game state
game_over=false
debug_mode=false

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
VIOLET='\033[1;35m'
BOLD='\033[1m'
ITALIC='\033[3m'
NC='\033[0m' # No Color

# Check for debug flag
if [[ "$1" == "--debug" ]]; then
  debug_mode=true
  echo -e "${YELLOW}Debug mode enabled${NC}"
fi

# Function to clear the screen
clear_screen() {
  clear
}

# Function to display text with typing effect
dialogue() {
  local text="$1"
  local spoken="$2"
  local color="$3"
  local speed="$4"

  if [ "$spoken" = "true" ]; then
    # Start with italic formatting
    echo -en "${ITALIC}"
    echo -en "${color}"

    local i=0
    local current_color="${color}"
    while [ $i -lt ${#text} ]; do
      # Check if we're at a color code
      if [[ "${text:$i:2}" == "\${" ]]; then
        # Find the end of the color code
        local color_start=$i
        local j=$i
        local found=false
        while [ $j -lt ${#text} ]; do
          if [[ "${text:$j:1}" == "}" ]]; then
            found=true
            break
          fi
          j=$((j + 1))
        done

        if [ "$found" = true ]; then
          # Extract the color name
          local color_name="${text:$((color_start + 2)):$((j - color_start - 2))}"
          # Set the new color but maintain italic
          echo -en "${NC}${ITALIC}" # Reset and reapply italic
          case "$color_name" in
          "RED") echo -en "${RED}" ;;
          "GREEN") echo -en "${GREEN}" ;;
          "BLUE") echo -en "${BLUE}" ;;
          "CYAN") echo -en "${CYAN}" ;;
          "YELLOW") echo -en "${YELLOW}" ;;
          "PURPLE") echo -en "${PURPLE}" ;;
          "VIOLET") echo -en "${VIOLET}" ;;
          "NC") echo -en "${NC}${ITALIC}" ;; # Keep italic even when resetting color
          *) echo -en "${color}" ;;
          esac
          # Skip the color code
          i=$((j + 1))
          continue
        fi
      fi

      # Print the character with italic
      echo -en "${ITALIC}"
      echo -n "${text:$i:1}"
      sleep "${speed:-0.03}"
      i=$((i + 1))
    done
    echo -en "${NC}\n"
    read -n 1 -s
  else
    echo -e "$text"
    read -n 1 -s
  fi
}

# Function to research solution
research() {
  # Base values
  local intelligence_gain=$((RANDOM % 6 + 5))
  local empathy_loss=$((RANDOM % 4))

  # Adjust based on intelligence (smarter = more efficient research)
  local intelligence_bonus=$((player_intelligence / 20))
  intelligence_gain=$((intelligence_gain + intelligence_bonus))

  # Adjust based on fatigue (tired = less effective)
  local fatigue_penalty=$((player_fatigue / 2))
  intelligence_gain=$((intelligence_gain - fatigue_penalty))

  # Ensure gains don't go below minimum
  if [ "$intelligence_gain" -lt 2 ]; then intelligence_gain=2; fi

  player_intelligence=$((player_intelligence + intelligence_gain))
  player_empathy=$((player_empathy - empathy_loss))
  if [ "$player_empathy" -lt 0 ]; then player_empathy=0; fi
  worked_amount=$((worked_amount + 1))
  player_fatigue=$((player_fatigue + 1))

  echo -e "\n${BLUE}You spend time researching the solution.${NC}"
  echo -e "Intelligence +${GREEN}$intelligence_gain${NC}, Empathy -${RED}$empathy_loss${NC}"
  echo -e "Fatigue +${RED}1${NC}"
  interlude
}

# Function to interact with violet
interaction() {
  # Base values
  local empathy_gain=$((RANDOM % 5 + 1))
  local intelligence_loss=$((RANDOM % 3))

  # Adjust based on empathy (more empathetic = better interactions)
  local empathy_bonus=$((player_empathy / 20))
  empathy_gain=$((empathy_gain + empathy_bonus))

  # Adjust based on fatigue (tired = less effective)
  local fatigue_penalty=$((player_fatigue / 2))
  empathy_gain=$((empathy_gain - fatigue_penalty))

  # Ensure gains don't go below minimum
  if [ "$empathy_gain" -lt 1 ]; then empathy_gain=1; fi

  violet_affection=$((violet_affection + 1))
  player_empathy=$((player_empathy + empathy_gain))
  player_intelligence=$((player_intelligence - intelligence_loss))
  if [ "$player_intelligence" -lt 0 ]; then player_intelligence=0; fi
  player_fatigue=$((player_fatigue + 1))

  echo -e "\n${BLUE}You stay at home with Violet.${NC}"
  echo -e "Violet's affection +${GREEN}1${NC}"
  echo -e "Empathy +${GREEN}$empathy_gain${NC}, Intelligence -${RED}$intelligence_loss${NC}"
  echo -e "Fatigue +${RED}1${NC}"
  interlude
}

# Function to get player choice
get_choice() {
  local options=("$@")
  local choice

  echo -e "\nOptions:"
  for i in "${!options[@]}"; do
    echo "$((i + 1)). ${options[$i]}"
  done

  while true; do
    read -r -p $'\nYour choice: ' choice
    if [[ $choice =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#options[@]} ]; then
      return "$choice"
    else
      echo "Invalid choice. Try again."
    fi
  done
}

nap() {
  player_fatigue=$((player_fatigue - 1))
  echo -e "\n${BLUE}You take a nap.${NC}"
  echo -e "Fatigue -${GREEN}1${NC}"
  interlude
}

# Function to handle daily actions
daily_actions() {
  while [ "$time_of_day" != "end_of_day" ]; do
    clear_screen

    if [ "$time_of_day" = "morning" ]; then
      echo -e "${GREEN}It's morning.${NC}"
    elif [ "$time_of_day" = "afternoon" ]; then
      echo -e "${BLUE}It's afternoon.${NC}"
    elif [ "$time_of_day" = "evening" ]; then
      echo -e "${YELLOW}It's evening.${NC}"
    fi

    # give options based on state
    case $time_of_day in
    morning)
      get_choice "Take a shift in the lab" "Stay at home for breakfast" "Take a nap"
      choice=$?

      case $choice in
      1) research ;;
      2) interaction ;;
      3) nap ;;
      esac
      ;;
    afternoon)
      get_choice "Take a shift in the lab" "Stay at home for lunch" "Take a nap"
      choice=$?

      case $choice in
      1) research ;;
      2) interaction ;;
      3) nap ;;
      esac
      ;;
    evening)
      get_choice "Take a shift in the lab" "Stay at home for dinner" "Take a nap"
      choice=$?

      case $choice in
      1) research ;;
      2) interaction ;;
      3) nap ;;
      esac
      ;;
    esac

    # increment time of day, or next day
    if [ "$time_of_day" = "evening" ]; then
      time_of_day="end_of_day"
    else
      case $time_of_day in
      morning)
        time_of_day="afternoon"
        ;;
      afternoon)
        time_of_day="evening"
        ;;
      esac
    fi
  done
}

interlude() {
  read -r -p "• • •"
}

# Function to advance to next day
next_day() {
  clear_screen
  player_day=$((player_day + 1))
  time_of_day="morning"

  echo -e "You wake up to a new day."
  # Display March 1st, 2nd, etc. based on player_day
  echo -e "Your calendar reads March $player_day$(date_suffix $player_day)"

  interlude
}

# Helper function to add the correct suffix to the date
date_suffix() {
  case $1 in
  1 | 21 | 31) echo "st" ;;
  2 | 22) echo "nd" ;;
  3 | 23) echo "rd" ;;
  *) echo "th" ;;
  esac
}

# Function to check endings
check_endings() {
  if [ "$solution_progress" -ge 100 ]; then
    echo "sacrifice_love"
  elif [ "$violet_affection" -ge 90 ]; then
    echo "sacrifice_world"
  else
    echo "total_failure"
  fi
}

# Function to end the game
end_game() {
  game_over=true
  local ending
  ending=$(check_endings)

  clear_screen
  echo -e "\n============================================================"
  echo "THE FINAL DAY HAS ARRIVED"
  echo -e "============================================================\n"

  if [ "$ending" = "sacrifice_love" ]; then
    echo "You've done it. The solution is complete. Humanity will survive."
    echo "But as you look around your empty lab on the final night, you realize"
    echo "what it has cost you. Violet tried to reach you, but you were too"
    echo "consumed by your work. The distance between you grew insurmountable."
    echo -e "\nYour name will be remembered in history books, but there will be"
    echo "no one beside you to celebrate. No one who truly knows you."
    echo -e "\nYou saved everyone. Everyone except yourself."

  elif [ "$ending" = "sacrifice_world" ]; then
    echo "The deadline has arrived. Your solution remains incomplete."
    echo "You abandoned your work weeks ago, drawn to the warmth of violet's love."
    echo -e "\nAs sirens blare outside, you hold each other close. The world may be"
    echo "ending, but in Violet's eyes, you found something real. Something human."
    echo -e "\n'Was it worth it?' Violet whispers."
    echo -e "\nYou don't answer. You don't need to. In these final moments,"
    echo "you've found more meaning than you ever did in your research."
    echo -e "\nThe world ends. But for a brief moment, you truly lived."

  else
    echo "You failed. Your solution remains unfinished, your relationship with"
    echo "Violet a series of missed connections and growing resentment."
    echo -e "\nAs the catastrophe begins, you sit alone in your lab, haunted by"
    echo "the ghosts of what could have been. Too little intelligence to save"
    echo "humanity. Too little empathy to save yourself."
    echo -e "\nIn trying to balance both worlds, you succeeded in neither."
  fi

  echo -e "\nTHE END"
  echo -e "\nPress Enter to exit..."
  read -r
}

# Function to display debug information
display_debug_info() {
  if [ "$debug_mode" = true ]; then
    echo -e "\n${YELLOW}===== DEBUG INFO =====${NC}"
    echo -e "Day: $player_day"
    echo -e "Time: $time_of_day"
    echo -e "Intelligence: $player_intelligence"
    echo -e "Empathy: $player_empathy"
    echo -e "Violet Affection: $violet_affection"
    echo -e "Violet Neglect Count: $violet_neglect_count"
    echo -e "Work Amount: $worked_amount"
    echo -e "Work Neglect Count: $work_neglect_count"
    echo -e "${YELLOW}======================${NC}\n"
    read -n 1 -s
  fi
}

morning_events() {
  # HAHA, YOU FOOL!
  # You expected to be able to control the game's ending?
  # There is no way to not neglect both violet and your work, because
  # They each require 2 actions per day and you only get 3.
  expected_affection=$(((player_day - 1) * 2))
  expected_work=$(((player_day - 1) * 2))

  if [ "$debug_mode" = true ]; then
    display_debug_info
  fi

  if [ "$violet_affection" -lt "$expected_affection" ]; then
    violet_neglect_count=$((violet_neglect_count + 1))
    case $violet_neglect_count in
    1)
      dialogue "\${VIOLET}Violet\${NC} seems a bit down." "true" "${NC}" "0.02"
      dialogue "You ask if everything is okay." "true" "${NC}" "0.02"
      dialogue "\${VIOLET}Violet\${NC} nods, but doesn't say anything." "true" "${NC}" "0.02"
      dialogue "You can tell she's holding something back." "true" "${NC}" "0.02"
      ;;
      # TODO: Add more dialogue options
    esac
    interlude
  fi
  if [ "$worked_amount" -lt "$expected_work" ]; then
    work_neglect_count=$((work_neglect_count + 1))
    case $work_neglect_count in
    1)
      dialogue "You haven't gone to the lab as you were expected." "true" "${NC}" "0.02"
      ;;
      # TODO: Add more dialogue options
    esac
    interlude
  fi
}

# Main game function
run_game() {
  # Introduction
  clear_screen

  # Skip intro if in debug mode
  if [ "$debug_mode" = false ]; then
    dialogue "Throughout the story, press enter to continue." "true" "${NC}" "0.02"
    clear_screen
    dialogue "Alex, you're a genius!" "true" "${CYAN}" "0.02"
    dialogue "Imagine how your work will change the world." "true" "${CYAN}" "0.02"
    dialogue "A clean energy source, at a scale never seen before!" "true" "${CYAN}" "0.02"
    dialogue "Well sure, it's amazing in theory..." "true" "${NC}" "0.05"
    dialogue "It won't be theory for much longer!" "true" "${CYAN}" "0.02"
    dialogue "Bzz! Bzz! Bzz!" "true" "${YELLOW}" "0.001"
    dialogue "It's \${VIOLET}Violet\${NC}, I've got to go." "true" "${NC}" "0.02"
    dialogue "Get some rest, you look exhausted. We'll pick this up tomorrow." "true" "${CYAN}" "0.02"
    dialogue "Bzz! Bzz! Bzz!" "true" "${YELLOW}" "0.001"
    dialogue "Hello?" "true" "${NC}" "0.02"
    dialogue "Hi honey, are you coming home soon?" "true" "${VIOLET}" "0.02"
    dialogue "Yeah, I'm on my way." "true" "${NC}" "0.02"
    dialogue "Okay, I love you." "true" "${VIOLET}" "0.02"
    dialogue "Love you too!" "true" "${NC}" "0.02"
    interlude
  else
    echo -e "${YELLOW}Skipping introduction in debug mode${NC}"
    read -n 1 -s
  fi

  # Main game loop
  while [ "$game_over" = "false" ]; do
    clear_screen

    next_day
    morning_events
    daily_actions
    clear_screen
    dialogue "After a long day, you finally get to sleep." "true" "${BLUE}" "0.035"

    if [ "$player_day" -gt 14 ]; then
      end_game
    fi
  done
}

# Start the game
run_game
