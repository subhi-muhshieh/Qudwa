import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function NewActivityEmail({
  parentName = 'ولي الأمر',
  activityTitle = 'نشاط جديد',
  activityDescription = '',
  activityDate = '',
  activityImage = '',
  isUpcoming = false,
}) {
  const baseUrl = 'https://qudwa.pages.dev';

  return (
    <Html dir="rtl">
      <Head />
      <Preview>نشاط جديد من منظمة قدوة - {activityTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Img
            src={`${baseUrl}/logo.png`}
            width="80"
            height="80"
            alt="قدوة"
            style={logo}
          />

          {/* Header */}
          <Heading style={heading}>
            مرحباً {parentName}! 👋
          </Heading>

          {/* Activity Type Badge */}
          <Section style={badgeContainer}>
            <Text style={isUpcoming ? upcomingBadge : pastBadge}>
              {isUpcoming ? '🎯 نشاط قادم' : '✨ نشاط جديد'}
            </Text>
          </Section>

          {/* Activity Title */}
          <Heading as="h2" style={activityTitleStyle}>
            {activityTitle}
          </Heading>

          {/* Activity Image */}
          {activityImage && (
            <Img
              src={activityImage}
              width="100%"
              height="auto"
              alt={activityTitle}
              style={activityImageStyle}
            />
          )}

          {/* Activity Description */}
          <Text style={paragraph}>
            {activityDescription}
          </Text>

          {/* Activity Date */}
          {activityDate && (
            <Section style={dateSection}>
              <Text style={dateText}>
                📅 التاريخ: {activityDate}
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          {/* CTA Button */}
          <Section style={btnContainer}>
            <Button
              style={button}
              href={`${baseUrl}/dashboard`}
            >
              عرض التفاصيل الكاملة
            </Button>
          </Section>

          <Text style={footerText}>
            أطيب التحيات،
            <br />
            فريق منظمة قدوة
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            منظمة قدوة - جيلٌ يبني، أثرٌ يبقى
          </Text>

          {/* Social Links */}
          <Section style={socialLinks}>
            <Link href="https://www.instagram.com/QudwaAssoc" style={socialLink}>
              Instagram
            </Link>
            {' · '}
            <Link href="https://www.facebook.com/QudwaAssoc" style={socialLink}>
              Facebook
            </Link>
            {' · '}
            <Link href="https://t.me/QudwaAssoc" style={socialLink}>
              Telegram
            </Link>
          </Section>

          {/* Unsubscribe */}
          <Text style={unsubscribe}>
            إذا كنت لا تريد تلقي هذه الرسائل،{' '}
            <Link href={`${baseUrl}/unsubscribe`} style={unsubscribeLink}>
              إلغاء الاشتراك
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 20px 48px',
  backgroundColor: '#ffffff',
  borderRadius: '5px',
  maxWidth: '580px',
  marginTop: '40px',
  marginBottom: '40px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
  marginBottom: '20px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a1a1a',
  textAlign: 'center',
  margin: '30px 0',
};

const badgeContainer = {
  textAlign: 'center',
  margin: '20px 0',
};

const upcomingBadge = {
  display: 'inline-block',
  padding: '8px 16px',
  backgroundColor: '#10b981',
  color: '#ffffff',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
};

const pastBadge = {
  display: 'inline-block',
  padding: '8px 16px',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
};

const activityTitleStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'center',
  margin: '20px 0',
};

const activityImageStyle = {
  borderRadius: '10px',
  marginBottom: '20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#525252',
  textAlign: 'right',
  margin: '16px 0',
};

const dateSection = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '12px',
  margin: '20px 0',
};

const dateText = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1a1a1a',
  textAlign: 'center',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const btnContainer = {
  textAlign: 'center',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 30px',
};

const footerText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#525252',
  textAlign: 'center',
  margin: '30px 0',
};

const footer = {
  fontSize: '14px',
  color: '#9ca3af',
  textAlign: 'center',
  margin: '20px 0',
};

const socialLinks = {
  textAlign: 'center',
  margin: '20px 0',
};

const socialLink = {
  color: '#3b82f6',
  textDecoration: 'none',
  fontSize: '14px',
  margin: '0 5px',
};

const unsubscribe = {
  fontSize: '12px',
  color: '#9ca3af',
  textAlign: 'center',
  margin: '20px 0 0',
};

const unsubscribeLink = {
  color: '#3b82f6',
  textDecoration: 'underline',
};