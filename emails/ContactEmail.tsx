import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface ContactEmailProps {
    name: string;
    message: string;
  }
  
  export default function ContactUsEmail({ name, message }: ContactEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Thank you for contacting us!</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Thank you for reaching out, {name}!</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {name},</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for contacting us. We have received your message and will get back to you as soon as possible.
            </Text>
          </Row>
          <Row>
            <Text>Your message:</Text>
          </Row>
          <Row>
            <Text>{message}</Text>
          </Row>
          <Row>
            <Text>
              If you have any additional questions or concerns, please feel free to reply to this email.
            </Text>
          </Row>
        </Section>
      </Html>
    );
  }
  