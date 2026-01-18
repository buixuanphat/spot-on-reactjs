import { useEffect, useState } from "react"
import { authApis, endpoints } from "../configs/Apis"
import { useParams } from "react-router-dom"
import { Alert, CircularProgress, Table, Typography } from "@mui/joy"

const TicketInfo = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [used, setUsed] = useState(0)
    const [available, setAvailable] = useState(0)

    const params = useParams()

    const loadData = async () => {
        try {
            setLoading(true)
            const res = await authApis().get(
                endpoints['getTicketInfo'](params.eventId)
            )

            const list = res.data.data
            setData(list)

            const stat = list.reduce(
                (acc, d) => {
                    acc.total++
                    acc[d.status] = (acc[d.status] || 0) + 1
                    return acc
                },
                { total: 0 }
            )
            console.log(stat)
            setTotal(stat.total)
            setAvailable(stat.available)
            setUsed(stat.used)

        } catch (e) {
            console.error("Lỗi khi lấy thông tin vé của sự kiện", e)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        loadData()
    }, [])

    const status = {
        'expired': 'Đã hết hạn',
        'used': 'Đã sử dụng',
        'available': 'Chưa sử dụng'
    }

    return (
        <div style={{ marginTop: 50, marginBottom: 50 }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                {total && <Typography>Tổng: {total}</Typography>}
                {available && <Typography>Chưa sử dụng: {available}</Typography>}
                {used && <Typography>Đã sử dụng: {used}</Typography>}
            </div>

            {loading && <CircularProgress style={{}} />}
            {!loading && data.length > 0 ?
                <Table
                    sx={{ mt: 1 }}
                    aria-label="basic table" borderAxis="both"
                    color="neutral"
                    size="lg"
                    stickyFooter={false}
                    stickyHeader
                    stripe="even"
                    hoverRow="true"
                    variant="outlined">
                    <thead>
                        <tr>
                            <th>Mã vé</th>
                            <th>Tên vé</th>
                            <th>Họ người mua</th>
                            <th>Tên người mua</th>
                            <th>Địa chỉ email</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data).map(d =>
                            <tr key={d.id} style={{ cursor: 'pointer' }}>
                                <td>{d.id}</td>
                                <td>{d.section_name}</td>
                                <td>{d.firstname}</td>
                                <td>{d.lastname}</td>
                                <td>{d.email}</td>
                                <td>{status[d.status]}</td>
                            </tr>
                        )}
                    </tbody>
                </Table> :
                <Alert
                    color="danger"
                    size="md"
                    variant="soft"
                >Không tìm thấy dữ liệu</Alert>

            }
        </div>)
}
export default TicketInfo