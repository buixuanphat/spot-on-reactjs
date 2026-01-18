import { CloseCircleFilled } from "@ant-design/icons"
import { Button } from "antd"

const RejectButton = ({ onClick, style, loading }) => {
    return (
        <Button loading={loading} icon={<CloseCircleFilled />} variant="solid" color="danger" onClick={onClick} style={style} >Từ chối</Button>
    )
}
export default RejectButton