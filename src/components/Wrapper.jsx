import { Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "1rem",
  boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
  color: theme.palette.background.alt,
}));

export default StyledWrapper;
