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
solution_progress=0
FLAG_learned_the_truth=false
FLAG_solved_the_problem=false
FLAG_violet_secondary=false
FLAG_violet_left=false
FLAG_fired=false
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
GRAY='\033[0;90m'
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
  if [ "$FLAG_solved_the_problem" = true ]; then
    dialogue "Your boss gave the rest of the week off for your hard work." "true" "${GRAY}" "0.01"
    echo -e "\n${GRAY}Fatigue reset!${NC}"
    interlude
    player_fatigue=0
    return
  fi
  if [ "$FLAG_fired" = true ]; then
    dialogue "...you're fired. you can't go to the lab." "true" "${GRAY}" "0.03"
    interlude
    return
  fi
  # Base values
  local intelligence_gain=$((RANDOM % 4 + 3))
  local empathy_loss=$((RANDOM % 4))

  # Adjust based on fatigue (tired = less effective)
  local fatigue_penalty=$((player_fatigue / 3))
  intelligence_gain=$((intelligence_gain - fatigue_penalty))

  # Ensure gains don't go below minimum
  if [ "$intelligence_gain" -lt 2 ]; then intelligence_gain=2; fi

  player_intelligence=$((player_intelligence + intelligence_gain))
  player_empathy=$((player_empathy - empathy_loss))
  if [ "$player_empathy" -lt 0 ]; then player_empathy=0; fi
  worked_amount=$((worked_amount + 1))
  # solution progress is gained based on normalized natural log of player_intelligence
  local solution_gain=$(((3 + (player_intelligence - 25) / 25) / (1 + fatigue_penalty)))
  solution_progress=$((solution_progress + solution_gain))
  player_fatigue=$((player_fatigue + 1))

  if [ "$debug_mode" = true ]; then
    echo -e "Gained $intelligence_gain intelligence"
    echo -e "Lost $empathy_loss empathy"
    echo -e "Gained $solution_gain solution progress"
    echo -e "Fatigue +${RED}1${NC}"
  fi

  echo -e "\n${BLUE}You spend time researching.${NC}"
  if [ "$intelligence_gain" -le 2 ]; then
    echo -e "You barely make any progress."
  elif [ "$intelligence_gain" -le 5 ]; then
    echo -e "You feel a bit smarter."
  elif [ "$intelligence_gain" -le 9 ]; then
    echo -e "You feel much smarter."
  else
    echo -e "You're a genius!"
  fi

  if [ "$empathy_loss" -le 0 ]; then
    # do nothing
    :
  elif [ "$empathy_loss" -le 2 ]; then
    echo -e "You feel slightly less empathetic."
  elif [ "$empathy_loss" -le 5 ]; then
    echo -e "You feel less connected to others."
  elif [ "$empathy_loss" -le 9 ]; then
    echo -e "You feel much colder."
  else
    echo -e "You feel soulless."
  fi
  echo -e "${RED}You grow more fatigued.${NC}"
  if [ "$solution_gain" -le 5 ]; then
    echo -e "You make a little progress."
  elif [ "$solution_gain" -le 6 ]; then
    echo -e "You make some noticeable progress."
  elif [ "$solution_gain" -le 8 ]; then
    echo -e "You make significant progress."
  else
    echo -e "You make a lot of progress!"
  fi
  interlude
  if [ "$solution_progress" -ge 50 ] && [ "$FLAG_learned_the_truth" = false ]; then
    FLAG_learned_the_truth=true
    dialogue "Alex." "true" "${CYAN}" "0.05"
    dialogue "..." "true" "${NC}" "0.07"
    dialogue "I've seen the report." "true" "${CYAN}" "0.02"
    dialogue "It's a disaster." "true" "${CYAN}" "0.07"
    dialogue "We can still fix this!" "true" "${NC}" "0.02"
    dialogue "We're barely halfway through, and the deadline is in \${RED}$((14 - $player_day)) days\${CYAN}." "true" "${CYAN}" "0.02"
    dialogue "It's still too reactive. I'm sure we can stabilize it before then." "true" "${NC}" "0.02"
    dialogue "And if we can't? Imagine all the good our work could have done, gone if they shut us down." "true" "${CYAN}" "0.02"
    dialogue "Yeah. I'll try and work some overtime this week." "true" "${NC}" "0.02"
    dialogue "You'd better. Nothing else matters like this does." "true" "${CYAN}" "0.03"
    dialogue "Bzz! Bzz! Bzz!" "true" "${VIOLET}" "0.001"
    dialogue "Put your phone on silent. It's distracting you." "true" "${CYAN}" "0.03"
    interlude
  fi

  if [ "$solution_progress" -ge 100 ] && [ "$FLAG_solved_the_problem" = false ]; then
    FLAG_solved_the_problem=true
    dialogue "Holy crap!" "true" "${CYAN}" "0.01"
    dialogue "It's stable!" "true" "${CYAN}" "0.01"
    dialogue "Good job, Alex!" "true" "${CYAN}" "0.01"
    dialogue "Thanks. I'm glad I could be a part of this." "true" "${NC}" "0.01"
    dialogue "Your phone is silent." "true" "${GRAY}" "0.001"
    interlude
  fi
}

