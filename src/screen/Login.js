import { Box, Input, Stack, Button, Typography } from "@mui/joy";
import logo from "../assets/spoton_logo.png";
import { useContext, useState } from "react";
import Apis, { authApis, endpoints } from "../configs/Apis";
import ErrorDialog from "../components/ErrorDialog";
import cookie from 'react-cookies'
import { MyDispatchContext } from "../Contexts";
import { useNavigate } from "react-router-dom";
import { role } from "../configs/Enum";
import { Form } from "antd";



const Login = () => {
    const nav = useNavigate();

    const [info, setInfo] = useState({});

    const [openDialog, setOpenDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const dispatch = useContext(MyDispatchContext);

    const [loading, setLoading] = useState(false);

    const login = async () => {
        try {
            setLoading(true)
            let res = await Apis.post(endpoints.logIn, info);
            cookie.save('token', res.data.data.token)

            let user = await authApis().get(endpoints['currentUser']);

            dispatch({
                type: 'log-in',
                payload: user.data.data
            })

            user.data.data.role === role.organizer && nav('/events');
            user.data.data.role === role.admin && nav('/users');
        }
        catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            setOpenDialog(true);
        }
        finally {
            setLoading(false);
        }
    }

    const handleKeydown = (e) => {
        if (e.key === "Enter") console.log("enter");
    }
    window.addEventListener("keydown", handleKeydown);

    return (
        <Stack
            direction="row"
            sx={{
                height: "100vh",
                width: "100%",
            }}
        >
            <Box sx={{
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: 'center'
            }} >
                <Form
                    onFinish={login}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}>
                    <Typography level="h3">Đăng Nhập</Typography>
                    <Box sx={{ width: "50%", mt: 2 }} >
                        <Input color="neutral" placeholder="Email" variant="soft" type="email" value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} />
                    </Box>

                    <Box sx={{ width: "50%", mt: 2 }} >
                        <Input color="neutral" placeholder="Password" variant="soft" type="password" value={info.password} onChange={e => setInfo({ ...info, password: e.target.value })} />
                    </Box>
                    <Button loading={loading} sx={{ mt: 2, width: "50%" }} type="submit" >Đăng Nhập</Button>

                </Form>
            </Box>



            <Box
                sx={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "1rem",
                    margin: "2rem"
                }}
            >
                <img src={logo} alt="Logo" style={{ maxWidth: "70%", maxHeight: "70%" }} />
            </Box>
            <ErrorDialog open={openDialog} message={errorMessage} onClose={() => setOpenDialog(false)} />
        </Stack>
    );
};

export default Login;
