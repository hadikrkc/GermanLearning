import React from 'react';
import { Row, Col, Card, Typography, Tag, Space } from 'antd';
import { BookOutlined, LineChartOutlined, SoundOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const featureCards = [
    {
      icon: <BookOutlined style={{ fontSize: 28, color: '#3e82f7' }} />,
      title: t('dashboard.feature.vocabulary.title'),
      desc: t('dashboard.feature.vocabulary.desc'),
    },
    {
      icon: <LineChartOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
      title: t('dashboard.feature.grammar.title'),
      desc: t('dashboard.feature.grammar.desc'),
    },
    {
      icon: <SoundOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
      title: t('dashboard.feature.listening.title'),
      desc: t('dashboard.feature.listening.desc'),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Title level={3} style={{ marginBottom: 4 }}>
          {t('dashboard.greeting', { name: user?.displayName ?? 'Learner' })}
        </Title>
        <Text type="secondary">{t('dashboard.subtitle')}</Text>
      </div>

      <Row gutter={[16, 16]}>
        {featureCards.map((card) => (
          <Col xs={24} sm={12} lg={8} key={card.title}>
            <Card hoverable>
              <Space direction="vertical" size={8}>
                {card.icon}
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{card.title}</div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{card.desc}</Text>
                </div>
                <Tag color="orange">{t('dashboard.comingSoon')}</Tag>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {user?.role === 'ADMIN' && (
        <Card style={{ marginTop: 24, background: '#f0f5ff', border: '1px solid #adc6ff' }}>
          <Title level={5} style={{ color: '#1d39c4', marginBottom: 4 }}>
            {t('dashboard.adminPanel.title')}
          </Title>
          <Text style={{ color: '#2f54eb' }}>
            {t('dashboard.adminPanel.desc')}
          </Text>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
