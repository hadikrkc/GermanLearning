import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const Page = () => (
  <Card>
    <div style={{ textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}></div>
      <Title level={3}></Title>
      <Text type="secondary"></Text>
      <br /><br />
      <Text type="secondary" style={{ fontSize: 12 }}>Coming in Sprint 2</Text>
    </div>
  </Card>
);

export default Page;
