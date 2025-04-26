function calculateStreak(entries) {
  let streak = 0;
  let currentStreak = 0;

  // Traverse through the entries in reverse order (starting from the most recent day)
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].saved) {
      currentStreak += 1;
    } else {
      break; // As soon as a day is missed, break out of the loop
    }
  }

  // If you want to store the streak in the database
  streak = currentStreak;

  return streak;
}
