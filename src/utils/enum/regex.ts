enum Regex {
  EMAIL = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]+[.]+[a-zA-Z0-9]+$",
  PASSWORD = "^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
}

export default Regex;
