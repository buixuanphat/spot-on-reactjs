import { Box, Button, Typography, Stack } from "@mui/joy";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../Contexts";
import { MyColor, role } from "../configs/Enum";
import logo from "../assets/spoton_logo.png";
import { Divider } from "antd";

const Index = () => {
    const nav = useNavigate();
    const user = useContext(MyUserContext);

    useEffect(() => {
        if (user) {
            if (user.role === role.admin) nav('users');
            else if (user.role === role.organizer) nav('events');
            else if (user.role === role.staff) nav('organizers');
        }
    }, [user, nav]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100%",
                bgcolor: MyColor.background,
            }}
        >
            <Box
                sx={{
                    width: { xs: "90%", sm: 400 },
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "xl",
                    bgcolor: "background.surface",
                    boxShadow: "xl",
                    textAlign: "center"
                }}
            >

                <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "160px", marginBottom: "24px" }}
                />

                <Typography level="h3" sx={{ mb: 1 }}>
                    Chào mừng
                </Typography>

                <Typography level="body-md" sx={{ mb: 4, color: "text.secondary" }}>
                    Đăng nhập để tiếp tục
                </Typography>

                <Stack spacing={2} sx={{ width: "100%" }}>

                    <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        onClick={() => nav("/log-in")}
                    >
                        Đăng nhập
                    </Button>

                    <Divider sx={{ my: 1 }}>hoặc</Divider>


                    <Button
                        size="lg"
                        variant="outlined"
                        color="neutral"
                        onClick={() => nav("/organizers/register")}
                    >
                        Đăng ký Ban tổ chức
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default Index;