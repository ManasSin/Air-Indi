export const AuthRoles = {
  OWNER: "OWNER",
  USER: "USER",
  MODERATOR: "MODERATOR",
  STAFF: "STAFF",
  MARKETER: "MARKETER",
};

export const CheckRole = (AuthRoles, givenRole) => {
  if (AuthRoles.includes(givenRole)) {
    return true;
  }
  return false;
};
