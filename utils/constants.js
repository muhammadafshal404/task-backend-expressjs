module.exports = {
  SORT_ORDER: {
    ASC: "ascend",
    DESC: "descend",
  },
  WELCOME_EMAIL: {
    SUBJECT: "Welcome Task",
  },
  JWT_CONSTANT: {
    secret:
      "DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.",
  },
  MESSAGES: {
    EMAIL_SENT: "Email is sent on Your provided Email Address.",
    USER_ALREADY_EXIST: "User with this email already exist.",
    ONLY_ALPHANUMERIC_VALUES_AND_SPACE_ALLOWED:
      "Only alphanumeric characters and spaces allowed",

    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    EMAIL_SHOULD_BE_STRING: "Email should be string",
    PASSWORD_SHOULD_BE_STRING: "Password should be string",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    INCORRECT_EMAIL_OR_PASSWORD: "Incorrect Email or Password",
    UNAUTHORIZATION_ERROR: "Unauthorized",
    CATEGORY_NAME_REQUIRED: "Name is Required",
    NAME_SHOULD_BE_STRING: "Name should be String",
  },
  PUBLIC_PATHS: ["/auth/login", "/auth/signup"],
};
