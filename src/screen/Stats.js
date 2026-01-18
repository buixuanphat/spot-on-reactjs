import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { authApis, endpoints } from "../configs/Apis"
import { Select, Card, Row, Col, Typography, Space } from "antd"

const { Title } = Typography;


const CustomBarChart = ({ data, title, dataKey = "total", color = "#22c55e", unit = "đ" }) => {
    const gradientId = `color-${title.replace(/\s+/g, '-')}`;
    return (
        <Card title={title} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}M` : v.toLocaleString()}
                        />
                        <Tooltip
                            cursor={{ fill: '#f9fafb' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [`${value.toLocaleString("vi-VN")} ${unit}`, title]}
                        />
                        <Bar
                            dataKey={dataKey}
                            fill={`url(#${gradientId})`}
                            radius={[6, 6, 0, 0]}
                            barSize={35}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const Stats = () => {
    const now = new Date();
    const [eventPayment, setEventPayment] = useState([])
    const [eventTicket, setEventTicket] = useState([])
    const [organizerPayment, setOrganizerPayment] = useState([])
    const [organizerTicket, setOrganizerTicket] = useState([])

    const [eventMonth, setEventMonth] = useState(now.getMonth() + 1);
    const [eventYear, setEventYear] = useState(now.getFullYear());
    const [organizerMonth, setOrganizerMonth] = useState(now.getMonth() + 1);
    const [organizerYear, setOrganizerYear] = useState(now.getFullYear());

    const loadData = async (type, month, year, setPay, setTick) => {
        try {
            const payRes = await authApis().get(`${endpoints[`get${type}PaymentStat`]}?month=${month}&year=${year}`);
            const tickRes = await authApis().get(`${endpoints[`get${type}TicketStat`]}?month=${month}&year=${year}`);
            setPay(payRes.data.data);
            setTick(tickRes.data.data);
        } catch (e) { console.error(e); }
    }

    useEffect(() => {
        loadData('Event', eventMonth, eventYear, setEventPayment, setEventTicket);
    }, [eventMonth, eventYear]);

    useEffect(() => {
        loadData('Organizer', organizerMonth, organizerYear, setOrganizerPayment, setOrganizerTicket);
    }, [organizerMonth, organizerYear]);

    const Months = Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }));
    const Years = Array.from({ length: 6 }, (_, i) => ({ label: `Năm ${now.getFullYear() - i}`, value: now.getFullYear() - i }));

    return (
        <div style={{ padding: '24px', minHeight: '100vh' }}>
            <Title level={3}>THỐNG KÊ</Title>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Section 1 */}
                <Card size="small" style={{ background: 'transparent', border: 'none' }}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Thống kê Sự kiện</Title>
                        <Space>
                            <Select options={Months} value={eventMonth} onChange={setEventMonth} style={{ width: 110 }} />
                            <Select options={Years} value={eventYear} onChange={setEventYear} style={{ width: 110 }} />
                        </Space>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}><CustomBarChart data={eventPayment} title="Doanh thu" color="#10b981" /></Col>
                        <Col span={12}><CustomBarChart data={eventTicket} title="Vé bán ra" color="#3b82f6" unit="vé" /></Col>
                    </Row>
                </Card>

                {/* Section 2 */}
                <Card size="small" style={{ background: 'transparent', border: 'none' }}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Thống kê Ban tổ chức</Title>
                        <Space>
                            <Select options={Months} value={organizerMonth} onChange={setOrganizerMonth} style={{ width: 110 }} />
                            <Select options={Years} value={organizerYear} onChange={setOrganizerYear} style={{ width: 110 }} />
                        </Space>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}><CustomBarChart data={organizerPayment} title="Doanh thu BTC" color="#8b5cf6" /></Col>
                        <Col span={12}><CustomBarChart data={organizerTicket} title="Vé theo BTC" color="#f59e0b" unit="vé" /></Col>
                    </Row>
                </Card>
            </Space>
        </div>
    )
}

export default Stats