# Function to interact with violet
interaction() {
  if [ "$FLAG_violet_left" = true ]; then
    dialogue "You call \${VIOLET}Violet\${GRAY}." "true" "${GRAY}" "0.02"
    dialogue "ring... ring... ring..." "true" "${VIOLET}" "0.08"

    if [ "$FLAG_violet_secondary" = true ]; then
      dialogue "The caller you're trying to reach is unavailable." "true" "${GRAY}" "0.005"
      echo -e "${GRAY}She blocked your number.${NC}"
      interlude
      return
    fi

    if [ "$FLAG_solved_the_problem" = true ] && [ "$violet_neglect_count" -gt 5 ]; then
      FLAG_violet_secondary=true
      dialogue "Hey." "true" "${VIOLET}" "0.04"
      dialogue "I didn't think you'd pick up!" "true" "${NC}" "0.02"
      dialogue "Why did you even call?" "true" "${VIOLET}" "0.02"
      dialogue "Because I still love you!" "true" "${NC}" "0.02"
      dialogue "No. I saw the news. You love your work. Now that it's over, I'm your rebound." "true" "${VIOLET}" "0.02"
      dialogue "That's no-" "${NC}" "0.01"
      dialogue "She hung up." "true" "${GRAY}" "0.01"
      interlude
      return
    fi

    dialogue "After being ignored for a long time, it goes to voicemail." "true" "${GRAY}" "0.005"
    dialogue "You know she probably won't listen to one anyway." "true" "${GRAY}" "0.005"
    interlude
    return
  fi

  # Base values
  local empathy_gain=$((RANDOM % 4 + 3))
  local intelligence_loss=$((RANDOM % 4))
  local affection_gain=$((RANDOM % 3 + 1))

  # Adjust based on fatigue (tired = less effective)
  local fatigue_penalty=$((player_fatigue / 2))
  empathy_gain=$((empathy_gain - fatigue_penalty))

  # Ensure gains don't go below minimum
  if [ "$empathy_gain" -lt 2 ]; then empathy_gain=2; fi
  if [ "$affection_gain" -lt 1 ]; then affection_gain=1; fi

  player_empathy=$((player_empathy + empathy_gain))
  player_intelligence=$((player_intelligence - intelligence_loss))
  if [ "$player_intelligence" -lt 0 ]; then player_intelligence=0; fi
  violet_affection=$((violet_affection + affection_gain))
  player_fatigue=$((player_fatigue + 1))

  if [ "$debug_mode" = true ]; then
    echo -e "Gained $empathy_gain empathy"
    echo -e "Lost $intelligence_loss intelligence"
    echo -e "Gained $affection_gain affection with Violet"
    echo -e "Fatigue +${RED}1${NC}"
  fi

  echo -e "\n${BLUE}You spend time with Violet.${NC}"
  if [ "$empathy_gain" -le 2 ]; then
    echo -e "You barely feel more connected."
  elif [ "$empathy_gain" -le 5 ]; then
    echo -e "You feel a bit more empathetic."
  elif [ "$empathy_gain" -le 9 ]; then
    echo -e "You feel much more empathetic."
  else
    echo -e "You're overflowing with compassion!"
  fi

  if [ "$intelligence_loss" -le 0 ]; then
    # do nothing
    :
  elif [ "$intelligence_loss" -le 2 ]; then
    echo -e "You feel slightly less focused on your work."
  elif [ "$intelligence_loss" -le 5 ]; then
    echo -e "You feel less interested in research."
  else
    echo -e "Your mind is far from your work."
  fi
  echo -e "${RED}You grow more fatigued.${NC}"
  if [ "$affection_gain" -le 1 ]; then
    echo -e "Violet seems a little happier."
  elif [ "$affection_gain" -le 2 ]; then
    echo -e "Violet seems noticeably happier with you."
  elif [ "$affection_gain" -le 3 ]; then
    echo -e "Violet seems significantly happier with you."
  else
    echo -e "Violet is beaming with joy!"
  fi
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
  if [ "$FLAG_solved_the_problem" = true ] && [ "$FLAG_violet_secondary" = true ]; then
    dialogue "You try to fall asleep, but you feel restless and guilty." "true" "${GRAY}" "0.02"
    dialogue "Without your work, or her, you are truly alone." "true" "${GRAY}" "0.02"
    interlude
    return
  fi
  local fatigue_loss=$((RANDOM % 2 + 2))
  player_fatigue=$((player_fatigue - fatigue_loss))

  if [ "$time_of_day" = "evening" ]; then
    echo -e "\n${BLUE}You fall asleep early.${NC}"
  else
    echo -e "\n${BLUE}You take a nap.${NC}"
  fi
  echo -e "Fatigue -${GREEN}$fatigue_loss${NC}"
  if [ "$player_fatigue" -lt 0 ]; then
    player_fatigue=0
  fi
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

    if [ "$player_fatigue" -le 2 ]; then
      echo -e "${GREEN}You feel energetic.${NC}"
    elif [ "$player_fatigue" -le 5 ]; then
      echo -e "${YELLOW}You feel somewhat fatigued.${NC}"
    else
      echo -e "${RED}You are exhausted. Maybe you should nap?${NC}"
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
      get_choice "Take a shift in the lab" "Stay at home for dinner" "Sleep early"
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
  read -r -p $'\n• • •\n'
}

