 export function userCheck() {
  const username = localStorage.getItem("username");

  if (!username) {
    return { valid: false, error: "You must be logged in to access this page." };
  }

  return { valid: true, user: username };
}
