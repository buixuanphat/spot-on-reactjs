import { CheckCircleFilled } from "@ant-design/icons"
import { Button } from "antd"

const AcceptButton = ({ onClick, style, loading }) => {
    return (
        <Button loading={loading} icon={<CheckCircleFilled />} variant="solid" color="green" onClick={onClick} style={style} >Xác thực</Button>
    )
}
export default AcceptButton