# Function to advance to next day
next_day() {
  clear_screen
  player_day=$((player_day + 1))
  player_fatigue=$((player_fatigue - 1)) # fatigue decreases over time
  if [ "$player_fatigue" -lt 0 ]; then player_fatigue=0; fi
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
  if [ "$FLAG_solved_the_problem" = true ] && [ "$FLAG_violet_left" = true ]; then
    echo "sacrifice_love"
  elif [ "$FLAG_solved_the_problem" = false ] && [ "$FLAG_violet_left" = false ]; then
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

  interlude
  clear_screen
  dialogue "The deadline has arrived." "true" "${GRAY}" "0.05"

  if [ "$ending" = "sacrifice_love" ]; then
    dialogue "Good job, Alex." "true" "${GRAY}" "0.05"
    dialogue "You turned your back on those you loved." "true" "${GRAY}" "0.05"
    dialogue "Those who loved you." "true" "${GRAY}" "0.05"
    dialogue "Your name might be remembered in history books, but there will be no one to celebrate it." "true" "${GRAY}" "0.05"
    dialogue "You made the world a better place." "true" "${GRAY}" "0.05"

  elif [ "$ending" = "sacrifice_world" ]; then
    dialogue "The deadline has arrived. Your work remains unfinished." "true" "${GRAY}" "0.05"
    dialogue "Your boss shut down the project." "true" "${GRAY}" "0.05"
    dialogue "And fired you." "true" "${GRAY}" "0.05"
    dialogue "The world will never know what you could have done." "true" "${GRAY}" "0.05"
    dialogue "But at least you have Violet." "true" "${GRAY}" "0.05"

  else
    dialogue "You failed. Your solution remains unfinished, your relationship with Violet a series of missed connections and growing resentment." "true" "${GRAY}" "0.05"
    dialogue "Now, you sit alone in your apartment, haunted by the ghosts of what could have been." "true" "${GRAY}" "0.05"
    dialogue "Too little intelligence to help humanity." "true" "${GRAY}" "0.05"
    dialogue "Too little empathy to save her." "true" "${GRAY}" "0.05"
    dialogue "In trying to balance both worlds, you succeeded in neither." "true" "${GRAY}" "0.05"
  fi

  interlude
  dialogue "THE END" "true" "${GRAY}" "0.05"
  local ending_number
  case $ending in
  "sacrifice_love")
    ending_number=2
    ;;
  "sacrifice_world")
    ending_number=3
    ;;
  "total_failure")
    ending_number=1
    ;;
  *)
    ending_number=0
    ;;
  esac
  dialogue "Ending $ending_number of 3" "true" "${GRAY}" "0.05"
  interlude
  case $ending_number in
  1)
    echo -e "Thanks for playing! I hope you enjoyed your failure."
    ;;
  2)
    echo -e "Thanks for playing! I hope you enjoyed your sacrifice."
    ;;
  3)
    echo -e "Thanks for playing! I hope you enjoyed your sacrifice."
    ;;
  *)
    echo -e "Thanks for playing! I hope you enjoyed."
    ;;
  esac
  echo -e "Press Enter to exit."
  read -r
}

