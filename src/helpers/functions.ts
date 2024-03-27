export const getInitials = (firstName: string, lastName: string) => {
  const firstNameInitial = firstName.substring(0, 1)
  const lastNameInitial = lastName.substring(0, 1)

  return firstNameInitial + lastNameInitial
}
