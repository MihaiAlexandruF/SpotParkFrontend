import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  usernameOrEmail: yup.string().required("Email or username is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
}); 