# Function to display debug information
display_debug_info() {
  if [ "$debug_mode" = true ]; then
    echo -e "\n${YELLOW}===== DEBUG INFO =====${NC}"
    echo -e "Day: ${CYAN}$player_day${NC}"
    echo -e "Time: ${CYAN}$time_of_day${NC}"
    echo -e "Intelligence: ${GREEN}$player_intelligence${NC}"
    echo -e "Empathy: ${GREEN}$player_empathy${NC}"
    echo -e "Violet Affection: ${GREEN}$violet_affection${NC}"
    echo -e "Violet Neglect Count: ${RED}$violet_neglect_count${NC}"
    echo -e "Work Amount: ${GREEN}$worked_amount${NC}"
    echo -e "Work Neglect Count: ${RED}$work_neglect_count${NC}"
    echo -e "Fatigue: ${RED}$player_fatigue${NC}"
    echo -e "Solution Progress: ${GREEN}$solution_progress${NC}"
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
      dialogue "Hey, I didn't see you much yesterday!" "true" "${VIOLET}" "0.04"
      dialogue "Whoops! I'm sorry!" "true" "${NC}" "0.03"
      dialogue "I've been a bit busy with work." "true" "${NC}" "0.03"
      dialogue "Well, I miss you." "true" "${VIOLET}" "0.03"
      dialogue "I'll try to make it up to you today!" "true" "${NC}" "0.04"
      ;;
    2)
      dialogue "Missed you again, where were you?" "true" "${VIOLET}" "0.03"
      dialogue "Oh, work. I'm sorry, I didn't realize." "true" "${NC}" "0.02"
      dialogue "Try to eat at home with me sometimes." "true" "${VIOLET}" "0.02"
      dialogue "No problem!" "true" "${NC}" "0.03"
      ;;
    3)
      dialogue "Why have you been ignoring me?" "true" "${VIOLET}" "0.01"
      dialogue "Well, I'm expected to work two shifts a day, which doesn't leave much time." "true" "${NC}" "0.04"
      dialogue "oh." "true" "${VIOLET}" "0.08"
      ;;
    4)
      dialogue "\${VIOLET}Violet\${GRAY} left you a note." "true" "${GRAY}" "0.03"
      dialogue "Headed out early. I didn't think you'd mind." "true" "${VIOLET}" "0.04"
      ;;
    5)
      dialogue "When you wake up, Violet is gone." "true" "${GRAY}" "0.03"
      dialogue "You check your phone." "true" "${GRAY}" "0.03"
      dialogue "I'm surprised you even bothered to read this." "true" "${VIOLET}" "0.01"
      dialogue "Anyways, we're done. I hope you find someone who cares a little less about you." "true" "${VIOLET}" "0.01"
      dialogue "Someone who's okay being neglected." "true" "${VIOLET}" "0.01"
      FLAG_violet_left=true
      ;;
    6)
      dialogue "Your bed is cold and empty." "true" "${GRAY}" "0.01"
      ;;
    7)
      dialogue "Your bed is cold and empty." "true" "${GRAY}" "0.01"
      ;;
    8)
      dialogue "Your bed is cold and empty." "true" "${GRAY}" "0.01"
      ;;
    9)
      dialogue "Your bed is cold and empty." "true" "${GRAY}" "0.01"
      ;;
    10)
      dialogue "Your bed is cold and empty." "true" "${GRAY}" "0.01"
      ;;
    11)
      dialogue "Your bed is cold and empty." "true" "${GRAY}" "0.01"
      ;;
    12)
      dialogue "Your bed is cold and empty." "true" "${GRAY}" "0.01"
      ;;
    esac
    interlude
  fi
  if [ "$worked_amount" -lt "$expected_work" ] && [ "$FLAG_solved_the_problem" = false ]; then
    work_neglect_count=$((work_neglect_count + 1))
    case $work_neglect_count in
    1)
      dialogue "You haven't worked at the lab for your contracted two shifts per day." "true" "${GRAY}" "0.02"
      ;;
    2)
      dialogue "You have an email from your coworker." "true" "${GRAY}" "0.02"
      dialogue "hey alex, was wondering why you haven't been in the lab much lately." "true" "${CYAN}" "0.02"
      dialogue "hope everything is okay!" "true" "${CYAN}" "0.02"
      ;;
    3)
      dialogue "You have an email from your boss." "true" "${GRAY}" "0.02"
      dialogue "Hey Alex, everything alright? We haven't seen you at the lab for your scheduled shifts." "true" "${GRAY}" "0.02"
      dialogue "Best, Boss" "true" "${GRAY}" "0.02"
      ;;
    4)
      dialogue "You have an email from your coworker." "true" "${GRAY}" "0.02"
      dialogue "dude, we need you in the lab. we're running out of time." "true" "${CYAN}" "0.02"
      ;;
    5)
      dialogue "You have an email from your boss." "true" "${GRAY}" "0.02"
      dialogue "For your absence, you are no longer eligible for your end-of-year bonus." "true" "${GRAY}" "0.02"
      ;;
    6)
      dialogue "You have an email from your coworker." "true" "${GRAY}" "0.02"
      dialogue "are you trying to get fired??" "true" "${CYAN}" "0.02"
      ;;
    7)
      dialogue "You have an email from your boss." "true" "${GRAY}" "0.02"
      dialogue "Don't bother coming in anymore." "true" "${GRAY}" "0.02"
      FLAG_fired=true
      ;;
    8)
      dialogue "You don't have any new emails." "true" "${GRAY}" "0.02"
      dialogue "Have they forgotten about you already?" "true" "${GRAY}" "0.02"
      ;;
    9)
      dialogue "No new emails." "true" "${GRAY}" "0.02"
      ;;
    10)
      dialogue "No new emails." "true" "${GRAY}" "0.02"
      ;;
    11)
      dialogue "No new emails." "true" "${GRAY}" "0.02"
      ;;
    12)
      dialogue "No new emails." "true" "${GRAY}" "0.02"
      ;;
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
    dialogue "Bzz! Bzz! Bzz!" "true" "${VIOLET}" "0.001"
    dialogue "It's \${VIOLET}Violet\${NC}, I've got to go." "true" "${NC}" "0.02"
    dialogue "Get some rest, you look exhausted. We'll pick this up tomorrow." "true" "${CYAN}" "0.02"
    dialogue "Bzz! Bzz! Bzz!" "true" "${VIOLET}" "0.001"
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

    if [ "$player_day" -ge 14 ]; then
      end_game
    fi

    morning_events
    daily_actions
    clear_screen
    echo -e "${BLUE}After a long day, you finally get to sleep.${NC}"

  done
}

# Start the game
run_game
