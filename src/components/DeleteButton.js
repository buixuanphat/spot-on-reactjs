import { CheckCircleFilled, DeleteFilled } from "@ant-design/icons"
import { Button } from "antd"

const DeleteButton = ({ onClick, style, loading }) => {
    return (
        <Button loading={loading} icon={<DeleteFilled />} variant="solid" color="danger" onClick={onClick} style={style} >Xóa</Button>
    )
}
export default DeleteButton