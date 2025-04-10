export function generateRandomAvatar() {
  const seed = Math.random().toString(36).substring(2, 10); // random string
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
}
