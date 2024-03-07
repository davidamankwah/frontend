import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";

const signUpSchema = yup.object().shape({
  userName: yup.string().required("required"),
  emailAddress: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  pic: yup.string().required("required"),
});

const signUpinitial = {
  userName: "",
  emailAddress: "",
  password: "",
  pic: "",
};

const signInSchema = yup.object().shape({
  emailAddress: yup.string().email("email failed").required("required"),
  password: yup.string().required("required"),
});

const Logininitial = {
  emailAddress: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    console.log("Register function called with values:", values)
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.pic.name);

  const savedUserResponse = await fetch("https://frontend-dnnx.onrender.com/auth/register", {
  method: "POST",
  body: formData,
});

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      console.log("Logging in with valuesxxx:");
      console.log(JSON.stringify(values));
      const loggedInResponse = await fetch("https://frontend-dnnx.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const loggedIn = await loggedInResponse.json();
      console.log("Logged in response:", loggedIn);
      onSubmitProps.resetForm();
  
      if (loggedIn) {
        console.log("Dispatching login action with user:", loggedIn.user);
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        console.log("Navigating to /home");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  }

  return (
    <Formik 
    onSubmit={handleFormSubmit}
    initialValues={isLogin ? Logininitial : signUpinitial}
    validationSchema={isLogin ? signInSchema : signUpSchema}
  >
          {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => ( 
        <form onSubmit={handleSubmit}>
           <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {
              isRegister && (
                <>
                <TextField
                 label="Username"
                 onBlur={handleBlur}
                onChange={handleChange}
                value={values.userName || ""} // Ensure a default value of an empty string
                name="userName"
                error={Boolean(touched.userName) && Boolean(errors.userName)}
                helperText={touched.userName && errors.userName}
                 sx={{ gridColumn: "span 2" }}
                />

                 <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                 >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("pic", acceptedFiles[0])
                    }
                  >
                     {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.pic ? (
                          <p>Add Image</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.pic.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                 </Box>
                </>
              )
            }
               <TextField
              label="Email Address"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.emailAddress}
              name="emailAddress"
              error={Boolean(touched.emailAddress) && Boolean(errors.emailAddress)}
              helperText={touched.emailAddress && errors.emailAddress}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

            {/* BUTTONS */}
            <Box>
            <Button
             fullWidth
             type="submit"
             sx={{
               m: "2rem 0",
               p: "1rem",
               backgroundColor: palette.primary.main,
               color: palette.background.alt,
               "&:hover": { color: palette.primary.main },
             }}
            >
               {isLogin ? "SIGN IN" : "SIGN UP"}
            </Button>
              <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Sign In here."}
            </Typography>
            </Box>
        </form>
      )} 
    </Formik>
  );
};

export default Form;