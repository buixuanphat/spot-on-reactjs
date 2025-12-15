import { Box, Button, Typography } from "@mui/joy";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../Contexts";
import { color, role } from "../configs/Enum";
import logo from "../assets/spoton_logo.png";

const Index = () => {
    const nav = useNavigate();
    const user = useContext(MyUserContext);

    useEffect(() => {
        if (user) {
            if (user.role === role.admin) nav('users');
            else if (user.role === role.organizer) nav('events');
            else if (user.role === role.staff) nav('organizers');
        }
    }, []);

    return (
        <Box
            sx={{
                width: '100vh',
                height: '100vh',
                mx: "auto",
                my: "10vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "lg",
                bgcolor: color.background,
                boxShadow: "lg",
            }}
        >
            <img src={logo} alt="Logo" style={{ maxWidth: "50%", maxHeight: "50%" }} />

            <Typography
                level="h4"
                noWrap={false}
            >
                Đăng nhập để tiếp tục
            </Typography>


            <Button
                size="lg"
                onClick={() => nav("/log-in")}
                sx={{ marginTop: 1 }}
            >
                Đăng nhập
            </Button>

        </Box>
    );
};

export default Index;
