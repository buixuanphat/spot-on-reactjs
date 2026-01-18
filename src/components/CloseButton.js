import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons"
import { Button } from "antd"

const CloseButton = ({ onClick, style, loading }) => {
    return (
        <Button loading={loading} icon={<CloseCircleFilled />} variant="solid" color="danger" onClick={onClick} style={style} >Hủy</Button>
    )
}
export default CloseButton